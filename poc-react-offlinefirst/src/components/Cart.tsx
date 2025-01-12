import React from 'react';
import '../styles/Cart.scss';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function Cart({
  cart,
  placeOrder,
  isOnline,
}: {
  cart: CartItem[];
  placeOrder: () => void;
  isOnline: boolean;
}) {
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
              </li>
            ))}
          </ul>
          <h2>Total: ${total.toFixed(2)}</h2>
          <button onClick={placeOrder}>Place Order</button>
          {!isOnline && (
            <p className="offline-message">
              You are offline. Your order will be placed once you're back
              online.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Cart;
