import React from "react";
import MessageList from "./MessageList";
import SendMessageForm from "./SendMessageForm";

const TEST_MESSAGES = [];

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: TEST_MESSAGES,
	    roomId: "test",
        };
        this.sendMessage = this.sendMessage.bind(this);
    } 
    
    sendMessage(text) {
	const messages = this.state.messages;
	const num = messages.length;
	const message = {
	    id: "messageId" + num,
	    text,
            sendId: "senderId",
	};
        this.props.handleMessageAdded(this.props.room.id, message);
        // Electron.ipcRenderer.send("async-message", text);
    }
    
    render() {
        return (
            <div className="app">
                { this.props.room.name }
              <MessageList 
                  messages={this.props.room.messages} />
              <SendMessageForm
                  sendMessage={this.sendMessage} />
            </div>
        );
    }
}


export default ChatRoom;
