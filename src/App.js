import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [savedInput, setSavedInput] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const saveInput = () => {
    setSavedInput(userInput);
    setIsSidebarOpen(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <text>MyShop.AI</text>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="form-control search-bar" />
          <button className="btn btn-primary search-button">Search</button>
        </div>
        <button onClick={toggleSidebar} className="btn btn-secondary" style={{ position: 'absolute', top: 10, right: 10 }}>
          Context
        </button>
        {isSidebarOpen && (
          <div className="overlay">
            <div className="sidebar">
              <input type="text" placeholder="Add a context" value={userInput} onChange={handleInputChange} className="form-control" />
              <button onClick={saveInput} className="btn btn-success mt-2">Save</button>
            </div>
          </div>
        )}
        {savedInput && <p>{savedInput}</p>}
      </header>
    </div>
  );
}

export default App;