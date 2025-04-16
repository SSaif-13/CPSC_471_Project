import React from 'react';
// import './Calculator.css'; need to create this
import { Link } from 'react-router-dom';

const Calculator = () => {
  return (
    <>
      <div className="Calculator-container">
        {/* Header */}
        <div>
          <div className="header">
            <h1 className="navbar-brand">Carbon Footprint Calculator</h1>
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
                  <Link to="/donate">Donate</Link>
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

export default Calculator;
