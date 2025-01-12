import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Homepage.scss';

// Importa i file SVG
import LocationIcon from '../location.svg';
import HomeIcon from '../home.svg';
import ConnectionIcon from '../connection.svg';
import LogoWebsite from '../logoWebsite.svg';
import FruitsImage from '../frutta.webp';
import VegImage from '../verdura.jpg';
import banner from '../spesabanner.jpg';

function HomePage({ isOnline }: { isOnline: boolean }) {
  const [placeholder, setPlaceholder] = useState('Search for products...');

  const placeholders = [
    'Search for fruits...',
    'Search for vegetables...',
    'Find your favorite deals...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) =>
        placeholders[(placeholders.indexOf(prev) + 1) % placeholders.length]
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage-container">
      <header className="header">
        <div className="header-left">
          <img className="user-icon" src={LocationIcon} alt="Location Icon" width="30" height="30" />
          <span className="user-greeting">Store location: Via Roma, Torino, Italy</span>
        </div>
        <div className="header-right">
          <div className="icon-container" title={isOnline ? 'You are online' : 'You are offline'}>
            <img className="connection-icon" src={ConnectionIcon} alt="Connection Icon" width="30" height="30" />
          </div>
          <div className="user-section">
            <img className="user-icon" src={HomeIcon} alt="Home Icon" width="30" height="30" />
            <span className="user-greeting">Hi Silvia</span>
          </div>
        </div>
      </header>

      <nav className="top-bar">
        <div className="top-bar-left">
          <img src={LogoWebsite} alt="Website Logo" className="website-logo" />
          <span className="website-title">Spesify</span>
          <div className="top-bar-menu">
            <Link to="/" className="menu-item">Home</Link>
            <Link to="/grids" className="menu-item">Grids</Link>
            <Link to="/cart" className="menu-item">Cart</Link>
            <Link to="/user" className="menu-item">User</Link>
          </div>
        </div>
      </nav>

      <div className="search-bar-section">
        <div className="search-bar">
          <input type="text" placeholder={placeholder} className="search-input" />
          <button className="search-button">Search</button>
        </div>
      </div>

      <div className="banner">
        <img src={banner} alt="Banner" className="banner-image" />
        <h2 className="banner-title">Special Offers</h2>
        <p className="banner-description">Up to 50% off on selected items!</p>
      </div>

      <div className="categories">
        <Link to="/fruits" state={{ category: 'fruits' }} className="category">
          <img
            src={FruitsImage}
            alt="Special Offer"
            className="special-offer-image"
          />
          <div>🍎 Frutta</div>
        </Link>
        <Link to="/vegetables" state={{ category: 'vegetables' }} className="category">
          <img
            src={VegImage}
            alt="Special Offer"
            className="special-offer-image"
          />
          <div>🥕 Verdura</div>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
