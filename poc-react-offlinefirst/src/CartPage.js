import React from 'react';
import './styles.css';

function CartPage({ cart, updateQuantity, removeFromCart, placeOrder }) {
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h1>🛒 Il Tuo Carrello</h1>
      {cart.length === 0 ? (
        <p className="empty-cart-message">Il tuo carrello è vuoto. Aggiungi subito qualche articolo sportivo! 🏀🎾</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <strong>{item.name}</strong> - ${item.price} x {item.quantity}
                </div>
                <div className="button-group">
                  <button className="quantity-btn plus" onClick={() => updateQuantity(item.id, 1)}>➕</button>
                  <button className="quantity-btn minus" onClick={() => updateQuantity(item.id, -1)}>➖</button>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑️ Rimuovi</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <h3>💵 Totale: ${totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn" onClick={placeOrder}>✅ Effettua Ordine</button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
