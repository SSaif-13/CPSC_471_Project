import React from 'react';
import './frontpage.css'; 

const FrontPage = () => {
  return (
    <>
    <div className="header">
    <h1 className="title">Carbon Wake Up</h1>
    </div>
    <div className="content">
      <h3 className="overview">Overview</h3>
      <p className="information">
      CO2 Emission Levels Have Increased by 60% Since 1990.
      Global carbon dioxide emissions from fossil fuels and industry totaled 37.01 billion metric tons in 2023. Many things such as industrial activities, energy production using fossil fuels, and transportation contribute to this ongoing problem. The problem is ongoing and cannot be solved overnight. However, multiple organizations are working towards solutions such as renewable power, electric cars, and planting more trees.
      </p>
    </div>
    </>
  );
};

export default FrontPage;
