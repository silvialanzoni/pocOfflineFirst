import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductList from './ProductList';
import Cart from './Cart';

const PRODUCTS = [
  { id: 1, name: 'Product A', price: 20 },
  { id: 2, name: 'Product B', price: 40 },
  { id: 3, name: 'Product C', price: 60 },
];

function App() {
  const [cart, setCart] = useState([]);
  const [offlineData, setOfflineData] = useState([]);

  const syncOfflineData = () => {
    if (navigator.onLine && offlineData.length) {
      console.log('Syncing offline data:', offlineData);
      setOfflineData([]);
    }
  };

  useEffect(() => {
    window.addEventListener('online', syncOfflineData);
    return () => {
      window.removeEventListener('online', syncOfflineData);
    };
  }, [offlineData]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    if (!navigator.onLine) {
      setOfflineData([...offlineData, { action: 'ADD_TO_CART', product }]);
    }
  };

  return (
    <div>
      <nav>
        <Link to="/">Products</Link> | <Link to="/cart">Cart</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductList products={PRODUCTS} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
      </Routes>
    </div>
  );
}

export default App;
