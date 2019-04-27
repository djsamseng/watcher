import React from "react";

const Electron = window.require("electron");

class CommandLine extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({
            message: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const text = this.state.message;
        Electron.ipcRenderer.send("async-message", {
            command: {
                text,
            }
        });
        this.resetState();
    }
    resetState() {
        this.setState({
            message: ""
        });
    }
    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
            >
                <input
                    onChange={this.handleChange}
                    value={this.state.message}
                    type="text"
                />
            </form>    
        );
    }
}

export default CommandLine;
