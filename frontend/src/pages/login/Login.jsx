import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, loginStart, loginSuccess, loginFailure } = useAuthStore();
  const navigate = useNavigate();
  // If you need useAuthStore, import it at the top of the file, not here.

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    loginStart();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, credentials);
  console.log("LOGIN RESPONSE", res.data);
  loginSuccess(res.data.user || res.data.details || res.data.data?.user || res.data);
      navigate("/");
    } catch (err) {
      loginFailure(err.response?.data || err.message);
    }
  };

  return (
    <div className="login">
      <input
        type="text"
        placeholder="username"
        id="username"
        onChange={handleChange}
        className="lInput"
      />
      <input
        type="password"
        placeholder="password"
        id="password"
        onChange={handleChange}
        className="lInput"
      />
      <button disabled={loading} onClick={handleClick} className="lButton">
        Login
      </button>
      {error && <span>{error.message}</span>}
    </div>
  );
};

export default Login;