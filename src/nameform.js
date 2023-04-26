import React from "react";
import './nameform.css'
import { myIP } from './serverip';
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
      fetch(`http://${myIP}:3001/createuser`, {
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
          if(document.cookie.length === 0) {
            document.cookie = `userIsLoggedIn=${this.state.valueUsername};`
            this.setState({cookieNameData: document.cookie.split('=')[1]});
            this.setState({isLoggedIn: true});
            window.location.reload();
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

    checkForCookie() {
      let cookie = document.cookie;
      if(!document.cookie || document.cookie === '') {
        this.setState({cookieNameData: cookie.split('=')[1]});
      } else {
        this.setState({isLoggedIn: true});
        this.setState({cookieNameData: cookie.split('=')[1]});
      }
    }

    handleLogout() {
      document.cookie = `userIsLoggedIn=${document.cookie.split('=')[1]}; expires=Thu, 18 Dec 2013 12:00:00 UTC`
      window.location.reload();
    }

    render() {
      let loginStatus;
      let isPassInvalid;

      if (this.state.cookieNameData) {
        loginStatus = 
        <div className="loggedInInfo">
          <p>Welcome {this.state.cookieNameData}</p>
          <button className="logoutButton" onClick={this.handleLogout}>Logout</button>
        </div>
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