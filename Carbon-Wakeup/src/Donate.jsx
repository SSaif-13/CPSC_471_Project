import React from 'react';
// import './Donate.css'; need to create this
import { Link } from 'react-router-dom';

const Donate = () => {
  return (
    <>
      <div className="Donate-container">
        {/* Header */}
        <div>
          <div className="header">
            <h1 className="navbar-brand">Donate</h1>
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
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Donate;
