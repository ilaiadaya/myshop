import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [savedInput, setSavedInput] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);

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

  const dummyImages = [
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+1',
      title: 'Sample Title 1',
      description: 'Sample description for image 1.',
    },
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+2',
      title: 'Sample Title 2',
      description: 'Sample description for image 2.',
    },
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+3',
      title: 'Sample Title 3',
      description: 'Sample description for image 3.',
    },

    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+1',
      title: 'Sample Title 1',
      description: 'Sample description for image 1.',
    },
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+2',
      title: 'Sample Title 2',
      description: 'Sample description for image 2.',
    },
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+3',
      title: 'Sample Title 3',
      description: 'Sample description for image 3.',
    },

    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+1',
      title: 'Sample Title 1',
      description: 'Sample description for image 1.',
    },
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+2',
      title: 'Sample Title 2',
      description: 'Sample description for image 2.',
    },
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+3',
      title: 'Sample Title 3',
      description: 'Sample description for image 3.',
    },

    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+1',
      title: 'Sample Title 1',
      description: 'Sample description for image 1.',
    },
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+2',
      title: 'Sample Title 2',
      description: 'Sample description for image 2.',
    },
    {
      url: 'https://via.placeholder.com/200x200.png?text=Sample+Image+3',
      title: 'Sample Title 3',
      description: 'Sample description for image 3.',
    },
  ];

  useEffect(() => {
    if (isSearchActive) {
      setLoadedImages(dummyImages);
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
        {isSearchActive && loadedImages.length > 0 && (
          <div className="search-results">
            {loadedImages.map((image, index) => (
              <div
                className="grid-item"
                key={index}
                style={{
                  display: 'inline-block',
                  width: '30%',
                  margin: '1.5%',
                  boxSizing: 'border-box',
                }}
              >
                <img src={image.url} alt={`Dummy ${index + 1}`} />
                <div className="caption">
                  <h4>{image.title}</h4>
                  <p>{image.description}</p>
                  <p className="image-url">{image.url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;