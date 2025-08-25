import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./header.css";
import { DateRange } from "react-date-range";
import { useState, useContext } from "react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { AuthContext } from "../../context/AuthContext.js";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({ adult: 1, children: 0, room: 1 });

  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);
  const { user } = useContext(AuthContext);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? prev[name] + 1 : prev[name] - 1,
      };
    });
  };

  const handleSearch = () => {
    dispatch({ type: "NEW_SEARCH", payload: { destination, dates, options } });
    navigate('/hotels', { state: { destination, dates, options } });
  };

  return (
    <header className="header fixedHeader">
      <div className={type === "list" ? "headerContainer listMode" : "headerContainer"}>
        <div className="topBar">
          <div className="brand">
            <div className="logo">lamabooking</div>
            <div className="subLogo">ronitt</div>
          </div>

          <nav className="navCenter">
            <ul className="navList">
              <li className="navItem active">
                <FontAwesomeIcon icon={faBed} />
                <span>Stays</span>
              </li>
              <li className="navItem">
                <FontAwesomeIcon icon={faPlane} />
                <span>Flights</span>
              </li>
              <li className="navItem">
                <FontAwesomeIcon icon={faCar} />
                <span>Car rentals</span>
              </li>
              <li className="navItem">
                <FontAwesomeIcon icon={faBed} />
                <span>Attractions</span>
              </li>
              <li className="navItem">
                <FontAwesomeIcon icon={faTaxi} />
                <span>Airport taxis</span>
              </li>
            </ul>
          </nav>

          <div className="profileArea">
            {!user ? (
              <button className="headerBtn">Sign in</button>
            ) : (
              <div className="profile">{user.username}</div>
            )}
            <button
              className="hamburger"
              onClick={() => {
                const el = document.querySelector('.navList');
                if (el) el.classList.toggle('open');
              }}
              aria-label="Menu"
            >
              ☰
            </button>
          </div>
        </div>

        {type !== "list" && (
          <div className="hero">
            <div className="heroText">
              <h1 className="headerTitle">A lifetime of discounts? It's Genius.</h1>
              <p className="headerDesc">
                Get rewarded for your travels – unlock instant savings of 10% or more with a free Lamabooking account
              </p>
            </div>

            <div className="searchWrapper">
              <div className="headerSearch">
                <div className="headerSearchItem inputItem">
                  <FontAwesomeIcon icon={faBed} className="headerIcon" />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="headerSearchInput"
                    onChange={(e) => setDestination(e.target.value)}
                    value={destination}
                  />
                </div>

                <div className="headerSearchItem inputItem">
                  <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
                  <span onClick={() => setOpenDate(!openDate)} className="headerSearchText">
                    {`${format(dates[0].startDate, 'MM/dd/yyyy')} to ${format(dates[0].endDate, 'MM/dd/yyyy')}`}
                  </span>
                  {openDate && (
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setDates([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={dates}
                      className="date"
                      minDate={new Date()}
                    />
                  )}
                </div>

                <div className="headerSearchItem inputItem">
                  <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                  <span onClick={() => setOpenOptions(!openOptions)} className="headerSearchText">
                    {`${options.adult} adult · ${options.children} children · ${options.room} room`}
                  </span>

                  {openOptions && (
                    <div className="options">
                      <div className="optionItem">
                        <span className="optionText">Adult</span>
                        <div className="optionCounter">
                          <button
                            disabled={options.adult <= 1}
                            className="optionCounterButton"
                            onClick={() => handleOption('adult', 'd')}
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">{options.adult}</span>
                          <button className="optionCounterButton" onClick={() => handleOption('adult', 'i')}>
                            +
                          </button>
                        </div>
                      </div>

                      <div className="optionItem">
                        <span className="optionText">Children</span>
                        <div className="optionCounter">
                          <button
                            disabled={options.children <= 0}
                            className="optionCounterButton"
                            onClick={() => handleOption('children', 'd')}
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">{options.children}</span>
                          <button className="optionCounterButton" onClick={() => handleOption('children', 'i')}>
                            +
                          </button>
                        </div>
                      </div>

                      <div className="optionItem">
                        <span className="optionText">Room</span>
                        <div className="optionCounter">
                          <button
                            disabled={options.room <= 1}
                            className="optionCounterButton"
                            onClick={() => handleOption('room', 'd')}
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">{options.room}</span>
                          <button className="optionCounterButton" onClick={() => handleOption('room', 'i')}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="headerSearchItem inputItem">
                  <button className="searchButton" onClick={handleSearch}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
