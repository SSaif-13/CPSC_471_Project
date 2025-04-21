import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Donate.css';

const Donate = () => {
  const [donationData, setDonationData] = useState({
    amount: '',
    organization: '',
  });
  const [donationHistory, setDonationHistory] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Load donation history when user changes
  useEffect(() => {
    if (user?.userId) {
      fetchDonationHistory();
    }
  }, [user]);

  const fetchDonationHistory = async () => {
    try {
      const response = await fetch(`/api/donations/${user.userId}`);
      const data = await response.json();
      if (response.ok) {
        setDonationHistory(data);
      }
    } catch (error) {
      console.error('Error fetching donation history:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please log in to make a donation');
      return;
    }

    const numAmount = parseFloat(donationData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmDonation = async () => {
    try {
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          amount: parseFloat(donationData.amount).toFixed(2),
          organization: donationData.organization
        }),
      });

      if (response.ok) {
        const newDonation = await response.json();
        setDonationHistory(prev => [newDonation, ...prev]);
        setDonationData({ amount: '', organization: '' });
        alert('Thank you for your donation!');
      } else {
        throw new Error('Donation failed');
      }
    } catch (error) {
      console.error('Donation error:', error);
      alert('There was an error processing your donation. Please try again.');
    } finally {
      setShowConfirmation(false);
    }
  };

  if (!user) {
    return (
      <div className="Donate-container">
        <div className="header">
          <h1 className="navbar-brand">Donate</h1>
          <div className="navigation">
            <ul className="unordered-list">
              <li><Link to="/">Homepage</Link></li>
              <li><Link to="/compare">Compare Carbon Emissions</Link></li>
              <li><Link to="/calculator">Carbon Footprint Calculator</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="login-required">
          <h2>Please log in to make a donation</h2>
          <p>You need to be logged in to access the donation page.</p>
          <Link to="/login" className="login-button">Log In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="Donate-container">
      {/* Header */}
      <div className="header">
        <h1 className="navbar-brand">Donate</h1>
        <div className="navigation">
          <ul className="unordered-list">
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/compare">Compare Carbon Emissions</Link></li>
            <li><Link to="/calculator">Carbon Footprint Calculator</Link></li>
            <li className="profile-dropdown">
              <span className="dropdown-btn">Profile</span>
              <div className="dropdown-content">
                {isLoggedIn ? (
                  <span onClick={handleSignOut} style={{ cursor: 'pointer' }}>
                    Sign Out
                  </span>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Donation Form */}
      <div className="Donation-form">
        <h2>Make a Donation</h2>
        <form onSubmit={handleSubmit}>
          <label>Choose a donation amount:</label>
          <div className="preset-buttons">
            {[10, 20, 50].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setDonationData(prev => ({ ...prev, amount: val.toString() }))}
                className={donationData.amount === val.toString() ? 'selected' : ''}
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
              value={donationData.amount}
              onChange={handleChange}
              min="1.0"
              step="1.0"
              placeholder="Enter other amount"
            />
          </label>

          <label>
            Organization:
            <select
              name="organization"
              value={donationData.organization}
              onChange={handleChange}
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

          <div>
            <strong>User:</strong> {user.name || user.email}
          </div>
          <button type="submit">Donate</button>
        </form>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <h3>Confirm Your Donation</h3>
            <p>You are about to donate ${parseFloat(donationData.amount).toFixed(2)} to {donationData.organization}.</p>
            <p>Are you sure you want to proceed?</p>
            <div className="confirmation-buttons">
              <button onClick={confirmDonation}>Confirm</button>
              <button onClick={() => setShowConfirmation(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Donation History */}
      {donationHistory.length > 0 && (
        <div className="Donation-history">
          <h3>Your Donation History</h3>
          <ul>
            {donationHistory.map((donation, index) => (
              <li key={index}>
                Donated ${donation.amount} to <strong>{donation.organization}</strong> on {new Date(donation.donation_date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Donate;