import { createContext, useReducer } from "react";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const INITIAL_STATE = {
  city: "",
  dates: [
    {
      startDate: new Date(),
      endDate: new Date(Date.now() + ONE_DAY_MS),
      key: "selection",
    },
  ],
  options: {
    adult: 1,
    children: 0,
    room: 1,
  },
};

export const SearchContext = createContext(INITIAL_STATE);

function reducer(state, action) {
  switch (action.type) {
    case "NEW_SEARCH":
      // payload: { city, dates, options }
      return { ...state, ...action.payload };
    case "SET_CITY":
      return { ...state, city: action.payload };
    case "UPDATE_DATES":
      return { ...state, dates: action.payload };
    case "UPDATE_OPTIONS":
      return { ...state, options: { ...state.options, ...action.payload } };
    case "RESET":
      return INITIAL_STATE;
    default:
      return state;
  }
}

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <SearchContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
};

