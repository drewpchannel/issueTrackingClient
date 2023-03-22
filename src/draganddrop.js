import * as React from 'react';

const serverIp = '10.16.35.54';

class FileZone extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      tickets: [
        { id: 0, subject: "something 1", body: "this email message 1"},
        { id: 1, subject: "something 2", body: "this email message 2"},
      ]
    }
  }

  onDragOver = (e) => {
    e.dataTransfer.effectAllowed = "all";
    e.stopPropagation();
    e.preventDefault();
  }

  onDragEnter = (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
    e.dataTransfer.effectAllowed = "all";
    e.stopPropagation();
    e.preventDefault();
  }

  onFileDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();

    fetch(`http://${serverIp}:3001/emailDrop`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json',},
      body: JSON.stringify({"user": [{username: 'drew'}]})
    })
    .then(response => response.json(),
    error => console.log(error)
    )
    .then(response => {
      console.log(response);
    })

    //var file = e.dataTransfer.files[0],
    //    reader = new FileReader();
    /*
    reader.onload = function(event) {
      let fileString = String(event.target.result);
      let fileArray = fileString.split('');
      let newString;
      fileArray.forEach((index => {
        if (/([A-Za-z\r\n !@#$%^&*():,.])/.test(index)) {
          newString = newString + index;
        }
      }));
      let firstSubjInd = newString.match("Subject: ");
      newString = newString.substr(firstSubjInd.index + 9);
      //if forwards, not working 100% yet but may be in future

      //if (secondSubjInd) {
      //  newString = newString.substr(secondSubjInd.index + 9);
      //}

      //find new line where subject ends

      const subjEndInd = newString.match(/\n/);
      console.log('Subject: ' + newString.substr(0, subjEndInd.index));
      console.log('Body Preview: ' + newString.substr(subjEndInd.index + 5, 300));

      let newTickets = this.state.tickets;
      newTickets.push({
        id: newTickets.length,
        subject: newString.substr(0, subjEndInd.index),
        body: newString.substr(subjEndInd.index + 5, 300)
      }) 
      this.setState({tickets: newTickets});
    }.bind(this);
    
    reader.readAsText(file);
    */
  }

  render() {
    return (
      <div
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDrop={this.onFileDrop}>
        Drag and drop file here
        {this.state.tickets.map((tickets) => {
          return <li key={tickets.id}>
            {tickets.subject} {tickets.body}
          </li>
        })}
      </div>)
  }
}

export default FileZone;