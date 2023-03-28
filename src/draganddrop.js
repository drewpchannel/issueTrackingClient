import * as React from 'react';

const serverIp = '10.16.35.54';

class FileZone extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      tickets: [
        { id: 0, subject: "something 1", body: "this email message 1"},
        { id: 1, subject: "something 2", body: "this email message 2"},
      ],
      someSubjectField : '',
      someBodyField : '',
    }
  }

  getSavedTickets(username) {
    console.log('trying to fetch');
    fetch(`http://${serverIp}:3001/ticketCheck`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json',},
      body: JSON.stringify({"user": [{username: document.cookie.split('=')[1]}]})
    })
    .then(response => response.json(),
    error => console.log(error)
    )
    .then(response => {
      console.log('orig tickets')
      console.log(this.state.tickets)
      this.setState({tickets: response.dbRes});
      console.log('updated tickets')
      console.log(this.state.tickets);
    })
  }

  componentDidMount() {
    this.getSavedTickets(document.cookie.split('=')[1]);
  }

  setSubject(e) {
    this.setState({someSubjectField: e});
  }

  setBody(e) {
    this.setState({someBodyField: e});
  }

  onTicketSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    let ticketInfo = {
      "ticket": [
        {
          "subject" : this.state.someSubjectField,
          "body": this.state.someBodyField
        }
      ]
    }

    fetch(`http://${serverIp}:3001/emailDrop`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json',},
      body: JSON.stringify({"user": [{username: document.cookie.split('=')[1], file: ticketInfo}]})
    })
    .then(response => response.json(),
    error => console.log(error)
    )
    .then(response => {
      console.log(response);
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onTicketSubmit}>
          <label>Enter Subjet Here:
            <input 
              type="text" 
              onChange={(e) => this.setSubject(e.target.value)}
            />
          </label>
          <label>Enter Body Here:
            <input 
              type="text" 
              onChange={(e) => this.setBody(e.target.value)}
            />
          </label>
          <input type="submit" />
        </form>

        {this.state.tickets.map((tickets) => {
          return <li key={tickets.id}>
            {tickets.asubject} {tickets.abody}
          </li>
        })}
      </div>)
  }
}

export default FileZone;