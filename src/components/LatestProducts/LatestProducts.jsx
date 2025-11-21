import React, { useState, useEffect } from "react";
import Product from "../Product/Product";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/latest-products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h2 className="text-5xl">Recent Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {products.map((product) => (
          <Product key={product._id} product={product}></Product>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
