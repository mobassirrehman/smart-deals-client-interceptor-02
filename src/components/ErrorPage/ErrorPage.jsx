import React from 'react';
import { Link, useRouteError } from 'react-router';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-4">Oops! Page Not Found</h2>
        <p className="text-xl text-gray-600 mb-8">
          {error?.statusText || error?.message || "The page you're looking for doesn't exist."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <Link to="/allproducts" className="btn btn-outline btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;