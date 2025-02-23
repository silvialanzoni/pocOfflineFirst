import React from 'react';
import './styles.css';

const PRODUCTS_TENNIS = [
  { id: 1, name: 'Babolat Pure Drive 110', price: 115, image: '../tennis1.jpg' },
  { id: 2, name: 'Wilson Clash 108 V2', price: 180, image: '../tennis2.jpeg' },
  { id: 3, name: 'Babolat Boost Rafa 2nd 2024', price: 150, image: '../tennis3.jpg' },
  { id: 4, name: 'HEAD Radical 27', price: 150, image: '../tennis4.webp' },
];
const PRODUCTS_BASKET = [
  { id: 5, name: 'Running Shoes', price: 120, image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Yoga Mat', price: 35, image: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Basketball', price: 50, image: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Tennis Racket', price: 150, image: 'https://via.placeholder.com/150' },
];
const PRODUCTS_PADEL = [
  { id: 9, name: 'Head Gravity Motion 2025', price: 200, image: '../padel1.jpg'  },
  { id: 10, name: 'Heroes Padel Ares 2023', price: 220, image: '../padel2.jpg' },
  { id: 11, name: 'Padel Comfort Soft Adult', price: 50, image: '../padel3.avif' },
];

const PRODUCTS = [
  { id: 1, name: 'Running Shoes', price: 120, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Yoga Mat', price: 35, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Basketball', price: 50, image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Tennis Racket', price: 150, image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Running Shoes', price: 120, image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Yoga Mat', price: 35, image: 'https://via.placeholder.com/150' },
  { id: 7, name: 'Basketball', price: 50, image: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Tennis Racket', price: 150, image: 'https://via.placeholder.com/150' },
  { id: 9, name: 'Running Shoes', price: 120, image: 'https://via.placeholder.com/150' },
  { id: 10, name: 'Yoga Mat', price: 35, image: 'https://via.placeholder.com/150' },
  { id: 11, name: 'Basketball', price: 50, image: 'https://via.placeholder.com/150' },
];




function HomePage({ addToCart }) {
  return (
    <>
    <div>
    <img
    src='../banner.jpg'
    alt='banner'
    className="banner-image"
    />
    </div>
    <div className="container">
      <h2>Tennis Collection</h2>
      <div className="product-grid">
        {PRODUCTS_TENNIS.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart ➕</button>
          </div>
        ))}
      </div>
    </div>
    <div className="container">
      <h2>Padel Collection</h2>
      <div className="product-grid">
        {PRODUCTS_PADEL.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart ➕</button>
          </div>
        ))}
      </div>
    </div>
    <div className="container">
      <h2>Basket Collection</h2>
      <div className="product-grid">
        {PRODUCTS_BASKET.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart ➕</button>
          </div>
        ))}
      </div>
    </div>

    </>
  );
}

export default HomePage;
