
const Electron = window.require("electron");

class ElectronInterface {
    sendToElectron(data) {
        Electron.ipcRenderer.send("async-message", data);
    }
    subscribeToElectron(key, callback) {
        Electron.ipcRenderer.on("async-message", (evt, arg) => {
            if (key) {
                if (arg && arg.key && arg.key === key) {
                    callback(arg);
                }
            }
            else {
                callback(arg);
            }
        });
    }
}

export default ElectronInterface;
