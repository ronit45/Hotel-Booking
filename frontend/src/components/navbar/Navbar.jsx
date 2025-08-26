import React, { useContext } from 'react';
import './navbar.css'; // Import the corresponding CSS file
import { AuthContext } from '../../context/AuthContext'; // Make sure this path is correct in your project

const Navbar = () => {
  // Use the AuthContext to get the current user
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <nav className="navContainer">
        
        {/* Logo */}
        <a href="/" className="logo-link">
          <span className="logo">
            Stay<span className="logo-accent">Finder</span>
          </span>
        </a>
        
        {/* Navigation links */}
        <div className="navLinks">
          <a href="/hotels" className="navLink">Hotels</a>
          <a href="/flights" className="navLink">Flights</a>
          <a href="/rentals" className="navLink">Car Rentals</a>
          <a href="/support" className="navLink">Support</a>
        </div>

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
              <button className="navButton registerButton">Register</button>
              <button className="navButton signInButton">Sign In</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
