import { myIP } from './serverip';

async function getSavedTickets(username) {
  return fetch(`http://${myIP}:3001/ticketCheck`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json',},
    body: JSON.stringify({"user": [{username: username}]})
  })
  .then(response => response.json(),
  error => console.log(error),
  )
  .then(response => {
    return response.dbRes;
  })
}

export default getSavedTickets; 