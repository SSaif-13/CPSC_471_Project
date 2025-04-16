import React from 'react';
// import './Login.css'; need to create this
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
      <div className="AboutUs-container">
        {/* Header */}
        <div>
          <div className="header">
            <h1 className="navbar-brand">About Us</h1>
            <div className="navigation">
              <ul className="unordered-list">
                <li>
                  <Link to="/">Homepage</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li> <Link to="/compare"> Compare Carbon Emissions </Link> </li>
                <li>
                  <Link to="/calculator">Carbon Footprint Calculator</Link>
                </li>
                <li>
                  <Link to="/donate">Donate</Link>
                </li>

              </ul>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Login;
