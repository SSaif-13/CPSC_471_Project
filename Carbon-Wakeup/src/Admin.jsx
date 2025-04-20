import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [emissionHistory, setEmissionHistory] = useState([]);
    const [donationHistory, setDonationHistory] = useState([]);
    const [loading, setLoading] = useState({ users: false, emissions: false, donations: false });

    // Fetch users
    useEffect(() => {
        async function loadUsers() {
            setLoading(prev => ({ ...prev, users: true }));
            try {
                const res = await fetch('/api/users');
                if (!res.ok) {
                    console.error('Failed to load users, status: ' + res.status);
                    setUsers([]); // Fallback for no data
                    return;
                }
                const json = await res.json();
                setUsers(json.users);
            } catch (e) {
                console.error('Failed to load users', e);
                setUsers([]); // Fallback for no data
            } finally {
                setLoading(prev => ({ ...prev, users: false }));
            }
        }
        loadUsers();
    }, []);

    // Fetch emission history
    useEffect(() => {
        async function loadEmissions() {
            setLoading(prev => ({ ...prev, emissions: true }));
            try {
                const res = await fetch('/api/emissions');
                if (!res.ok) {
                    console.error('Failed to load emissions, status: ' + res.status);
                    setEmissionHistory([]); // Fallback for no data
                    return;
                }
                const json = await res.json();
                setEmissionHistory(json.history);
            } catch (e) {
                console.error('Failed to load emissions', e);
                setEmissionHistory([]); // Fallback for no data
            } finally {
                setLoading(prev => ({ ...prev, emissions: false }));
            }
        }
        loadEmissions();
    }, []);

    // Fetch donation history
    useEffect(() => {
        async function loadDonations() {
            setLoading(prev => ({ ...prev, donations: true }));
            try {
                const res = await fetch('/api/donations');
                if (!res.ok) {
                    console.error('Failed to load donations, status: ' + res.status);
                    setDonationHistory([]); // Fallback for no data
                    return;
                }
                const json = await res.json();
                setDonationHistory(json.history);
            } catch (e) {
                console.error('Failed to load donations', e);
                setDonationHistory([]); // Fallback for no data
            } finally {
                setLoading(prev => ({ ...prev, donations: false }));
            }
        }
        loadDonations();
    }, []);


    //   disable flag for disabling a user
    //   const handleCheckboxChange = async (userId) => {
    //     try {
    //       const res = await fetch(`/api/users/${userId}/disable`, { method: 'PATCH' });
    //       const json = await res.json();
    //       setUsers(prev => prev.map(x => x.id === json.user.id ? { ...x, disabled: json.user.disabled } : x));
    //     } catch (e) {
    //       console.error('Error toggling disable', e);
    //     }
    //   };

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
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </div>
            </div>

            {/* Dashboard */}
            <div className="admin-dashboard">
                <div className="admin-main-content">

                    {/* Users Table */}
                    <div className="admin-table-card">
                        <div className="admin-card-title">
                            <h3>Recent Users</h3>
                            <button className="admin-btn">View All</button>
                        </div>
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
                                {loading.users ? (
                                    <tr>
                                        <td colSpan={5}>Loading...</td>
                                    </tr>
                                ) : users.length > 0 ? (
                                    users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.joined}</td>
                                            <td>{user.donated}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={user.disabled}
                                                    onChange={() => handleCheckboxChange(user.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Emission History Table */}
                    <div className="admin-table-card">
                        <div className="admin-card-title">
                            <h3>Emission History</h3>
                            <button className="admin-btn">View All</button>
                        </div>
                        <table className="admin-data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Total Emissions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading.emissions ? (
                                    <tr>
                                        <td colSpan={2}>Loading...</td>
                                    </tr>
                                ) : emissionHistory.length > 0 ? (
                                    emissionHistory.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.date}</td>
                                            <td>{entry.emissions}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Donation History Table */}
                    <div className="admin-table-card">
                        <div className="admin-card-title">
                            <h3>Donation History</h3>
                            <button className="admin-btn">View All</button>
                        </div>
                        <table className="admin-data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Organization</th>
                                    <th>Donation Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading.donations ? (
                                    <tr>
                                        <td colSpan={3}>Loading...</td>
                                    </tr>
                                ) : donationHistory.length > 0 ? (
                                    donationHistory.map((entry, index) => (
                                        <tr key={index}>
                                            <td>{entry.date}</td>
                                            <td>{entry.organization}</td>
                                            <td>{entry.amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3}>No data available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Admin;
