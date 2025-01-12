import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/ProductList.scss';

function ProductList({ addToCart, cartCount }) {
  const location = useLocation();
  const { category } = location.state || {};
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (category) {
      fetch('/products.json')
        .then((response) => response.json())
        .then((data) => {
          if (category === 'fruits') {
            setProducts(data.fruits);
          } else if (category === 'vegetables') {
            setProducts(data.vegetables);
          }
        });
    }
  }, [category]);

  return (
    <div className="product-list-container">
      <header className="product-list-header">
        <Link to="/" className="back-button">← Back</Link>
        <Link to="/cart" className="cart-icon">
          🛒 <span>{cartCount}</span>
        </Link>
      </header>

      <div className="category-title">
        <h1>{category === 'fruits' ? 'Fruits' : 'Vegetables'} List</h1>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
