import React, { useState, useEffect, useRef, useContext } from 'react';
import './header.css';
import { useNavigate } from 'react-router-dom';
import { SearchContext } from '../../context/SearchContext';
import { DateRange } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const Header = () => {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState([{ startDate: new Date(), endDate: new Date(), key: 'selection' }]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({ adult: 2, children: 0, room: 1 });
  const [openDate, setOpenDate] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);
  

  const dropdownRef = useRef(null);
  const dateRef = useRef(null);
  const handleOption = (name, operation) => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "i" ? prev[name] + 1 : Math.max(name === 'children' ? 0 : 1, prev[name] - 1),
    }));
  };

  const handleSearch = () => {
    const payloadDates = dates;
    if (dispatch) {
      dispatch({ type: 'NEW_SEARCH', payload: { city: destination, dates: payloadDates, options } });
    }
    navigate('/hotels', { state: { destination, dates: payloadDates, options } });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenOptions(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setOpenDate(false);
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
          onChange={(e) => setDestination(e.target.value.toLowerCase())}
        />
        <div className="search-input date-input" ref={dateRef}>
          <div className="date-display" onClick={() => setOpenDate(!openDate)}>
            <span>{`${format(dates[0].startDate, 'MM/dd/yyyy')} to ${format(dates[0].endDate, 'MM/dd/yyyy')}`}</span>
          </div>
          {openDate && (
            <div className="date-range-wrapper header-date-range">
              <DateRange
                onChange={(item) => setDates([item.selection])}
                minDate={new Date()}
                ranges={dates}
                rangeColors={["#3b82f6"]}
              />
            </div>
          )}
        </div>
        
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
