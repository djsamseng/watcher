import json
import pika
import numpy as np
import pprint

from multiprocessing import Process, Pipe, RawArray
from pymongo import MongoClient

from AdamMain import createAdamMain

# Key to process handle
s_adams = {}

class AdamHandle():
    def __init__(self, args):
        parentConnSend, childConnReceive = Pipe(True)
        parentConnReceive, childConnSend = Pipe(True)

        self.__receiveConn = parentConnReceive
        self.__sendConn = parentConnSend
        self.__process = Process(
            target=createAdamMain, 
            args=(
                childConnReceive,
                childConnSend,
                args["key"],
            )
        )
        self.__process.start()
    def sendMessage(self, msg):
        self.__sendConn.send(msg)

def getAdamsCollection():
    client = MongoClient()
    db = client.watcher
    collection = db.Adams
    return (client, collection)

def createNewAdam(args):
    if args["name"] in s_adams:
        print(args["name"] + " already exists")
        s_adams[args["name"]].sendMessage("test")
        return
   
    client, collection = getAdamsCollection()
    res = collection.find_one(filter={ "name": args["name"] }, projection=["_id", "name"])
    if res:
        args = {}
        args["key"] = str(res["_id"])
        args["name"] = res["name"]
        print("Restored Adam name:" + args["name"] + " key:" + args["key"])
    else:
        adamObjectId = collection.insert_one({ "name": args["name"] }).inserted_id
        adamKey = str(adamObjectId)
        args["key"] = adamKey
        print("Created new Adam name:" + args["name"] + " key:" + args["key"])

    client.close()
    s_adams[args["name"]] = AdamHandle(args)
    
def genFakeData():
    # Share
    shape = (16, 1000)
    raw = RawArray('d', shape[0] * shape[1])
    # Don't share
    dat = np.zeros(shape, dtype=np.float64)
    datBuf = np.frombuffer(raw, dtype=np.float64).reshape(shape)
    np.copyto(datBuf, dat)
    return (datBuf, raw, shape)

def onQueueMessage(ch, method, properties, body):
    print("Received %r" % body)
    args = {}
    args["key"] = "Adam1"
    args["name"] = "Adam1"
    dat = genFakeData()
    createNewAdam(args)

def initFromDb():
    client, collection = getAdamsCollection()
    dbAdams = collection.find(projection=["_id", "name"])
    print("Restoring dbAdams:" + str(dbAdams.count()))
    for dbAdam in dbAdams:
        pprint.pprint(dbAdam)
        args = {}
        args["key"] = str(dbAdam["_id"])
        args["name"] = dbAdam["name"]
        createNewAdam(args)

    client.close()

def requestProcessorMain(): 
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="hello")
    channel.basic_consume(queue="hello",
                          auto_ack=True,
                          on_message_callback=onQueueMessage)
    print("To exit press Ctrl+C")
    initFromDb()
    channel.start_consuming()

if __name__ == "__main__":
    requestProcessorMain()
