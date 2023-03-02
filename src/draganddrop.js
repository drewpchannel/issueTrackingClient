import * as React from 'react';

class FileZone extends React.Component {

  onDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  onDragEnter = (e) => {
    e.stopPropagation();
    e.preventDefault();
  }

  onFileDrop = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log(e.dataTransfer.files[0]);
    alert("dropped")
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