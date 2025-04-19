import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const [signIn, setSignIn] = useState(true);

  return (
    <div className="login-page">
      {/* Header/Navbar */}
      <div className="header">
        <h1 className="navbar-brand">Login</h1>
        <nav className="navigation">
          <ul className="nav-list">
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/compare">Compare Carbon Emissions</Link></li>
            <li><Link to="/calculator">Carbon Footprint Calculator</Link></li>
            <li><Link to="/donate">Donate</Link></li>
          </ul>
        </nav>
      </div>

      {/* Login/Signup container */}
      <div className={`login-signup-container ${signIn ? 'sign-in-mode' : 'sign-up-mode'}`}>
        {/* Sign Up Form */}
        <div className="signup-form-container">
          <form className="signup-form">
            <h1>Create Account</h1>
            <input className="signup-input" type="text" placeholder="Name" />
            <input className="signup-input" type="email" placeholder="Email" />
            <input className="signup-input" type="password" placeholder="Password" />
            <button className="signup-button">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="login-form-container">
          <form className="login-form">
            <h1>Sign in</h1>
            <input className="login-input" type="email" placeholder="Email" />
            <input className="login-input" type="password" placeholder="Password" />
            <a href="#" className="login-forgot-password">Forgot your password?</a>
            <button className="login-button">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
