
## Run

1) /usr/local/opt/rabbitmq/sbin/rabbitmq-server
2) yarn start
3) yarn electron
4) python3 pycode/request-processor.py

- React talks to Electron using Electron.ipcMain and Electron.ipcRenderer
- Electron talks to Python using RabbitMQ [amqp://localhost](amqp://localhost)

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage
1) Commandline: start (starts connection to RabbitMQ)
2) Commandline: exit (ends connection to RabbitMQ)

