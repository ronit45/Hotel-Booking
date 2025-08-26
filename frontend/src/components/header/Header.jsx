import React, { useState, useEffect, useRef } from 'react';
import './header.css';

const Header = () => {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({ adult: 2, children: 0, room: 1 });
  
  const dropdownRef = useRef(null);
  const handleOption = (name, operation) => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "i" ? prev[name] + 1 : Math.max(name === 'children' ? 0 : 1, prev[name] - 1),
    }));
  };

  const handleSearch = () => {
        console.log("Performing search with:", { destination, dates, options });
    alert(`Searching for hotels in ${destination || "any location"}.`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="search-bar-container">
      <div className="search-bar-grid">
        <input 
          type="text" 
          placeholder="e.g. Mumbai" 
          className="search-input"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input 
          type="date" 
          className="search-input"
          value={dates.startDate}
          onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
        />
        <input 
          type="date" 
          className="search-input" 
          value={dates.endDate}
          onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
        />
        
        <div className="guest-dropdown-container" ref={dropdownRef}>
          <div 
            className="search-input guest-summary" 
            onClick={() => setOpenOptions(!openOptions)}
          >
            <span>{`${options.adult} adult · ${options.children} children · ${options.room} room`}</span>
          </div>
          {openOptions && (
            <div className="guest-dropdown">
              <div className="guest-option">
                <span>Adult</span>
                <div className="guest-controls">
                  <button type="button" onClick={() => handleOption('adult', 'd')}>-</button>
                  <span>{options.adult}</span>
                  <button type="button" onClick={() => handleOption('adult', 'i')}>+</button>
                </div>
              </div>
              <div className="guest-option">
                <span>Children</span>
                <div className="guest-controls">
                  <button type="button" onClick={() => handleOption('children', 'd')}>-</button>
                  <span>{options.children}</span>
                  <button type="button" onClick={() => handleOption('children', 'i')}>+</button>
                </div>
              </div>
              <div className="guest-option">
                <span>Room</span>
                <div className="guest-controls">
                  <button type="button" onClick={() => handleOption('room', 'd')}>-</button>
                  <span>{options.room}</span>
                  <button type="button" onClick={() => handleOption('room', 'i')}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>

  <button type="button" className="search-button" onClick={handleSearch}>Search</button>
      </div>
    </div>
  );
};

export default Header;
