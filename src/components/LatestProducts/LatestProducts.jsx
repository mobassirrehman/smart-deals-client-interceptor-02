import React, { useState, useEffect } from "react";
import { Link } from "react-router";

const LatestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/latest-products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="card bg-base-100 shadow-xl">
            <div className="skeleton h-48 w-full"></div>
            <div className="card-body">
              <div className="skeleton h-6 w-3/4 mb-2"></div>
              <div className="skeleton h-4 w-1/2 mb-4"></div>
              <div className="skeleton h-10 w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        >
          <figure className="px-4 pt-4">
            <img
              src={product.image}
              alt={product.title}
              className="rounded-xl h-48 w-full object-cover"
              onError={handleImageError}
            />
          </figure>
          <div className="card-body p-4">
            <div className="badge badge-primary badge-sm">
              {product.category}
            </div>
            <h2 className="card-title text-lg">{product.title}</h2>
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-primary">
                ${product.price_min} - ${product.price_max}
              </p>
              <p className="flex items-center gap-1 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {product.location}
              </p>
            </div>
            <div className="card-actions justify-end mt-2">
              <Link
                to={`/productDetails/${product._id}`}
                className="btn btn-primary btn-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LatestProducts;
