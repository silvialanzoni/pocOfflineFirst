import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import db from './db'; // Importa la configurazione di IndexedDB

const PRODUCTS = [
  { id: 1, name: 'Product A', price: 20 },
  { id: 2, name: 'Product B', price: 40 },
  { id: 3, name: 'Product C', price: 60 },
];

function App() {
  const [cart, setCart] = useState([]);

  // Carica il carrello salvato da IndexedDB
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await db.cart.toArray();
      setCart(savedCart);
    };
    loadCart();
  }, []);

  // Aggiungi un prodotto al carrello e salva su IndexedDB
  const addToCart = async (product) => {
    await db.cart.add(product);
    const updatedCart = await db.cart.toArray();
    console.log('Updated Cart:', updatedCart);
    setCart(updatedCart);
  };

  // Rimuovi un prodotto dal carrello e aggiorna IndexedDB
  const removeFromCart = async (id) => {
    await db.cart.delete(id);
    const updatedCart = await db.cart.toArray();
    setCart(updatedCart);
  };

  // Sincronizza gli ordini offline con il backend quando torni online
  const syncOfflineOrders = async () => {
    if (navigator.onLine) {
      const offlineOrders = await db.offlineOrders.toArray();
      for (const order of offlineOrders) {
        try {
          await fetch('http://localhost:4000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order.data),
          });
          console.log('Order synced:', order.data);
          await db.offlineOrders.delete(order.id); // Rimuovi l'ordine dopo la sincronizzazione
        } catch (error) {
          console.error('Failed to sync order:', order.data, error);
        }
      }
    }
  };

  // Aggiungi un ordine a IndexedDB quando offline
  const placeOrder = async () => {
    if (navigator.onLine) {
      console.log('Placing order online...');
      await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cart),
      });
    } else {
      console.log('Saving order offline...');
      await db.offlineOrders.add({ data: cart });
    }
    // Svuota il carrello dopo l'ordine
    await db.cart.clear();
    setCart([]);
  };

  useEffect(() => {
    window.addEventListener('online', syncOfflineOrders);
    return () => {
      window.removeEventListener('online', syncOfflineOrders);
    };
  }, []);

  return (
    <div>
      <nav>
        <Link to="/">Products</Link> | <Link to="/cart">Cart</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductList products={PRODUCTS} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} placeOrder={placeOrder} />} />
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

function Cart({ cart, removeFromCart, placeOrder }) {
  return (
    <div>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price}{' '}
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && (
        <button onClick={placeOrder}>Place Order</button>
      )}
    </div>
  );
}

export default App;
