

class AdamMain:
    def __init__(self, receiveConn, sendConn, key, rawArray, shape):
        self.__receiveConn = receiveConn
        self.__sendConn = sendConn
        self.__key = key
        self.__runAdamMain()

    def __runAdamMain(self):
        while True:
            hasConnData = self.__receiveConn.poll(1)
            if (hasConnData):
                print(self.__key + " received data")
                msg = self.__receiveConn.recv()
                print(self.__key + " received:" + msg)

#Global
s_adamMain = None
def createAdamMain(receiveConn, sendConn, key, sharedRawArray, sharedRawArrayShape):
    s_adamMain = AdamMain(receiveConn, 
                          sendConn, 
                          key, 
                          sharedRawArray, 
                          sharedRawArrayShape)
