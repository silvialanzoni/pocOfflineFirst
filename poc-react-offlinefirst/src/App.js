import React, { useState, useEffect, useCallback } from 'react';
import { Route, Routes, Link } from 'react-router-dom';

const PRODUCTS = [
  { id: 1, name: 'Product A', price: 20 },
  { id: 2, name: 'Product B', price: 40 },
  { id: 3, name: 'Product C', price: 60 },
];

function App() {
  const [cart, setCart] = useState([]);

  // Sincronizza dati offline (placeholder)
  const syncOfflineData = useCallback(() => {
    console.log('Syncing offline data...');
  }, []);

  useEffect(() => {
    window.addEventListener('online', syncOfflineData);
    return () => {
      window.removeEventListener('online', syncOfflineData);
    };
  }, [syncOfflineData]);

  // Carica il carrello salvato da Local Storage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Aggiungi al carrello e salva su Local Storage
  const addToCart = (product) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, product];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  return (
    <div>
      <nav>
        <Link to="/">Products</Link> | <Link to="/cart">Cart</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductList products={PRODUCTS} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
    </div>
  );
}

function ProductList({ products, addToCart }) {
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price}{' '}
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cart({ cart }) {
  return (
    <div>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
