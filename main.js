// Modules to control application life and create native browser window
const Electron = require("electron");
const {app, BrowserWindow} = Electron;
const ChildProcess = require("child_process");
const { PythonShell } = require("python-shell");
const amqp = require("amqplib/callback_api");

let amqpConn;
let amqpChannel;
const queue = "hello";

let isConnected = false;
function connect() {
    amqp.connect("amqp://localhost", (error, conn) => {
        amqpConn = conn;
        conn.createChannel((error, channel) => {
            amqpChannel = channel;
            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, new Buffer("Message uno"));
            console.log("Sent Message uno");
            isConnected = true;
        });
    });
}

function disconnect() {
    if (isConnected) {
        console.log("Closing connection to RabbitMQ");
        isConnected = false;
        amqpConn.close();
    }
    else {
        console.log("Cannot disconnect: Not connected");
    }
}

function sendToRabbitMQ(text) {
    if (text && text.length > 0) {
        if (isConnected) {
            amqpChannel.sendToQueue(queue, new Buffer(text));
        }
        else {
            console.log("Not connected cannot send:", text);
        }
    }
    else {
        console.log("Invalid text cannot send:", text);
    }
}

Electron.ipcMain.on("async-message", (evt, arg) => {
    if (arg && arg.command) {
        const text = arg.command.text;
        switch (text) {
            case "exit": {
                disconnect();
            } break;
            case "start": {
                connect();
            } break;
            default: {
                sendToRabbitMQ(text);
            } break;
        }
    }
    else {
        console.log(arg);
    }
    mainWindow.webContents.send("async-message", "ack");
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL("http://localhost:3000");

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  disconnect();
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
