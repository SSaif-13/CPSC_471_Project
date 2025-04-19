import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

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

  return (
    <div className="min-h-screen flex items-center justify-center p-5 flex-col bg-gray-100">
      {/* Navigation */}
      <div className="w-full max-w-screen-lg bg-white shadow-md mb-8">
        <div className="header p-4">
          <h1 className="text-2xl font-bold">Carbon Footprint Calculator</h1>
        </div>
      </div>

      {/* Calculator Content */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-10 w-full max-w-screen-lg rounded-lg shadow-lg">
        {/* Form */}
        <div className="p-8 rounded-lg flex-1">
          <h1 className="text-3xl font-bold mb-6 text-center">Carbon Footprint Calculator</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Electricity */}
            <div className="flex justify-between items-center">
              <label>Electricity Usage (kWh/Month):</label>
              <span>{formData.electricityUsageKWh} kWh</span>
            </div>
            <input
              type="range" min="0" max="100" name="electricityUsageKWh"
              value={formData.electricityUsageKWh} onChange={handleChange} className="w-full" />

            {/* Driving */}
            <div className="flex justify-between items-center">
              <label>Distance Driven (km/Month):</label>
              <span>{formData.kmDrivenPerMonth} km</span>
            </div>
            <input
              type="range" min="0" max="1000" name="kmDrivenPerMonth"
              value={formData.kmDrivenPerMonth} onChange={handleChange} className="w-full" />

            {/* Natural Gas */}
            <div className="flex justify-between items-center">
              <label>Natural Gas Usage (GJ/Month):</label>
              <span>{formData.naturalGasGJPerMonth} GJ</span>
            </div>
            <input
              type="range" min="0" max="100" name="naturalGasGJPerMonth"
              value={formData.naturalGasGJPerMonth} onChange={handleChange} className="w-full" />

            {/* Calories */}
            <div className="flex justify-between items-center">
              <label>Calories Eaten (per day):</label>
              <span>{formData.caloriesPerDay} kcal</span>
            </div>
            <input
              type="range" min="0" max="5000" name="caloriesPerDay"
              value={formData.caloriesPerDay} onChange={handleChange} className="w-full" />

            {/* Dietary */}
            <div className="flex flex-col">
              <label>Dietary Choice:</label>
              <select name="dietaryChoice" value={formData.dietaryChoice}
                onChange={handleChange} className="w-full">
                <option value="Vegan">Vegan</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Pescatarian">Pescatarian</option>
                <option value="Omnivore">Omnivore</option>
              </select>
            </div>

            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Calculate
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="p-8 rounded-lg flex-1">
          <h1 className="text-3xl font-bold mb-2">Yearly Emissions Statistics</h1>
          <Bar data={chartData} options={chartOptions} />
          {result && (
            <div className="mt-8">
              <p className="font-bold">Electricity: {result.yearlyElectricityEmissions.value} {result.yearlyElectricityEmissions.unit}</p>
              <p className="font-bold">Driving: {result.yearlyTransportationEmissions.value} {result.yearlyTransportationEmissions.unit}</p>
              <p className="font-bold">Natural Gas: {result.yearlyNaturalGasEmissions.value} {result.yearlyNaturalGasEmissions.unit}</p>
              <p className="font-bold">Dietary: {result.dietaryChoiceEmissions.value} {result.dietaryChoiceEmissions.unit}</p>
              <p className="mt-4 font-bold">TOTAL: {result.totalYearlyEmissions.value} {result.totalYearlyEmissions.unit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator;