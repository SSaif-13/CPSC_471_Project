import './App.css'
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FrontPage from './frontpage';
import Compare from './Compare.jsx';
import Calculator from './Calculator.jsx';
import Donate from './Donate.jsx';
import Login from './Login.jsx';
import Admin from './Admin.jsx'

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/cleaned_data.csv')
      .then((response) => response.text())
      .then((csvText) => {
        // converting CSV text to JSON with headers
        const result = Papa.parse(csvText, { header: true });
        setData(result.data);
      })
      .catch((error) => {
        console.error("Error reading CSV file: ", error);
      });
  }, []);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/compare" element={<Compare data={data} />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
