import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState({ users: false, emissions: false, donations: false });
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

    // Fetch users
    useEffect(() => {
        async function loadUsers() {
            setLoading(l => ({ ...l, users: true }));
            try {
                const res = await fetch('/api/users');
                const json = await res.json();
                setUsers(json.users || []);        // ← default to []
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


                </div>
            </div>
        </div>
    );
};

export default Admin;