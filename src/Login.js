import React from "react";
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
      this.state = {value: ''};
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      alert('A name was submitted: ' + this.state.value);
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
              Name:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <p>{this.state.value}</p>
        </div>
      );
    }
  }

  export default NameForm;