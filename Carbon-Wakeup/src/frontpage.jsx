import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './frontpage.css';

const FrontPage = () => {
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

    return (
        <>
            <div>
                <div className="header">
                    <h1 className="navbar-brand">
                        Carbon Wake Up
                    </h1>

                    <div className="navigation">
                        <ul className="unordered-list">

                            <li> <Link to="/compare"> Compare Carbon Emissions </Link> </li>

                            <li> <Link to="/calculator"> Carbon Footprint Calculator </Link> </li>

                            <li> <Link to="/donate"> Donate </Link> </li>

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

                <section className="overview-section">
                    <div className="content">
                        <div className="text">
                            <h2 style={{ paddingRight: "5px" }}>Why Should We Care About CO2 Emissions?</h2>
                            <p style={{ paddingRight: "10px" }}>
                                Carbon dioxide is the main cause of global climate change. With increasing globalization, CO2 emissions are also increasing.
                                {/* <br /> */}
                                CO2 Emission Levels Have Increased by 60% Since 1990.
                                {/* <br /> */}
                                Global carbon dioxide emissions from fossil fuels and industry totaled 37.01 billion metric tons in 2023. Many things such as
                                industrial activities, energy production using fossil fuels, and transportation contribute to this ongoing problem.
                            </p>
                        </div>
                        <img className="image" src="../img/C02-increasing.png" alt="Showcase" />
                    </div>
                </section>

                <section className="impacts">
                    <div className="container">
                        <h2 style={{ paddingRight: "5px", textAlign: "left" }}>Impacts of Increasing CO2 Emissions</h2>
                        <div className="gallery">
                            <div className="impact-item">
                                <img className="image" src="../img/Air-Quality.png" alt="Air Quality" />
                                <p className="impact-text" style={{ textAlign: "center" }}>
                                    Air Quality
                                    <br />
                                    Poor air quality from excess CO₂ can lead to respiratory problems and harm ecosystems
                                </p>
                            </div>
                            <div className="impact-item">
                                <img className="image" src="../img/Global-Warming.png" alt="Global Warming" />
                                <p className="impact-text" style={{ textAlign: "center" }}>
                                    Global Warming
                                    <br />
                                    Global warming from excess CO₂ traps heat in the atmosphere, causing rising temperatures and extreme weather
                                </p>
                            </div>
                            <div className="impact-item">
                                <img className="image" src="../img/Ocean-acidification.png" alt="Ocean Acidification" />
                                <p className="impact-text" style={{ textAlign: "center" }}>
                                    Ocean Acidification
                                    <br />
                                    CO₂ absorbed by oceans leads to acidification, which harms marine life like corals and shellfish
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>

    );
};

export default FrontPage;
