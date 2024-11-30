import React, { useState } from 'react';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [savedInput, setSavedInput] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

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

  const handleSearch = (event) => {
    if (event.type === 'click') {
      setIsSearchActive(true);
      // Add logic to perform the search and display results
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className={`search-container ${isSearchActive ? 'active' : ''}`}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onFocus={handleSearch}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
          <button
            onClick={toggleSidebar}
            className="btn btn-secondary"
            style={{ marginLeft: '10px' }}
          >
            Context
          </button>
        </div>
        {isSidebarOpen && (
          <div className="overlay">
            <div className="sidebar">
              <input
                type="text"
                placeholder="Add a context"
                value={userInput}
                onChange={handleInputChange}
                className="form-control"
              />
              <button onClick={saveInput} className="btn btn-success mt-2">
                Save
              </button>
            </div>
          </div>
        )}
        {savedInput && <p>{savedInput}</p>}
        {isSearchActive && (
          <div className="search-results">
            {/* Render search results here */}
            <p>Search results will appear here.</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;