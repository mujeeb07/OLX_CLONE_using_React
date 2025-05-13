import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/setup';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

function AdDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingDoc = await getDoc(doc(db, 'listings', id));
        console.log("details:", listingDoc.data())
        if (listingDoc.exists()) {
          setListing({ id: listingDoc.id, ...listingDoc.data() });
        } else {
          toast.error('Listing not found.');
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to load listing details.');
      }
    };
    fetchListing();
  }, [id]);

  // Image carousel controls
  const nextImage = () => {
    if (listing?.photos?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % listing.photos.length);
    }
  };

  const prevImage = () => {
    if (listing?.photos?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);
    }
  };

  if (!listing) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="relative">
            {listing.photos?.length > 0 ? (
              <>
                <img
                  src={listing.photos[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-96 object-cover rounded-lg border border-gray-200"
                />
                {listing.photos.length > 1 && (
                  <div className="absolute top-1/2 w-full flex justify-between px-4 transform -translate-y-1/2">
                    <button
                      onClick={prevImage}
                      className="bg-gray-800-10 text-white  rounded-full h-12 w-12 "
                    >
                      {'<'}
                    </button>
                    <button
                      onClick={nextImage}
                      className="bg-gray-800-10 text-white  rounded-full h-12 w-12 "
                    >
                      {'>'}
                    </button>
                  </div>
                )}
                <div className="flex mt-4 space-x-2 overflow-x-auto">
                  {listing.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-16 h-16 object-cover rounded cursor-pointer ${
                        index === currentImageIndex ? 'border-2 border-blue-500' : ''
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">No images available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{listing.title || 'Untitled'}</h1>
            <p className="text-2xl font-semibold text-green-600">₹{listing.price?.toFixed(2) || 'N/A'}</p>
            <p className="text-sm text-gray-500">
              Posted {listing.createdAt?.toDate ? formatDistanceToNow(listing.createdAt.toDate(), { addSuffix: true }) : 'Unknown'}
            </p>
            <div className="border-t border-b py-4 space-y-2 bg-gray-50 p-4 rounded-lg">
              <p><span className="font-semibold">Category:</span> {listing.category || 'Uncategorized'}</p>
              <p><span className="font-semibold">Brand:</span> {listing.brand || 'N/A'}</p>
              <p><span className="font-semibold">Condition:</span> {listing.condition || 'N/A'}</p>
              <p><span className="font-semibold">Location:</span> {listing.location && listing.state ? `${listing.location}, ${listing.state}` : 'Unknown'}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{listing.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold">Seller Information</h2>
          <div className="mt-4 space-y-2">
            <p><span className="font-semibold">SellerName:</span> {listing?.sellername}</p>
            <p><span className="font-semibold">PhoneNumber:</span> {listing?.phonenumber}</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => toast.info('Please use the platform to message the seller.')}
            >
              Contact Seller
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdDetails;