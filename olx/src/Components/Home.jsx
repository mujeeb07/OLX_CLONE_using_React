import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/setup';
import Cards from './Cards';
import Navbar from '../Components/Navbar';
import Menubar from '../Components/Menubar';
import Footer from '../Components/Footer';

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'listings'));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Fetched listings:', productList);
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Menubar />
      <main className="flex-grow">
        <div className="mt-20 mx-auto p-6 max-w-7xl">
          <h2 className="text-2xl font-bold mb-6">Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Link key={product.id} to={`/details/${product.id}`} className="flex justify-center">
                  <Cards product={product} />
                </Link>
              ))
            ) : (
              <p className="text-center col-span-full">No listings available.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;