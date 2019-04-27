import React from "react";

class ChatSelectorEntry extends React.Component {
    render() {
        return (
            <button
                onClick={ this.props.handleRoomSelected }
            >
                { this.props.name }
            </button>
        );
    }
}

class ChatSelector extends React.Component {
    test() {
        console.log("test");
    }
    render() {
        const rooms = this.props.rooms.map(room => {
            return (
                <ChatSelectorEntry 
                    key={ room.id }
                    name={ room.name }
                    handleRoomSelected={ this.props.handleRoomSelected.bind(undefined, room) }
                />
            );
        });
        return (
            <div>
                { rooms }
            </div>
        );
    }
}

export default ChatSelector;
