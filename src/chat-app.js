import React from "react"
//import React, { Component } from "react";

import MainContent from "./MainContent";

const Electron = window.require("electron");

Electron.ipcRenderer.on("async-message", (evt, arg) => {
    console.log(arg);
});

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
