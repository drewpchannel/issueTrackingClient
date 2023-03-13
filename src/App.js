import { useState, useEffect} from 'react'
import logo from "./logo.svg";
import "./App.css";
import FileZone from './draganddrop.js';

const serverIp = '10.16.35.54';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://${serverIp}:3001/api`)
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? "Loading..." : data}</p>
        <FileZone />
      </header>
    </div>
  );
}

export default App;