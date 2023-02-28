import React from "react";
//might want to just use hooks for the above
//change data name and move into the class to wait for user info

class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        valueUsername: '',
        valuePassword: '',
        jsonData: '',
        isLoggedIn: false,
        cookieNameData: '',
    };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
      this.checkForCookie();
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
      //alert('A name was submitted: ' + this.state.valueUsername + ' pass: ' + this.state.valuePassword);
      fetch("http://localhost:3001/createuser", {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify(this.createJsonUser())
      })
      .then(response => response.json(),
      error => console.log(error)
      )
      .then((response) => {
        console.log(response)
        if (response.dbRes === 1) {
          this.setState({isLoggedIn: true});
          //I'll need to check for a password and send back something else for incorrect pswd
          if(document.cookie.length === 0) {
            document.cookie = `userIsLoggedIn=${this.state.valueUsername};`
            this.setState({isLoggedIn: true});
          }
        }
        if (response.dbRes === 'created') {
          this.setState({cookieNameData: this.state.valueUsername});
          this.setState({isLoggedIn: true});
          document.cookie = `userIsLoggedIn=${this.state.valueUsername};`
        }
      })
      event.preventDefault()
    }

    //I NEED THIS TO CHECK FOR COOKIES AND UPDATE
    checkForCookie() {
      let cookie = document.cookie;
      if(!document.cookie || document.cookie === '') {
        this.setState({cookieNameData: cookie.split('=')[1]});
      } else {
        this.setState({isLoggedIn: true});
        this.setState({cookieNameData: cookie.split('=')[1]});
      }
    }

    render() {
      let loginStatus;
      if (this.state.cookieNameData) {
        loginStatus = 
        <p>Welcome {this.state.cookieNameData}</p>;
      } else {
        loginStatus =
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
            Password:
            <input type="password" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>;
      }

      return (
        <div>
          {loginStatus}
        </div>
      );
    }
  }

export default NameForm;