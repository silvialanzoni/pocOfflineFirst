import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage.tsx';
import ProductList from './components/ProductList.tsx';
import Cart from './components/Cart.tsx';
import db from './db';

const PRODUCTS = [
  { id: 1, name: 'Product A', price: 20 },
  { id: 2, name: 'Product B', price: 40 },
  { id: 3, name: 'Product C', price: 60 },
];

function App() {
  const [cart, setCart] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Funzione per aggiungere al carrello
  const addToCart = async (product) => {
    const existingProduct = await db.cart.get(product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
      await db.cart.put(existingProduct);
    } else {
      await db.cart.add({ ...product, quantity: 1 });
    }
    const updatedCart = await db.cart.toArray();
    setCart(updatedCart);
  };

  // Funzione per effettuare l'ordine
  const placeOrder = async () => {
    console.log('Order placed:', cart);
    setCart([]);
    await db.cart.clear();
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage isOnline={isOnline} />} />
        <Route
          path="/fruits"
          element={<ProductList products={PRODUCTS} addToCart={addToCart} />}
        />
        <Route
          path="/vegetables"
          element={<ProductList products={PRODUCTS} addToCart={addToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart cart={cart} placeOrder={placeOrder} isOnline={isOnline} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
