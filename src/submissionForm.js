import React, { useState, useEffect } from 'react';
import { myIP } from './serverip'

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
  function getSavedTickets() {
    if (document.cookie.length > 0) {
      fetch(`http://${myIP}:3001/ticketCheck`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify({"user": [{username: document.cookie.split('=')[1]}]})
      })
      .then(response => response.json(),
      error => console.log(error)
      )
      .then(response => {
        setTickets(response.dbRes);
      })
    }
  }

  useEffect (() => {
    getSavedTickets(document.cookie.split('=')[1]);
  }, []);

  const handleFrom = e => {
    setFrom(e.target.value);
  }

  const handleSubject = e => {
    setSubject(e.target.value);
  }

  const handleBody = e => {
    setBody(e.target.value);
  }

  const onTicketSubmit = (e) => {
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
      console.log(response);
      getSavedTickets();
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