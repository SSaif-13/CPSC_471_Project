import React, { useState } from 'react';
import './Donate.css';
import { data, Link } from 'react-router-dom';

const Donate = ({user_Id}) => {
  const [donation_Data, set_Donation_Data] = useState ({
    amount: '',
    organization: '',
  });

  const [donation_History, set_Donation_History] = useState ([]);

  const change_Handle = (e) => {
    const {name, value} = e.target;
    set_Donation_Data((prev_Data) => ({
      ...prev_Data,
      [name]: value,
    })); 
  };

  const submission_Handle = (e) => {
    e.prevent_Default();

    const num_Amount = parseFloat(donation_Data.amount);
    if (isNaN(num_Amount) || num_Amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const full_Donation = {
      ...donation_Data,
      amount: num_Amount.toFixed(2),
      user_Id: user_Id || 'GuestUser',
      data: new Date().toLocaleDateString(),
    };

    console.log('Thanks for the donation', full_Donation);

    set_Donation_History((previous) = [full_Donation, previous]);
    set_Donation_Data({amount: '', organization: ''});

  };

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

          {/* Donation Form */}
          <div className="Donation-form">
            <h2>Make a Donation</h2>
            <form onSubmit={submission_Handle}>
              
              <label>
                Choose a donation amount:
              </label>
              <div className="preset-buttons">
                {[10, 20, 50].map((val) => (
                  <button
                  type="button"
                  key={val}
                  onClick={() => set_Donation_Data((previous) => ({...previous, amount: val.toString() }))}
                  className={donation_Data.amount === val.toString() ? 'selected' : ''}
                  >
                    ${val}
                  </button>
                ))}
              </div>

              <label>
                Other amount ($):
                <input
                  type="number"
                  name="amount"
                  value={donation_Data.amount}
                  onChange={change_Handle}
                  min="1.0"
                  step="1.0"
                  placeholder="Enter other amount"
                />
              </label>

              <label>
                Organization:
                <select
                  name="organization"
                  value={donation_Data.organization}
                  onChange={change_Handle}
                  required
                >
                  <option value="" disabled>Select an organization</option>
                  <option value="Clean Air Task Force">Clean Air Task Force</option>
                  <option value="Carbon180">Carbon180</option>
                  <option value="The Climate Reality Project">The Climate Reality Project</option>
                  <option value="Project Drawdown">Project Drawdown</option>
                  <option value="Rainforest Foundation US">Rainforest Foundation US</option>
                </select>
              </label>

              {/* Show User ID */}
              <div>
                <strong>
                  User ID:
                </strong>
                {user_Id || 'GuestUser'}
              </div>
              <button type="submit">Donate</button>
            </form>
          </div>

          {/* Donation History */}
          {donation_History.length > 0 && (
            <div className="Donation-history">
              <h3>Your Donation Record</h3>
              <ul>
                {donation_History.map((donation, index) => (
                  <li key={index}>
                    User <strong>{donation.user_Id}</strong> donated ${donation.amount} to <strong>{donation.organization}</strong> on {donation.date}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>

  );
};

export default Donate;
