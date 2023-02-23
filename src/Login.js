import React from "react";

//change data name and move into the class to wait for user info
var jsonData = {
  "users": [
      {
          "name": "alan", 
          "password": "123",
      }
  ]
}

class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        valueUsername: '',
        valuePassword: ''
    };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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
      console.log("json: " + jsonData);
      console.log("json string" + JSON.stringify(jsonData));
      fetch("http://localhost:3001/createuser", {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(jsonData)
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