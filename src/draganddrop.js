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
        console.log(event.target.result);
    };
    console.log(file);
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