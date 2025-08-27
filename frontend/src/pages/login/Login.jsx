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
      <form className="lContainer" onSubmit={handleClick}>
        <h2 className="lTitle">Welcome Back</h2>
        <p className="lSubtitle">Sign in to continue to <strong>StayFinder</strong></p>
        <div className="lFieldGroup">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            id="username"
            onChange={handleChange}
            autoComplete="username"
          />
        </div>
        <div className="lFieldGroup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            id="password"
            onChange={handleChange}
            autoComplete="current-password"
          />
        </div>
        <button disabled={loading} type="submit" className="lButton">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        {error && <div className="lError">{error.message || error}</div>}
        <div className="lDivider"><span>OR</span></div>
        <div className="lAltAction">Don't have an account? <a href="/register">Create one</a></div>
      </form>
    </div>
  );
};

export default Login;