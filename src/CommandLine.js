import React from "react";
import ElectronInterface from "./ElectronInterface";

class CommandLine extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.d_electronInterface = new ElectronInterface();
    }
    handleChange(e) {
        this.setState({
            message: e.target.value
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const text = this.state.message;
        this.d_electronInterface.sendToElectron({
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
