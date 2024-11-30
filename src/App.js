import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const [images, setImages] = useState([]);
  const [captions, setCaptions] = useState([]);
  const sidebarRef = useRef(null);
  const fileInputRef = useRef(null);

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
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const saveInput = useCallback(() => {
    setSavedInput(userInput);
    setIsSidebarOpen(false);
    console.log('Saved input:', userInput);
  }, [userInput]);

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

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    console.log('Files selected:', files);
    if (images.length + files.length <= 3) {
      setImages((prevImages) => [...prevImages, ...files]);
      for (const file of files) {
        try {
          console.log('Uploading image:', file);
          const caption = await getCaptionForImage(file);
          console.log('Caption received:', caption);
          setCaptions((prevCaptions) => [...prevCaptions, caption]);
        } catch (error) {
          console.error('Error fetching caption:', error);
        }
      }
    } else {
      alert('You can only upload up to 3 images.');
    }
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  const getCaptionForImage = async (image) => {
    const formData = new FormData();
    formData.append('file', image);

    // Create the payload for the OpenAI API
    const payload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What’s in this image?"
            },
            {
              type: "image_url",
              image_url: {
                url: URL.createObjectURL(image) // Use the URL of the uploaded image
              }
            }
          ]
        }
      ],
      max_tokens: 300
    };

    try {
      console.log('Sending request to OpenAI API');
      const response = await fetch('http://localhost:5001/api/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data.choices[0].message.content; // Adjust based on the actual response structure
    } catch (error) {
      console.error('Error fetching caption:', error);
      throw error;
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setCaptions((prevCaptions) => prevCaptions.filter((_, i) => i !== index));
  };

  const handleClickOutside = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      saveInput();
    }
  }, [saveInput]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen, handleClickOutside]);

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
            <div className="sidebar" ref={sidebarRef}>
              <textarea
                placeholder="Add a context"
                value={userInput}
                onChange={handleInputChange}
                className="form-control context-input"
                rows={1}
              />
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="file-input"
                ref={fileInputRef}
              />
              <div className="image-upload-container">
                {images.map((image, index) => (
                  <div key={index} className="image-container">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`upload-${index}`}
                      className="uploaded-image"
                    />
                    <button className="remove-image-button" onClick={() => handleRemoveImage(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M18.364 5.636l-1.414-1.414L12 9.172 7.05 4.222 5.636 5.636 10.586 10.586 5.636 15.536l1.414 1.414L12 12.828l4.95 4.95 1.414-1.414-4.95-4.95 4.95-4.95z"/>
                      </svg>
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <div className="custom-file-button" onClick={handleCustomButtonClick}>
                    <div className="plus-icon">+</div>
                    <div className="add-image-text">Add Image</div>
                  </div>
                )}
              </div>
              {savedInput && <p className="saved-input">{savedInput}</p>}
              {captions.length > 0 && (
                <div className="captions-container">
                  <h3>Image Captions</h3>
                  {captions.map((caption, index) => (
                    <p key={index} className="image-caption-text">{caption}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
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