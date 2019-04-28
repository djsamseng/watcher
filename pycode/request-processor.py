import json
import pika
import numpy as np

from multiprocessing import Process, Pipe, RawArray

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
                args["sharedRawArray"],
                args["sharedRawArrayShape"]
            )
        )
        self.__process.start()
    def sendMessage(self, msg):
        self.__sendConn.send(msg)

def createNewAdam(args):
    if args["key"] in s_adams:
        print(args["key"] + " already exists, name:" + args["name"])
        s_adams[args["key"]].sendMessage("test")
        return
    
    s_adams[args["key"]] = AdamHandle(args)

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
    args["sharedRawArray"] = dat[1]
    args["sharedRawArrayShape"] = dat[2]
    createNewAdam(args)

def requestProcessorMain(): 
    connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
    channel = connection.channel()
    channel.queue_declare(queue="hello")
    channel.basic_consume(queue="hello",
                          auto_ack=True,
                          on_message_callback=onQueueMessage)
    print("To exit press Ctrl+C")
    channel.start_consuming()

if __name__ == "__main__":
    requestProcessorMain()
