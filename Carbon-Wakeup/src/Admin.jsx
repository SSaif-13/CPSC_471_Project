import React, {useState, useEffect, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {EmissionsUpdate} from './EmissionsUpdate.jsx';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState({ users: false, emissions: false, donations: false });
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [emissions, setEmissions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [emissionValue, setEmissionValue] = useState('');
    const { refreshEmissions } = useContext(EmissionsUpdate);

    // redirecting non-admin users to homepage
    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) {
            try {
                const user = JSON.parse(raw);
                const type = (user.userType || user.user_type || '').toString().toLowerCase();
                if (type !== 'admin') {
                    // redirect to home
                    navigate('/');
                } else {
                    setIsLoggedIn(true);
                }
            } catch (err) {
                // for malformed users clear and redirect
                localStorage.removeItem('user');
                navigate('/login');
            }
        } else {
            // no user then redirect to login
            navigate('/login');
        }
    }, [navigate]);

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

    // Fetch users
    useEffect(() => {
        async function loadUsers() {
            setLoading(l => ({ ...l, users: true }));
            try {
                const res = await fetch('/api/users');
                const json = await res.json();
                setUsers(json.users || []);        
            } catch {
                setUsers([]);
            } finally {
                setLoading(l => ({ ...l, users: false }));
            }
        }
        loadUsers();
    }, []);

    // Toggle disabled status by repurposing user_type
    const handleCheckboxChange = async (userId) => {
        const target = users.find(u => u.id === userId);
        if (!target) return;
        const newDisabled = !target.disabled;
        const newType = newDisabled ? 'disabled' : 'regular';
        try {
            await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_type: newType }),
            });
            setUsers(current =>
                current.map(u =>
                    u.id === userId
                        ? { ...u, user_type: newType, disabled: newDisabled }
                        : u
                )
            );
        } catch (err) {
            console.error('Failed to update user status', err);
        }
    };


    // Fetch emissions and  build country/year options
    useEffect(() => {
        async function loadEmissions() {
            setLoading(l => ({ ...l, emissions: true }));
            try {
                const res = await fetch('/api/emissions');
                const data = await res.json();
                setEmissions(data || []);
                // Extract unique countries and years
                const countries = [...new Set((data || []).map(e => e.country))];
                const years = [...new Set((data || []).map(e => e.year))];
                setCountryOptions(countries.map(code => ({ code, name: code })));
                setYearOptions(years);
            } catch {
                setEmissions([]);
                setCountryOptions([]);
                setYearOptions([]);
            } finally {
                setLoading(l => ({ ...l, emissions: false }));
            }
        }
        loadEmissions();
    }, []);


    // Update emission for specific country and year
    const handleEmissionUpdate = async () => {
        if (!selectedCountry || !selectedYear || emissionValue === '') return;        try {
          await fetch(`/api/emissions/${selectedCountry}/${selectedYear}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ annual_co2_emissions: emissionValue }),
          });
          
          // Refresh data
          refreshEmissions();
          const res = await fetch('/api/emissions');
          const updated = await res.json();
          setEmissions(updated || []);
          // Reset form fields
          setSelectedCountry('');
          setSelectedYear('');
          setEmissionValue('');
        } catch (err) {
          console.error('Failed to update emissions', err);
        }
      };



    return (
        <div className="Admin-container">
            {/* Header */}
            <div className="header">
                <h1 className="navbar-brand">Admin</h1>
                <div className="navigation">
                    <ul className="unordered-list">
                        <li><Link to="/">Homepage</Link></li>
                        <li><Link to="/compare">Compare Carbon Emissions</Link></li>
                        <li><Link to="/calculator">Carbon Footprint Calculator</Link></li>
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

            {/* Dashboard */}
            <div className="admin-dashboard">
                <div className="admin-main-content">

                    {/* Users Table */}
                    <div className="admin-table-card">
                        <h3>Recent Users</h3>
                        <table className="admin-data-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Date Joined</th>
                                    <th>Donated Amount</th>
                                    <th>Disable</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading.users
                                    ? <tr><td colSpan={5}>Loading...</td></tr>
                                    : (users?.length > 0)
                                        ? users.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.id}</td>
                                                <td>{u.name}</td>
                                                <td>{u.joined}</td>
                                                <td>{u.donated}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!u.disabled}
                                                        onChange={() => handleCheckboxChange(u.id)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                        : <tr><td colSpan={5}>No data available</td></tr>
                                }
                            </tbody>
                        </table>
                    </div>

                    {/* Emissions Table and Editor options */}
                    <div className="admin-table-card">
                        <h3 className="admin-editor">Emissions Editor</h3>
                        {loading.emissions ? (
                            <p className="admin-loading">Loading emissions...</p>
                        ) : (
                            <div className="admin-emission-editor">
                                <label className="admin-select-country-label" htmlFor="admin-country-select">
                                    Select Country:
                                </label>
                                <select
                                    id="admin-country-select"
                                    className="admin-select-country"
                                    value={selectedCountry}
                                    onChange={e => setSelectedCountry(e.target.value)}
                                >
                                    <option value="">--Select a country--</option>
                                    {countryOptions.map(({ code, name }) => (
                                        <option key={code} value={code}>
                                            {name}
                                        </option>
                                    ))}
                                </select>

                                <label className="admin-select-year-label" htmlFor="admin-year-select">
                                    Select Year:
                                </label>
                                <select
                                    id="admin-year-select"
                                    className="admin-select-year"
                                    value={selectedYear}
                                    onChange={e => setSelectedYear(e.target.value)}
                                >
                                    <option value="">--Select a year--</option>
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>

                                <label className="admin-emission-value-label" htmlFor="admin-emission-input">
                                    New Emission Value:
                                </label>
                                <input
                                    type="number"
                                    id="admin-emission-input"
                                    className="admin-input"
                                    value={emissionValue}
                                    onChange={e => setEmissionValue(e.target.value)}
                                    placeholder="Enter value"
                                />

                                <button
                                    className="admin-update-emission-btn"
                                    onClick={handleEmissionUpdate}
                                    disabled={!selectedCountry || !selectedYear || emissionValue === ''}
                                >
                                    Update Emissions
                                </button>
                            </div>
                        )}
                    </div>



                </div>
            </div>
        </div>
    );
};

export default Admin;