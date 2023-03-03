import React from "react";
//might want to just use hooks for the above
//change data name and move into the class to wait for user info
const serverIp = '10.16.35.54';

class NameForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        valueUsername: '',
        valuePassword: '',
        jsonData: '',
        isLoggedIn: false,
        cookieNameData: '',
        invalidPswd: false,
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
      fetch(`http://${serverIp}:3001/createuser`, {
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
          //I'll need to check for a password and send back something else for incorrect pswd
          if(document.cookie.length === 0) {
            document.cookie = `userIsLoggedIn=${this.state.valueUsername};`
            this.setState({cookieNameData: document.cookie.split('=')[1]});
            this.setState({isLoggedIn: true});
          } else {
            this.setState({cookieNameData: document.cookie.split('=')[1]});
            this.setState({isLoggedIn: true});
          }
        }

        if (response.dbRes === 'created') {
          this.setState({cookieNameData: this.state.valueUsername});
          this.setState({isLoggedIn: true});
          document.cookie = `userIsLoggedIn=${this.state.valueUsername};`
        }

        if (response.dbRes === 'invalid password') {
          this.setState({invalidPswd: true});
        } else {
          this.setState({invalidPswd: false});
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
      let isPassInvalid;

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

      if(this.state.invalidPswd) {
        isPassInvalid = <p>Password Invalid</p>;
      }

      return (
        <div>
          {loginStatus}
          {isPassInvalid}
        </div>
      );
    }
  }

export default NameForm;