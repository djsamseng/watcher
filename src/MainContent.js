import React from "react";
import ChatRoom from "./ChatRoom";
import ChatSelector from "./ChatSelector";
import CommandLine from "./CommandLine";

class MainContent extends React.Component {
    constructor(props) {
        super(props);
        let selectedRoom;
        if (this.props.rooms.length > 0) {
            selectedRoom = this.props.rooms[0];
        }
        this.state = {
            selectedRoom,
        };
    }
    handleRoomSelected(room) {
        this.setState({
            selectedRoom: room
        });
    }
    render() {
        let selectedRoom;
        if (this.state.selectedRoom) {
            selectedRoom = (
                <ChatRoom room={this.state.selectedRoom}
                          handleMessageAdded={this.props.handleMessageAdded} />
            );
        }
        return (
            <div>
                <ChatSelector rooms={this.props.rooms}
                              handleRoomSelected={this.handleRoomSelected.bind(this)}
                />
                { selectedRoom }
                <CommandLine 
                    handleCommand={this.props.handleCommand}
                />
            </div>
        );
    }
}

export default MainContent;
