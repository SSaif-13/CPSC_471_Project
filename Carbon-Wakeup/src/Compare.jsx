import React, { useState, useEffect } from 'react';
import LineGraph from './LineGraph.jsx';
import './Compare.css';
import { Link } from 'react-router-dom';

const Compare = ({ data }) => {
  // number of lines for the graph from 1 to 5
  const [numberOfLines, setNumberOfLines] = useState(1);
  // selected country codes
  const [selectedCountries, setSelectedCountries] = useState(['OWID_WRL']);
  // in case of error messages
  const [errorMsg, setErrorMsg] = useState('');

  // list of unique countries
  const countryOptions = Array.from(
    new Map(data.map(entry => [entry.Code, entry.Country])).entries()
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
        .filter(entry => entry.Code === code && entry.Year)
        .sort((a, b) => Number(a.Year) - Number(b.Year));
      const countryName =
        filteredData[0]?.Country ||
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
                <Link to="/about">About Us</Link>
              </li>

              <li>
                <Link to="/calculator">Carbon Footprint Calculator</Link>
              </li>
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

      {/* Body */}
      {/* <h2>Comparing Emissions</h2> */}
      <h2></h2>
      <div className="controls">
        <div>
          <label htmlFor="lineCountSelect">Number of Lines:</label>
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
              onChange={(e) => handleCountryChange(e, i)}
            >
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
      {/* <p>Do we need to write anything for this?</p> */}
    </div>
  );
};
export default Compare;
