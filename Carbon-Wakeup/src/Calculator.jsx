import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      setChartData({
        labels: ["Electricity", "Driving", "Natural Gas", "Dietary Choice"],
        datasets: [
          {
            label: "CO2 Emissions (kgCO2e/year)",
            data: [
              data.yearlyElectricityEmissions.value,
              data.yearlyTransportationEmissions.value,
              data.yearlyNaturalGasEmissions.value,
              data.dietaryChoiceEmissions.value,
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
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

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
          </form>
        </div>

        {/* Results */}
        <div className="results-section">
          <h1 className="results-title">Yearly Emissions Statistics</h1>
          <div className="calculator-chart"><Bar data={chartData} options={chartOptions} /></div>
          
          {result && (
            <div className="results-details">
              <p>Electricity: {result.yearlyElectricityEmissions.value.toFixed(2)} {result.yearlyElectricityEmissions.unit}</p>
              <p>Driving: {result.yearlyTransportationEmissions.value.toFixed(2)} {result.yearlyTransportationEmissions.unit}</p>
              <p>Natural Gas: {result.yearlyNaturalGasEmissions.value.toFixed(2)} {result.yearlyNaturalGasEmissions.unit}</p>
              <p>Dietary: {result.dietaryChoiceEmissions.value} {result.dietaryChoiceEmissions.unit}</p>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;