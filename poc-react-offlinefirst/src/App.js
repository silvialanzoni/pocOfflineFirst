import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/Homepage.tsx';
import ProductList from './components/ProductList.tsx';
import Cart from './components/Cart.tsx';
import db from './db';
import CartPage from './CartPage';
import HomePage from './Homepage.js';
import './styles.css';

function App() {
  const [cart, setCart] = useState([]);
  const [isOnline, setisOnline] = useState(navigator.onLine);
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await db.cart.toArray();
      setCart(savedCart);
    };
    loadCart();
  }, []);
  // 🌐 Ascolta i cambiamenti di connessione
  useEffect(() => {
    const updateOnlineStatus = () => setisOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    const syncOfflineOrders = async () => {
      const offlineOrders = await db.offlineOrders.toArray();
      if (offlineOrders.length > 0) {
        console.log(`🔗 Syncing ${offlineOrders.length} offline orders...`);
        for (const order of offlineOrders) {
          await sendOrderToServer(order.data);
          await db.offlineOrders.delete(order.id);
        }
        console.log('🌐 All offline orders synced.');
      }
    };
    window.addEventListener('online', syncOfflineOrders);
    return () => window.removeEventListener('online', syncOfflineOrders);
  }, []);

  const addToCart = async (product) => {
    const existingProduct = await db.cart.get(product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
      await db.cart.put(existingProduct);
    } else {
      await db.cart.add({ ...product, quantity: 1 });
    }
    setCart(await db.cart.toArray());
  };

  const updateQuantity = async (id, change) => {
    const product = await db.cart.get(id);
    if (product) {
      product.quantity += change;
      product.quantity <= 0 ? await db.cart.delete(id) : await db.cart.put(product);
      setCart(await db.cart.toArray());
    }
  };

  const removeFromCart = async (id) => {
    await db.cart.delete(id);
    setCart(await db.cart.toArray());
  };

  const validateCart = async (customCart = cart) => {
    if (!navigator.onLine) return customCart;
    const validatedCart = [];
    const unavailableProducts = [];

    for (const item of customCart) {
      try {
        const response = await fetch(`http://localhost:4000/products/${item.id}`);
        if (!response.ok) throw new Error(`Product ${item.id} not found`);
        const product = await response.json();

        if (product.available && product.stock >= item.quantity) {
          validatedCart.push(item);
        } else {
          unavailableProducts.push({
            ...item,
            maxAvailable: product.stock,
          });
          if (product.stock > 0) validatedCart.push({ ...item, quantity: product.stock });
        }
      } catch (error) {
        console.error(`❌ Error validating ${item.name}:`, error);
      }
    }

    setCart(validatedCart);
    if (unavailableProducts.length > 0) {
      alert(
        `🚨 Stock updated:\n` +
          unavailableProducts.map((p) => `${p.name}: available ${p.maxAvailable}`).join('\n')
      );
    }
    return validatedCart;
  };

  const sendOrderToServer = async (order) => {
    const validatedOrder = await validateCart(order);
    if (validatedOrder.length === 0) return;

    try {
      await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedOrder),
      });
      console.log('✅ Order sent successfully!');
      await db.cart.clear();
      setCart([]);
    } catch (error) {
      console.error('❌ Failed to send order:', error);
      await db.offlineOrders.add({ data: validatedOrder });
    }
  };

  const placeOrder = async () => {
    const validCart = await validateCart();
    if (validCart.length > 0) {
      if (navigator.onLine) {
        await sendOrderToServer(validCart);
      } else {
        await db.offlineOrders.add({ data: validCart });
        await db.cart.clear();
        setCart([]);
        console.log('📦 Order saved offline for later sync.');
      }
    }
  };

  return (
    <div>
<nav className="navbar">
  <div className="navbar-left">
    <Link to="/" className="logo-link">
      <h1 className="logo">🏀 Sportify</h1>
    </Link>
  </div>
  <div className="navbar-right">
    <Link to="/cart" className="cart-link">
      🛒 Cart <span className="cart-badge">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
    </Link>
    <span className={`status ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? '🟢 Online' : '🔴 Offline'}
    </span>
  </div>
</nav>



      <Routes>
        <Route path="/" element={<HomePage addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              placeOrder={placeOrder}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
