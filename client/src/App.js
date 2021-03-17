import React, {useState, useEffect} from 'react'
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setData(data.users))
  })

  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <p>
           { !data ? "Loading..." : JSON.stringify(data) }
        </p>
        
      </header>
    </div>
  );
}

export default App;