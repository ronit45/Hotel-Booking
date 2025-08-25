import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./pages/home/Home";
import NewHome from "./pages/home/NewHome";
import Hotel from "./pages/hotel/Hotel";
import List from "./pages/list/List";
import { SearchContextProvider } from "./context/SearchContext";
import Login from "./pages/login/Login";


function App() {
  return (
    <SearchContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
  <Route path="/hotels" element={<List/>}/>
  <Route path="/new-home" element={<NewHome/>}/>
        <Route path="/hotels/:id" element={<Hotel/>}/>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
    </SearchContextProvider>
  );
}

export default App;
