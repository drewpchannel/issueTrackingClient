import React, { useState, useEffect } from 'react';
import { myIP } from './serverip'
import getSavedTickets from './getTickets'

//form shouldn't also be submitting tickets 

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

  //shouldn't be in submission form, loads initial tickets

  useEffect (() => {
    refreshTickets();
  }, []);

  const refreshTickets = () => {
    if (document.cookie.length > 0) {
      getSavedTickets().then((response) => setTickets(response));
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
      getSavedTickets().then((response) => setTickets(response));
    })
  }

  return (
    <div>
      <form onSubmit={onTicketSubmit}>
        <label>Enter From Here: 
          <input 
            type="text" 
            onChange={handleFrom}
          />
        </label>

        <label>Enter Subjet Here: 
          <input 
            type="text" 
            onChange={handleSubject}
          />
        </label>

        <label>Enter Body Here: 
          <input 
            type="text" 
            onChange={handleBody}
          />
        </label>
        <input type="submit" />
      </form>

      {tickets.map((tickets) => {
        return <li key={tickets.id}>
          From: {tickets.afrom} Subject: {tickets.asubject} Body: {tickets.abody}
        </li>
      })}
    </div>
  )
}

export default SubmissionForm;