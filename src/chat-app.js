import React from "react"
//import React, { Component } from "react";
import ElectronInterface from "./ElectronInterface";

import MainContent from "./MainContent";

const DEFAULT_ROOMS = [
    { 
        name: "Adam1",
        id: "Adam1",
        messages: [],
    },
    {
        name: "Adam2",
        id: "Adam2",
        messages: [],
    },
];

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            rooms: DEFAULT_ROOMS,
            roomIdToIdx: {
                "Adam1": 0,
                "Adam2": 1
            }
        };
        this.d_electronInterface = new ElectronInterface();
        this.d_electronInterface.subscribeToElectron(undefined, (args) => {
            console.log("React received from Electron:", args);
        });
    }
    handleMessageAdded(room, message) {
        const rooms = this.state.rooms;
        const idx = this.state.roomIdToIdx[room.id];
        rooms[idx].messages.push(message);
        this.setState({
            rooms
        });
    }
    render() {
        return (
            <div>
                <Title />
                <MainContent 
                    rooms={this.state.rooms}
                    handleMessageAdded={this.handleMessageAdded.bind(this)} />
            </div>
        );
    }
}

function Title() {
  return <p className="title">My awesome chat app</p>
}

export default App;
