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
  const [ticketFormToggle, setTicketFormToggle] = useState(false);
  const [chgState, setChgState] = useState([]);
  const [chgInput, setChangeInput] = useState('');
  const [userList, setUserList] = useState([document.cookie.split('=')[1]]);
  const [userListTog, setUserListTog] = useState(false);
  const [userListInput, setUserListInput] = useState('');
  const [ticketFilter, setFilter] = useState('');
  const [filterTog, setFilterTog] = useState(false);

  const refreshTickets = () => {
    if (!document.cookie.split('=')[1]) { return; }
    if (userList === []) {
      if (document.cookie.length > 0) {
        getSavedTickets().then((response) => {
          setTickets(response.reverse());
        })
      }
    } else {
      let ticketsCurrent = [];
      userList.forEach(elem => {
        getSavedTickets(elem).then((response) => {
          let filteredArray = response;
          if (ticketFilter) {
            filteredArray = [];
            response.forEach((elem) => {
              if (elem.asubject === ticketFilter) {
                filteredArray.push(elem);
              }
            });
          }
          ticketsCurrent = ticketsCurrent.concat(filteredArray);
          setTickets(ticketsCurrent);
        })
      });
    }
  }

  //may need to return something to stop refreshes from happening.  may only be necessary for event listeners
  useEffect(() => {
    refreshTickets();
    // eslint-disable-next-line
  }, []);

  const handleFrom = e => setFrom(e.target.value);

  const handleSubject = e => setSubject(e.target.value);

  const handleBody = e => setBody(e.target.value);

  const handleChange = e => setChangeInput(e.target.value);

  const handleUserListInput = e => setUserListInput(e.target.value);

  const handleFilter = e => setFilter(e.target.value);

  const onTicketSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
    let bodyValidated;
    let fromValidated;
    let subjectValidated;

    //Left fields expanded to check for SQL injection checks
    if (bodyField.length > 1099) {
      alert('1100 character limit');
      bodyValidated = bodyField.slice(0, 1099);
    } else {
      bodyValidated = bodyField;
    }

    if (subjectField.length > 79) {
      subjectValidated = subjectField.slice(0, 79);
    } else {
      subjectValidated = subjectField;
    }
    
    if (fromField.length > 79) {
      fromValidated = fromField.slice(0, 79);
    } else {
      fromValidated = fromField
    }

    let ticketInfo = {
    "ticket": [{
        "id" : Date().slice(0,25),
        "afrom" : fromValidated,
        "asubject" : subjectValidated,
        "abody": bodyValidated
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

  const showTicketForm = (e) => setTicketFormToggle(!ticketFormToggle);

  const chgStateToggle = (i) => {
    //checks if false or undfined, spreads it by ticket number, uses the index number from map, and sets it.
    chgState[i]
      ? setChgState({ ...chgState, [i]: !chgState[i] })
      : setChgState({ ...chgState, [i]: true });
  };

  const onChgSumbit = (id) => {
    if(chgInput !== '') {
      fetch(`http://${myIP}:3001/ticketChange`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json',},
        body: JSON.stringify({username: document.cookie.split('=')[1], id: id, changeText: chgInput})
      })
      .then(response => response.json(),
      error => console.log(error)
      )
      .then(response => {
        refreshTickets();
      })
    }
  }

  //later on make this get a list from the server of everyone in userlogins.  pop the default and use that for auto name correction
  const addToQue = () => setUserListTog(!userListTog);

  const addToQueSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
    let x = userList;
    x.push(userListInput);
    setUserList(x);
    refreshTickets();
  }

  const doFilterTog = () => setFilterTog(!filterTog);

  const filterTickets = e => {
    e.stopPropagation();
    e.preventDefault();
    refreshTickets();
  }

  return (
    <div>
      <button onClick={doFilterTog}>Filter Tickets</button>
      {filterTog &&
        <div>
          <form onSubmit={filterTickets}>
            <div className="form-outline">
              <label className="form-label" htmlFor="textAreaFrom">Filter: </label>
              <textarea className="form-control" id="textAreaFrom" rows="1" onChange={handleFilter}></textarea>
            </div>
            <input className="btn btn-primary" type="submit" />
          </form>;
        </div>
      }      
      <button onClick={addToQue}>Add Users Ques</button>
      {userListTog &&
        <div>
          <form onSubmit={addToQueSubmit}>
            <div className="form-outline">
              <label className="form-label" htmlFor="textAreaFrom">Username: </label>
              <textarea className="form-control" id="textAreaFrom" rows="1" onChange={handleUserListInput}></textarea>
            </div>
            <input className="btn btn-primary" type="submit" />
          </form>;
        </div>
      }
      <button onClick={showTicketForm}>New Ticket</button>
      {ticketFormToggle &&
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
          </form>;
        </div>
      }
      <p />
      {tickets.map((ticket, index) => {
        return <li key={ticket.id} className="card text-white bg-dark mb-3">
          <div className="card-header">From: {ticket.afrom}</div>
          <div className="card-body">
            <div className="buttonBox">
              <div className="card-title subjecttext">Subject: {ticket.asubject}</div>
            </div>
            <div className="buttonBox">
              <div className="card-text bodytext">{ticket.abody}</div>
            </div>
          </div>
          <div>
            <button className="btn btn-primary buttonSubCSS" onClick={() => deleteTicket(ticket)} variant="primary">Del</button>
            <button className="btn btn-primary buttonSubCSS" onClick={() => chgStateToggle(index)} variant="primary">Chg</button>
            {chgState[index] && 
              <form onSubmit={() => onChgSumbit(ticket.id)}>
                <div className="form-outline">
                  <label className="form-label" htmlFor="textAreaFrom">Change: </label>
                  <textarea className="form-control" id="textAreaFrom" rows="1" onChange={handleChange}></textarea>
                </div>
                <input className="btn btn-primary" type="submit" />
              </form>
            }
          </div>
        </li>
      })}
    </div>
  )
}

export default SubmissionForm;