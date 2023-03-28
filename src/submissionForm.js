import * as React from 'react';

const serverIp = '10.16.35.54';

class FileZone extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      tickets: [
        { id: 0, asubject: "something 1", abody: "this email message 1"},
        { id: 1, asubject: "something 2", abody: "this email message 2"},
      ],
      subjectField : '',
      bodyField : '',
      fromField: '',
    }
  }

  //shouldn't be in submission form, loads initial tickets
  getSavedTickets() {
    if (document.cookie.length > 0) {
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
        this.setState({tickets: response.dbRes});
      })
    }
  }

  componentDidMount() {
    this.getSavedTickets(document.cookie.split('=')[1]);
  }

  setFrom(e) {
    this.setState({fromField: e});
  }

  setSubject(e) {
    this.setState({subjectField: e});
  }

  setBody(e) {
    this.setState({bodyField: e});
  }

  onTicketSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    let ticketInfo = {
    "ticket": [{
        "id" : Date(),
        "afrom" : this.state.fromField,
        "asubject" : this.state.subjectField,
        "abody": this.state.bodyField
      }]
    }

    fetch(`http://${serverIp}:3001/updateTickets`, {
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
      this.getSavedTickets();
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onTicketSubmit}>
          <label>Enter From Here: 
            <input 
              type="text" 
              onChange={(e) => this.setFrom(e.target.value)}
            />
          </label>

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
            From: {tickets.afrom} Subject: {tickets.asubject} Body: {tickets.abody}
          </li>
        })}
      </div>)
  }
}

export default FileZone;