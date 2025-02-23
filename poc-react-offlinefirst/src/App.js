import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import db from './db';

const PRODUCTS = [
  { id: 1, name: 'Product A', price: 20 },
  { id: 2, name: 'Product B', price: 40 },
  { id: 3, name: 'Product C', price: 60 },
];

function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await db.cart.toArray();
      setCart(savedCart);
    };
    loadCart();
  }, []);

  // 🔄 Sincronizza ordini offline e valida al ritorno online
  useEffect(() => {
    const syncOfflineOrders = async () => {
      const offlineOrders = await db.offlineOrders.toArray();
      if (offlineOrders.length > 0) {
        console.log(`🔗 Sincronizzando ${offlineOrders.length} ordini offline...`);
        for (const order of offlineOrders) {
          await sendOrderToServer(order.data);
          await db.offlineOrders.delete(order.id);
        }
        console.log('🌐 Tutti gli ordini offline validi sono stati sincronizzati.');
      }
    };
    window.addEventListener('online', syncOfflineOrders);
    return () => window.removeEventListener('online', syncOfflineOrders);
  }, []);

  const addToCart = async (product) => {
    const existingProduct = await db.cart.get(product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + 1;
      await db.cart.put(existingProduct);
    } else {
      await db.cart.add({ ...product, quantity: 1 });
    }
    const updatedCart = await db.cart.toArray();
    setCart(updatedCart);
  };

  const updateQuantity = async (id, change) => {
    const product = await db.cart.get(id);
    if (product) {
      product.quantity = (product.quantity || 0) + change;
      if (product.quantity <= 0) {
        await db.cart.delete(id);
      } else {
        await db.cart.put(product);
      }
      const updatedCart = await db.cart.toArray();
      setCart(updatedCart);
    }
  };

  const removeFromCart = async (id) => {
    await db.cart.delete(id);
    const updatedCart = await db.cart.toArray();
    setCart(updatedCart);
  };

  // 📦 🔔 ✅ Controlla disponibilità con gestione offline
  const validateCart = async (customCart) => {
    const cartToValidate = customCart || cart;
    if (!navigator.onLine) {
      console.warn('⚡ Sei offline: validazione del carrello saltata.');
      return cartToValidate;
    }

    const validatedCart = [];
    const unavailableProducts = [];

    for (const item of cartToValidate) {
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
          if (product.stock > 0) {
            validatedCart.push({ ...item, quantity: product.stock });
          }
        }
      } catch (error) {
        console.error(`❌ Errore nella validazione di ${item.name}:`, error);
      }
    }

    setCart(validatedCart);

    if (unavailableProducts.length > 0) {
      alert(
        `🚨 Disponibilità aggiornata per i seguenti prodotti:\n` +
          unavailableProducts
            .map(
              (p) =>
                `${p.name}: richiesti ${p.quantity}, disponibili ${p.maxAvailable}`
            )
            .join('\n')
      );
    }
    return validatedCart;
  };

  // 🚀 Invia ordine al server con validazione integrata
  const sendOrderToServer = async (order) => {
    const validatedOrder = await validateCart(order);
    if (validatedOrder.length === 0) {
      console.warn('⚡ Nessun prodotto disponibile per l’ordine. Sincronizzazione saltata.');
      return;
    }

    try {
      await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedOrder),
      });
      console.log('✅ Ordine inviato con successo al server!');
      await db.cart.clear();
      setCart([]);
    } catch (error) {
      console.error('❌ Errore durante l’invio dell’ordine:', error);
      await db.offlineOrders.add({ data: validatedOrder });
    }
  };

  // 🛒 Effettua un ordine (online/offline)
  const placeOrder = async () => {
    const validCart = await validateCart();
    if (validCart.length > 0) {
      if (navigator.onLine) {
        await sendOrderToServer(validCart);
      } else {
        await db.offlineOrders.add({ data: validCart });
        await db.cart.clear();
        setCart([]);
        console.log('📦 Ordine salvato offline. Verrà sincronizzato quando tornerai online.');
      }
    } else {
      console.log('🚫 Ordine non effettuato per disponibilità insufficiente.');
    }
  };

  return (
    <div>
      <nav>
        <Link to="/">Products</Link> |{' '}
        <Link to="/cart">
          Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductList products={PRODUCTS} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} placeOrder={placeOrder} />} />
      </Routes>
    </div>
  );
}

// 🛍️ Lista prodotti
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

// 🛒 Carrello
function Cart({ cart, updateQuantity, removeFromCart, placeOrder }) {
  return (
    <div>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price} x {item.quantity}{' '}
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {cart.length > 0 && <button onClick={placeOrder}>Place Order</button>}
    </div>
  );
}

export default App;
