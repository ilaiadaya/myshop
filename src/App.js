import React, { useState, useEffect } from 'react';
import TypingEffect from './TypingEffect';
import { parseCSV } from './parseCSV';
import './App.css';
import logo from './logo.png'; // Import your logo image
import Fuse from 'fuse.js';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [savedInput, setSavedInput] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch('/corrected.csv')
      .then((response) => {
        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (!contentType || !contentType.includes('text/csv')) {
          throw new Error('Expected CSV file but received different content type');
        }
        return response.text();
      })
      .then((csvString) => {
        console.log('CSV String:', csvString.slice(0, 100));
        return parseCSV(csvString);
      })
      .then((data) => {
        console.log('Parsed CSV Data:', data);
        setProducts(data);
      })
      .catch((error) => console.error('Error loading CSV:', error));
  }, []);

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

  const handleSearch = () => {
    setIsSearchActive(true);

    const options = {
      keys: ['Title', 'Description'], // Search in both Title and Description
      threshold: 0.3, // Adjust the threshold for fuzzy matching
    };

    const fuse = new Fuse(products, options);
    const results = fuse.search(userInput).map(result => result.item);

    console.log('Search Query:', userInput);
    console.log('Matched Results:', results);

    setSearchResults(results);
  };

  const handleLogoClick = () => {
    setIsSearchActive(false);
    setUserInput('');
    setSearchResults([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        />
        {!isSearchActive && (
          <div className="type-animation">
            <TypingEffect text="This is your shop nathan, what would you like to see?" />
          </div>
        )}
        <div className={`search-container ${isSearchActive ? 'active' : ''}`}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={userInput}
            onChange={handleInputChange}
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
        {isSearchActive && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((product, index) => {
              let imageUrl = product['Image URL'];
              if (typeof imageUrl === 'string' && imageUrl.startsWith('[')) {
                try {
                  imageUrl = JSON.parse(imageUrl.replace(/'/g, '"'))[0];
                } catch (error) {
                  console.error('Error parsing image URL:', error);
                  imageUrl = '';
                }
              }
              return (
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
                  <a href={product['Source URL']} target="_blank" rel="noopener noreferrer">
                    <img
                      src={imageUrl}
                      alt={product.Title}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </a>
                  <div className="caption">
                    <p>{product.Price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;