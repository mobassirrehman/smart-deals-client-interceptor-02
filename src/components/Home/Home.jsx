import React from "react";
import { Link } from "react-router";
import LatestProducts from "../LatestProducts/LatestProducts";

const Home = () => {
  return (
    <div>
      <div className="hero min-h-[70vh] bg-gradient-to-br from-primary/10 via-secondary/10 to-base-100">
        <div className="hero-content text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Deal Your <span className="text-primary">Products</span>
              <br />
              In A <span className="text-secondary">Smart</span> Way!
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-600">
              SmartDeals helps you sell, resell, and shop from trusted local
              sellers — all in one place!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/allproducts" className="btn btn-primary btn-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Watch All Products
              </Link>
              <Link to="/createAProduct" className="btn btn-secondary btn-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Post a Product
              </Link>
            </div>

            <div className="stats shadow bg-base-100 stats-vertical sm:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Active Products</div>
                <div className="stat-value text-primary">1000+</div>
              </div>
              <div className="stat">
                <div className="stat-title">Happy Users</div>
                <div className="stat-value text-secondary">5000+</div>
              </div>
              <div className="stat">
                <div className="stat-title">Deals Made</div>
                <div className="stat-value">3000+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Recent <span className="text-primary">Products</span>
          </h2>
          <p className="text-lg text-gray-600">
            Check out the latest deals from our community
          </p>
        </div>
        <LatestProducts />
        <div className="text-center mt-8">
          <Link to="/allproducts" className="btn btn-outline btn-primary">
            Show All Products
          </Link>
        </div>
      </div>

      <div className="bg-base-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="bg-primary text-primary-content w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="card-title">Post Your Product</h3>
                <p>List your item with photos, description, and price range</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="bg-secondary text-secondary-content w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="card-title">Receive Bids</h3>
                <p>Buyers place competitive bids on your product</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="bg-accent text-accent-content w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="card-title">Accept & Sell</h3>
                <p>Choose the best bid and complete the deal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
