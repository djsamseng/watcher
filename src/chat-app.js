import React, { Component } from "react";
import * as ChildProcess from "child_process";
const Electron = window.require("electron");

const TEST_MESSAGES = [];

Electron.ipcRenderer.on("async-message", (evt, arg) => {
    console.log(arg);
});

class App extends React.Component {
    constructor() {
        super()
        this.state = {
            messages: TEST_MESSAGES,
	    roomId: "test",
        };
        this.sendMessage = this.sendMessage.bind(this);
    } 
    
    componentDidMount() {
        /*const chatManager = new Chatkit.ChatManager({
            instanceLocator: instanceLocator,
            userId: 'janedoe',
            tokenProvider: new Chatkit.TokenProvider({
                url: testToken
            })
        })
        
        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser
            this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onNewMessage: message => {

                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                }
            }
        })
      })*/
    }
    
    sendMessage(text) {
	const messages = this.state.messages;
	const num = messages.length;
	messages.push({
	    id: "messageId" + num,
	    text,
            sendId: "senderId",
	});
	this.setState({
	    messages,
	});
        Electron.ipcRenderer.send("async-message", text);
    }
    
    render() {
        return (
            <div className="app">
              <Title />
              <MessageList 
                  roomId={this.state.roomId}
                  messages={this.state.messages} />
              <SendMessageForm
                  sendMessage={this.sendMessage} />
            </div>
        );
    }
}

class MessageList extends React.Component {
    render() {
        return (
            <ul className="message-list">
                {this.props.messages.map((message, index) => {
                    return (
                      <li  key={message.id} className="message">
                        <div>{message.senderId}</div>
                        <div>{message.text}</div>
                      </li>
                    )
                })}
            </ul>
        )
    }
}

class SendMessageForm extends React.Component {
    constructor() {
        super()
        this.state = {
            message: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    
    handleChange(e) {
        this.setState({
            message: e.target.value
        })
    }
    
    handleSubmit(e) {
        e.preventDefault()
        this.props.sendMessage(this.state.message)
        this.setState({
            message: ''
        })
    }
    
    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
                className="send-message-form">
                <input
                    onChange={this.handleChange}
                    value={this.state.message}
                    placeholder="Type your message and hit ENTER"
                    type="text" />
            </form>
        )
    }
}

function Title() {
  return <p className="title">My awesome chat app</p>
}

export default App;
