import React from "react";

//change data name and move into the class to wait for user info

class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        valueUsername: '',
        valuePassword: '',
        jsonData: ''
    };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    createJsonUser(){
      this.jsonData = {
        "user": [
            {
                "name": this.state.valueUsername, 
                "password": this.state.valuePassword,
            }
        ]
      }
      return this.jsonData;
    }
  
    handleChange(event) {
      if(event.target.type === "text") {
        this.setState({valueUsername: event.target.value});
      }
      if(event.target.type === "password") {
        this.setState({valuePassword: event.target.value});
      }
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.valueUsername + ' pass: ' + this.state.valuePassword);
      console.log("json: " + this.createJsonUser());
      console.log("json string" + JSON.stringify(this.createJsonUser()));
      fetch("http://localhost:3001/createuser", {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(this.createJsonUser())
      });
      event.preventDefault();
    }
  
    render() {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>
              Username:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
              Password:
              <input type="password" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <p>{this.state.valueUsername}</p>
          <p>{this.state.valuePassword}</p>
        </div>
      );
    }
  }

  export default NameForm;