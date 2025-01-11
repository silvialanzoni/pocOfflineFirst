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

  // Carica il carrello da IndexedDB
  useEffect(() => {
    const loadCart = async () => {
      const savedCart = await db.cart.toArray();
      setCart(savedCart);
    };
    loadCart();
  }, []);

  // Aggiungi un prodotto al carrello
  const addToCart = async (product) => {
    const existingProduct = await db.cart.get(product.id);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + 1; // Incrementa come numero
      await db.cart.put(existingProduct);
    } else {
      await db.cart.add({ ...product, quantity: 1 }); // Valore iniziale
    }
    const updatedCart = await db.cart.toArray();
    setCart(updatedCart);
  };
  
  const updateQuantity = async (id, change) => {
    const product = await db.cart.get(id);
    if (product) {
      product.quantity = (product.quantity || 0) + change; // Incrementa/Decrementa come numero
      if (product.quantity <= 0) {
        await db.cart.delete(id);
      } else {
        await db.cart.put(product);
      }
      const updatedCart = await db.cart.toArray();
      setCart(updatedCart);
    }
  };
  

  // Rimuovi un prodotto dal carrello
  const removeFromCart = async (id) => {
    await db.cart.delete(id);
    const updatedCart = await db.cart.toArray();
    setCart(updatedCart);
  };

  // Valida il carrello con il backend
  const validateCart = async () => {
    const validatedCart = [];
    const unavailableProducts = [];
  
    for (const item of cart) {
      try {
        const response = await fetch(`http://localhost:4000/products/${item.id}`);
        if (!response.ok) {
          throw new Error(`Product ${item.id} not found`);
        }
        const product = await response.json();
  
        if (product.available) {
          if (product.stock >= item.quantity) {
            validatedCart.push(item); // Quantità sufficiente, aggiungi al carrello validato
          } else {
            // Stock insufficiente, aggiorna la quantità
            unavailableProducts.push({
              ...item,
              maxAvailable: product.stock,
            });
            validatedCart.push({ ...item, quantity: product.stock });
          }
        } else {
          // Prodotto non disponibile
          unavailableProducts.push({ ...item, maxAvailable: 0 });
        }
      } catch (error) {
        console.error(`Error validating product ${item.name}:`, error);
      }
    }
  
    setCart(validatedCart);
  
    if (unavailableProducts.length > 0) {
      alert(
        `The following products were updated due to stock limitations:\n` +
          unavailableProducts
            .map(
              (p) =>
                `${p.name}: requested ${p.quantity}, available ${p.maxAvailable}`
            )
            .join('\n')
      );
    }
  
    return validatedCart;
  };
  

  // Effettua un ordine
  const placeOrder = async () => {
    const validCart = await validateCart();
    if (validCart.length > 0) {
      try {
        await fetch('http://localhost:4000/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validCart),
        });
        await db.cart.clear();
        setCart([]);
        console.log('Order placed successfully!');
      } catch (error) {
        console.error('Error placing order:', error);
      }
    } else {
      console.log('Order could not be placed due to validation errors.');
    }
  };

  return (
    <div>
      <nav>
        <Link to="/">Products</Link> | <Link to="/cart">Cart</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ProductList products={PRODUCTS} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} placeOrder={placeOrder} />} />
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
      {cart.length > 0 && (
        <button onClick={placeOrder}>Place Order</button>
      )}
    </div>
  );
}

export default App;
