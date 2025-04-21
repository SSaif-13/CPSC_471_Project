import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Calculator.css';

Chart.register(...registerables);

const Calculator = () => {
  const [formData, setFormData] = useState({
    electricityUsageKWh: 0,
    kmDrivenPerMonth: 0,
    naturalGasGJPerMonth: 0,
    caloriesPerDay: 0,
    dietaryChoice: "Vegan",
  });
  const [result, setResult] = useState(null);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  // Check if user is logged in on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchCalculationHistory(parsedUser.userId);
      setIsLoggedIn(true);
    }
  }, []);

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // Chart data setup
  const [chartData, setChartData] = useState({
    labels: ["Electricity", "Driving", "Natural Gas", "Dietary Choice"],
    datasets: [
      {
        label: "CO2 Emissions (kgCO2e/year)",
        data: [
          result?.yearlyElectricityEmissions.value || 0,
          result?.yearlyTransportationEmissions.value || 0,
          result?.yearlyNaturalGasEmissions.value || 0,
          result?.dietaryChoiceEmissions.value || 0,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  const chartOptions = {
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  const fetchCalculationHistory = async (userId) => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/footprint/${userId}`);
      const data = await response.json();
      if (response.ok) {
        setCalculationHistory(data);
      }
    } catch (error) {
      console.error('Error fetching calculation history:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'range' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setResult(data);
      setShowSaveButton(true);

      // Update chart data
      setChartData(prev => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: [
              data.yearlyElectricityEmissions.value,
              data.yearlyTransportationEmissions.value,
              data.yearlyNaturalGasEmissions.value,
              data.dietaryChoiceEmissions.value,
            ]
          }
        ]
      }));
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert('Please log in to save your calculation');
      navigate('/login');
      return;
    }

    try {
      const response = await fetch("/api/footprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          footprint: result.totalYearlyEmissions.value.toFixed(2) // Save the total
        }),
      });

      if (response.ok) {
        const savedData = await response.json();
        setCalculationHistory(prev => [savedData, ...prev]);
        alert('Saved your data!');
        setShowSaveButton(false);
      } else {
        throw new Error('Failed to save calculation');
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
      alert('Failed to save your calculation. Please try again.');
    }
  };;

  const generateSuggestions = (result) => {
    const suggestions = [];

    if (!result) return suggestions;

    // Electricity suggestion
    if (result.yearlyElectricityEmissions.value > 3900) {
      suggestions.push({
        category: 'Electricity',
        message: 'Your electricity emissions are high. Consider:',
        tips: [
          'Switch to LED light bulbs',
          'Unplug devices when not in use',
          'Use energy-efficient appliances',
          'Consider solar panels if possible'
        ]
      });
    }

    // Driving suggestion
    if (result.yearlyTransportationEmissions.value > 2150) {
      suggestions.push({
        category: 'Transportation',
        message: 'Your driving emissions are high. Consider:',
        tips: [
          'Carpool or use public transportation',
          'Combine errands to reduce trips',
          'Consider an electric or hybrid vehicle',
          'Walk or bike for short distances'
        ]
      });
    }

    // Natural Gas suggestion
    if (result.yearlyNaturalGasEmissions.value > 5000) {
      suggestions.push({
        category: 'Natural Gas',
        message: 'Your natural gas usage is high. Consider:',
        tips: [
          'Lower your thermostat by a few degrees',
          'Insulate your home better',
          'Use a programmable thermostat',
          'Consider renewable heating options'
        ]
      });
    }

    // Dietary suggestion
    if (result.dietaryChoiceEmissions.value > 1465) {
      suggestions.push({
        category: 'Diet',
        message: 'Your dietary emissions are high. Consider:',
        tips: [
          'Reduce meat consumption',
          'Choose locally sourced foods',
          'Reduce food waste',
          'Incorporate more plant-based meals'
        ]
      });
    }

    return suggestions;
  };

  return (
    <div>
      {/* Navigation */}
      <div className="Calculator-container">
        <div className="header">
          <h1 className="navbar-brand">Carbon Footprint Calculator</h1>
          <div className="navigation">
            <ul className="unordered-list">
              <li><Link to="/">Homepage</Link></li>

              <li><Link to="/compare">Compare Carbon Emissions</Link></li>
              <li><Link to="/donate">Donate</Link></li>
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
      </div>

      {/* Calculator Content */}
      <div className="calculator-content">


        {/* Form */}
        <div className="calculator-form-section">
          <h1 className="form-title">Calculate Your Emissions</h1>
          <form onSubmit={handleSubmit} className="calculator-form">
            {/* Electricity */}
            <div className="form-group">
              <label>Electricity Usage (kWh/Month):</label>
              <span>{formData.electricityUsageKWh} kWh</span>
              <input type="range" min="0" max="1000" name="electricityUsageKWh"
                value={formData.electricityUsageKWh} onChange={handleChange} />
            </div>

            {/* Driving */}
            <div className="form-group">
              <label>Distance Driven (km/Month):</label>
              <span>{formData.kmDrivenPerMonth} km</span>
              <input type="range" min="0" max="10000" name="kmDrivenPerMonth"
                value={formData.kmDrivenPerMonth} onChange={handleChange} />
            </div>

            {/* Natural Gas */}
            <div className="form-group">
              <label>Natural Gas Usage (GJ/Month):</label>
              <span>{formData.naturalGasGJPerMonth} GJ</span>
              <input type="range" min="0" max="100" name="naturalGasGJPerMonth"
                value={formData.naturalGasGJPerMonth} onChange={handleChange} />
            </div>

            {/* Calories */}
            <div className="form-group">
              <label>Calories Eaten (per day):</label>
              <span>{formData.caloriesPerDay} kcal</span>
              <input type="range" min="0" max="5000" name="caloriesPerDay"
                value={formData.caloriesPerDay} onChange={handleChange} />
            </div>

            {/* Dietary Choice */}
            <div className="form-group">
              <label>Dietary Choice:</label>
              <select name="dietaryChoice" value={formData.dietaryChoice}
                onChange={handleChange}>
                <option value="Vegan">Vegan</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Omnivore">Omnivore</option>
              </select>
            </div>

            <button type="submit" className="submit-button">Calculate</button>
            {showSaveButton && (
              <button
                type="button"
                className="save-button"
                onClick={handleSave}
              >
                {user ? "Save Calculation" : "Log In to Save"}
              </button>
            )}
          </form>
        </div>

        {/* Results */}
        <div className="results-section">
          <h1 className="results-title">Yearly Emissions Statistics</h1>
          <div className="calculator-chart">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {result && (
            <>
              <div className="results-details">
                <p>Electricity: {result.yearlyElectricityEmissions.value.toFixed(2)} {result.yearlyElectricityEmissions.unit}</p>
                <p>Driving: {result.yearlyTransportationEmissions.value.toFixed(2)} {result.yearlyTransportationEmissions.unit}</p>
                <p>Natural Gas: {result.yearlyNaturalGasEmissions.value.toFixed(2)} {result.yearlyNaturalGasEmissions.unit}</p>
                <p>Dietary: {result.dietaryChoiceEmissions.value.toFixed(2)} {result.dietaryChoiceEmissions.unit}</p>
                <p className="total-emissions">TOTAL: {result.totalYearlyEmissions.value.toFixed(2)} {result.totalYearlyEmissions.unit}</p>

                {/* Suggestions */}
                <div className="suggestions-section">
                  <h2 className="suggestions-title">Suggestions for Improvement</h2>
                  {generateSuggestions(result).map((suggestion, index) => (
                    <div key={index} className="suggestion-card">
                      <h3 className="suggestion-category">{suggestion.category}</h3>
                      <p className="suggestion-message">{suggestion.message}</p>
                      <ul className="suggestion-tips">
                        {suggestion.tips.map((tip, tipIndex) => (
                          <li key={tipIndex}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculation History - only shown for logged-in users */}
              {user && (
                <div className="history-section">
                  <h2 className="history-title">Your Calculation History</h2>
                  {calculationHistory.length > 0 ? (
                    <ul className="history-list">
                      {calculationHistory.map((item, index) => (
                        <li key={index} className="history-item">
                          <div className="history-date">
                            {new Date(item.measurement_date).toLocaleDateString()}
                          </div>
                          <div className="history-total">
                            Total: {item.footprint} kgCO2e
                          </div>
                          {/* We can implement this if we put all the individual calculations */}
                          {/* <div className="history-details">
                            <span>Electricity: {item.footprint.yearlyElectricityEmissions.value.toFixed(2)}</span>
                            <span>Driving: {item.footprint.yearlyTransportationEmissions.value.toFixed(2)}</span>
                            <span>Gas: {item.footprint.yearlyNaturalGasEmissions.value.toFixed(2)}</span>
                          </div> */}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-history">No calculation history yet</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;