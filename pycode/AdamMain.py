import pprint
from pymongo import MongoClient

class AdamMain:
    def __init__(self, receiveConn, sendConn, key):
        self.__receiveConn = receiveConn
        self.__sendConn = sendConn
        self.__key = key
        self.__runAdamMain()

    def __runAdamMain(self):
        self.__initFromDb()
        while True:
            hasConnData = self.__receiveConn.poll(1)
            if (hasConnData):
                msg = self.__receiveConn.recv()
                print(self.__key + " received:" + msg)
    def __initFromDb(self):
        client = MongoClient()
        db = client.watcher
        collection = db.AdamMain
        data = collection.find_one({"_id": self.__key})
        print("Init from db key:", self.__key, " data:", data)

#Global
s_adamMain = None
def createAdamMain(receiveConn, sendConn, key):
    s_adamMain = AdamMain(receiveConn, 
                          sendConn, 
                          key)
