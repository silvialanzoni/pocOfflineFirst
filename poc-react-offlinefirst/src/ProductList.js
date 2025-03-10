import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function ProductList() {
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
    <div>
      <h1>{category === 'fruits' ? 'Fruits' : 'Vegetables'} List</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
