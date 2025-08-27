import React, { useState, useEffect, useRef, useContext } from 'react';
import "./list.css";
import Navbar from "../../components/navbar/Navbar";
import Header from "../../components/header/Header";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { SearchContext } from "../../context/SearchContext";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = () => {
  const location = useLocation();
  const { city: ctxCity, dates: ctxDates, options: ctxOptions } = useContext(SearchContext);

  // Safely initialize from location.state (when navigated from Header) or fall back to SearchContext
  const initialDestination = location?.state?.destination ?? ctxCity ?? "";
  const initialDates = location?.state?.dates ?? ctxDates ?? [
    { startDate: new Date(), endDate: new Date(), key: 'selection' },
  ];
  const initialOptions = location?.state?.options ?? ctxOptions ?? { adult: 1, children: 0, room: 1 };

  const [destination, setDestination] = useState(initialDestination);
  const [dates, setDates] = useState(initialDates);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(initialOptions);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const dateRef = useRef(null);

  const { data, loading, error, reFetch } = useFetch(
    `/hotels?city=${destination.toLowerCase()}&min=${min || 0}&max=${max || 999}`
  );
  

  const handleClick = () => {
    reFetch();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setOpenDate(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dateRef]);

  return (
    <div>
      <Navbar />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label>Destination</label>
              <input 
                placeholder={destination} 
                type="text" 
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="lsItem" ref={dateRef}>
              <label>Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>
                {`${format(dates[0].startDate, "MM/dd/yyyy")} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}
              </span>
              {openDate && (
                <div className="date-range-wrapper">
                  <DateRange
                    onChange={(item) => setDates([item.selection])}
                    minDate={new Date()}
                    ranges={dates}
                  />
                </div>
              )}
            </div>
            <div className="lsItem">
              <label>Options</label>
              <div className="lsOptions">
                <div className="lsOptionItem">
                  <span className="lsOptionText">Min price <small>per night</small></span>
                  <input type="number" onChange={e => setMin(e.target.value)} className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Max price <small>per night</small></span>
                  <input type="number" onChange={e => setMax(e.target.value)} className="lsOptionInput" />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Adult</span>
                  <input type="number" min={1} className="lsOptionInput" placeholder={options.adult} />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Children</span>
                  <input type="number" min={0} className="lsOptionInput" placeholder={options.children} />
                </div>
                <div className="lsOptionItem">
                  <span className="lsOptionText">Room</span>
                  <input type="number" min={1} className="lsOptionInput" placeholder={options.room} />
                </div>
              </div>
            </div>
            <button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
            {loading ? "Loading results..." : (
              <>
                {data.map(item => (
                  <SearchItem item={item} key={item._id} />
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
