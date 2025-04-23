import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LineGraph from './LineGraph.jsx';
import { EmissionsUpdate } from './EmissionsUpdate.jsx';
import './Compare.css';


const Compare = () => {
  // number of lines for the graph from 1 to 5
  const [numberOfLines, setNumberOfLines] = useState(1);
  // selected country codes
  const [selectedCountries, setSelectedCountries] = useState(['OWID_WRL']);
  // in case of error messages
  const [errorMsg, setErrorMsg] = useState('');
  // data from database
  //const [data, setData] = useState([]);

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // check if a user is stored in localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Sign out handler
  const handleSignOut = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  // fetch data from database
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch('/api/emissions');
  //       const result = await response.json();
  //       setData(result);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const { emissions: data, refreshEmissions } = useContext(EmissionsUpdate);

  // list of unique countries
  const countryOptions = Array.from(
    new Map(data.map(entry => [entry.code, entry.country])).entries()
  ).map(([code, name]) => ({ code, name }));

  // adjusting the selectedCountries length if the number of lines for the graph changes
  useEffect(() => {
    setSelectedCountries(prev => {
      if (prev.length > numberOfLines) {
        // remove extra ones if the current selection is more than allowed
        return prev.slice(0, numberOfLines);
      } else if (prev.length < numberOfLines) {
        // if its less then add empty strings for the new ones
        return [...prev, ...Array(numberOfLines - prev.length).fill('')];
      }
      return prev;
    });
  }, [numberOfLines]);

  // handle the change for a single country dropdown 
  const handleCountryChange = (e, index) => {
    const newCountry = e.target.value;

    // if the new selection already exists in another dropdown then dont allow it
    if (selectedCountries.includes(newCountry)) {
      setErrorMsg('That country has already been selected. Please choose another.');
      return;
    } else {
      setErrorMsg('');
    }

    setSelectedCountries(prev => {
      const updated = [...prev];
      updated[index] = newCountry;
      return updated;
    });
  };

  // prepare the data for each selected country for the chart
  const multiSelectedData = selectedCountries
    .filter(code => code !== '')
    .map(code => {
      const filteredData = data
        .filter(entry => entry.code === code && entry.year)
        .sort((a, b) => Number(a.year) - Number(b.year));
      const countryName =
        filteredData[0]?.country ||
        (countryOptions.find(option => option.code === code)?.name || code);
      return { code, countryName, filteredData };
    });

  return (
    <div className="compare-container">
      {/* Header */}
      <div>
        <div className="header">
          <h1 className="navbar-brand">Comparing Carbon Emissions</h1>
          <div className="navigation">
            <ul className="unordered-list">
              <li>
                <Link to="/">Homepage</Link>
              </li>


              <li>
                <Link to="/calculator">Carbon Footprint Calculator</Link>
              </li>
              <li>
                <Link to="/donate">Donate</Link>
              </li>
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

      {/* Body */}
      {/* <h2>Comparing Emissions</h2> */}
      <h2></h2>
      <div className="controls">
        <div>
          <button onClick={refreshEmissions} style={{ margin: '1rem 0' }}>
            Refresh Emissions
          </button></div>
        <div>
          <label htmlFor="lineCountSelect">Number of countries to comapre: </label>
          <select
            id="lineCountSelect"
            value={numberOfLines}
            onChange={(e) => setNumberOfLines(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {Array.from({ length: numberOfLines }).map((_, i) => (
          <div key={i}>
            <label htmlFor={`countrySelect-${i}`}>Select Country {i + 1}:</label>
            <select
              id={`countrySelect-${i}`}
              value={selectedCountries[i] || ''}
              onChange={(e) => handleCountryChange(e, i)}>
              <option value="">--Select a country--</option>
              <option value="OWID_WRL">World</option>
              {countryOptions.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        ))}

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      </div>
      <LineGraph multiSelectedData={multiSelectedData} />
      <p style={{ fontSize: '0.775rem', lineHeight: 1.4 }}> Original emissions data from:{' '}
        <a href="https://ourworldindata.org/co2-emissions" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#0066cc' }}>
          Ritchie, Hannah, and Max Roser. “CO₂ Emissions.” Our World in Data, June 2020.</a>
      </p>

    </div>
  );
};
export default Compare;