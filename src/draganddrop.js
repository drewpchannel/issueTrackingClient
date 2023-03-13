import * as React from 'react';

class FileZone extends React.Component {

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
    var file = e.dataTransfer.files[0],
        reader = new FileReader();
    reader.onload = function(event) {
      let fileString = String(event.target.result);
      let fileArray = fileString.split('');
      let newString;
      fileArray.forEach((index => {
        if (/([A-Za-z\r\n !@#$%^&*():,.])/.test(index)) {
          newString = newString + index;
        }
      }))
      //cut off unneeded top half of document
      let firstSubjInd = newString.match("Subject: ");
      newString = newString.substr(firstSubjInd.index + 9);
      //second subject line has the real message below it
      let secondSubjInd = newString.match("Subject: ");
      newString = newString.substr(secondSubjInd.index + 9);
      //find new line where subject ends
      const subjEndInd = newString.match(/\n/);
      //console.log('Subject: ' + newString.substr(0, subjEndInd.index));
      //console.log('Body Preview: ' + newString.substr(subjEndInd.index + 1, 300));
    };
    //console.log(file);
    reader.readAsText(file);
  }

  render() {
    return (
      <div
        onDragEnter={this.onDragEnter}
        onDragOver={this.onDragOver}
        onDrop={this.onFileDrop}>
        Drag and drop file here
      </div>)
  }
}

export default FileZone;