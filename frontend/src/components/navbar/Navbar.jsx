import React, { useContext } from 'react';
import './navbar.css'; // Import the corresponding CSS file
import { useAuthStore } from '../../store/auth';
import { Link } from 'react-router-dom';
const Navbar = () => {
  const { user, logout } = useAuthStore();
  console.log(user)

  return (
    <header className="navbar">
      <nav className="navContainer">
        
        {/* Logo */}
        <a href="/" className="logo-link">
          <span className="logo">
            Stay<span className="logo-accent">Finder</span>
          </span>
        </a>
        
        

        {/* User authentication section */}
        <div className="navItems">
          {user ? (
            // If user is logged in, display their username and a logout button
            <>
              <span className="username">Welcome, {user.username}</span>
              <button onClick={logout} className="navButton logoutButton">
                Logout
              </button>
            </>
          ) : (
            // If no user is logged in, show Register and Sign In buttons
            <>
              <Link to="/register" className="navButton registerButton">Register</Link>
              <Link to="/login" className="navButton signInButton" >Sign In</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
