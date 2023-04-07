import React, { useState, useEffect } from 'react';
import { myIP } from './serverip'
import getSavedTickets from './getTickets'
import 'bootstrap/dist/css/bootstrap.min.css'
import './submissionForm.css'

function SubmissionForm () {
  const [tickets, setTickets] = useState(
    [
      { id: 0, afrom: "NoOne", asubject: "Example 1", abody: "this email message 1"},
      { id: 1, afrom: "NoTwo", asubject: "Example 2", abody: "this email message 2"},
    ]
  );
  const [subjectField, setSubject] = useState('');
  const [bodyField, setBody] = useState('');
  const [fromField, setFrom] = useState('');

  useEffect(() => {
    refreshTickets();
  }, []);

  const refreshTickets = () => {
    if (document.cookie.length > 0) {
      getSavedTickets().then((response) => setTickets(response.reverse()));
    }
  }

  const handleFrom = e => setFrom(e.target.value);

  const handleSubject = e => setSubject(e.target.value);

  const handleBody = e => setBody(e.target.value);

  const onTicketSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
    
    let ticketInfo = {
    "ticket": [{
        "id" : Date(),
        "afrom" : fromField,
        "asubject" : subjectField,
        "abody": bodyField
      }]
    }

    fetch(`http://${myIP}:3001/updateTickets`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json',},
      body: JSON.stringify({"user": [{username: document.cookie.split('=')[1], file: ticketInfo}]})
    })
    .then(response => response.json(),
    error => console.log(error)
    )
    .then(response => {
      refreshTickets();
      setBody('');
      setFrom('');
      setSubject('');
      e.target[0].value = '';
      e.target[1].value = '';
      e.target[2].value = '';
    })
  }

  const deleteTicket = (tickets) => {
    fetch(`http://${myIP}:3001/ticketDelete`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json',},
      body: JSON.stringify({username: document.cookie.split('=')[1], id: tickets.id})
    })
    .then(response => response.json(),
    error => console.log(error)
    )
    .then(response => {
      refreshTickets();
    })
  }

  return (
    <div>
      <form onSubmit={onTicketSubmit}>

        <div className="form-outline">
          <label className="form-label" htmlFor="textAreaFrom">From: </label>
          <textarea className="form-control" id="textAreaFrom" rows="1" onChange={handleFrom}></textarea>
        </div>

        <div className="form-outline">
          <label className="form-label" htmlFor="textAreaSubject">Subject: </label>
          <textarea className="form-control" id="textAreaSubject" rows="1" onChange={handleSubject}></textarea>
        </div>

        <div className="form-outline">
          <label className="form-label" htmlFor="textAreaBody">Body: </label>
          <textarea className="form-control" id="textAreaBody" rows="4" onChange={handleBody}></textarea>
        </div>
        <input className="btn btn-primary" type="submit" />
      </form>
      <p />
      {tickets.map((tickets) => {
        return <li key={tickets.id} className="card text-white bg-dark mb-3">
          <div className="card-header">From: {tickets.afrom}</div>
          <div className="card-body">
            <div className="buttonBox">
              <button className="btn btn-outline-info">Upd</button>
              <div className="card-title" className="subjecttext">Subject: {tickets.asubject}</div>
            </div>
            <div className="buttonBox">
              <button className="btn btn-outline-info">Upd</button>
              <div className="card-text" className="bodytext">{tickets.abody}</div>
            </div>
          </div>
          <div>
            <button className="btn btn-primary" onClick={() => deleteTicket(tickets)} variant="primary">Del</button>
          </div>
        </li>
      })}
    </div>
  )
}

export default SubmissionForm;