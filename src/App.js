import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [savedInput, setSavedInput] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loadedImage, setLoadedImage] = useState(null);

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
    }
  };

  const dummyImage = {
    url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+1',
    title: 'Sample Title 1',
    description: 'Sample description for image 1.',
  };

  useEffect(() => {
    if (isSearchActive) {
      setLoadedImage(dummyImage);
    }
  }, [isSearchActive]);

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
        {isSearchActive && loadedImage && (
          <div className="search-results">
            <div className="carousel">
              <div className="carousel-item">
                <img src={loadedImage.url} alt="Dummy 1" />
                <div className="caption">
                  <h4>{loadedImage.title}</h4>
                  <p>{loadedImage.description}</p>
                  <p className="image-url">{loadedImage.url}</p> {/* Display the URL */}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;