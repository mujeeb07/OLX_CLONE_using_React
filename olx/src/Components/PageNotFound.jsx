import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function PageNotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
          <p className="mt-4 text-lg text-gray-600">
            The page you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PageNotFound;