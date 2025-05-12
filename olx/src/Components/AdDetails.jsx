import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/setup';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../Context/AuthContext';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

function AdDetails() {
  const { id } = useParams();
  const { getUserInfo } = useAuth();
  const [listing, setListing] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // fetch listing and seller details
  useEffect(() => {
    const fetchListingAndSeller = async () => {
      try {
        const listingDoc = await getDoc(doc(db, 'listings', id));
        if (listingDoc.exists()) {
          const listingData = { id: listingDoc.id, ...listingDoc.data() };
          setListing(listingData);
          if (listingData.userId) {
            const sellerInfo = await getUserInfo(listingData.userId);
            if (sellerInfo) {
              setSeller(sellerInfo);
            } else {
              toast.error('seller info not found');
            }
          } else {
            toast.error('no seller for this listing');
          }
        } else {
          toast.error('listing not found');
        }
      } catch (error) {
        console.error('error fetching listing/seller:', error);
        toast.error('failed to load details');
      }
    };
    fetchListingAndSeller();
  }, [id, getUserInfo]);

  // image carousel controls
  const nextImage = () =>
    listing?.photos?.length > 0 &&
    setCurrentImageIndex((prev) => (prev + 1) % listing.photos.length);

  const prevImage = () =>
    listing?.photos?.length > 0 &&
    setCurrentImageIndex((prev) => (prev - 1 + listing.photos.length) % listing.photos.length);

  if (!listing) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-lg">loading...</p>
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
          {/* image carousel */}
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
                      className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700"
                    >
                      ←
                    </button>
                    <button
                      onClick={nextImage}
                      className="bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700"
                    >
                      →
                    </button>
                  </div>
                )}
                <div className="flex mt-4 space-x-2 overflow-x-auto">
                  {listing.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`thumbnail ${index + 1}`}
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
                <span className="text-gray-500">no images available</span>
              </div>
            )}
          </div>

          {/* product details */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{listing.title || 'untitled'}</h1>
            <p className="text-2xl font-semibold text-green-600">₹{listing.price?.toFixed(2) || 'n/a'}</p>
            <p className="text-sm text-gray-500">
              posted{' '}
              {listing.createdAt?.toDate
                ? formatDistanceToNow(listing.createdAt.toDate(), { addSuffix: true })
                : 'unknown'}
            </p>
            <div className="border-t border-b py-4 space-y-2 bg-gray-50 p-4 rounded-lg">
              <p>
                <span className="font-semibold">category:</span> {listing.category || 'uncategorized'}
              </p>
              <p>
                <span className="font-semibold">brand:</span> {listing.brand || 'n/a'}
              </p>
              <p>
                <span className="font-semibold">condition:</span> {listing.condition || 'n/a'}
              </p>
              <p>
                <span className="font-semibold">location:</span>{' '}
                {listing.location && listing.state ? `${listing.location}, ${listing.state}` : 'unknown'}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {listing.description || 'no description provided'}
              </p>
            </div>
          </div>
        </div>

        {/* seller information */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold">seller information</h2>
          <div className="mt-4 space-y-2">
            <p>
              <span className="font-semibold">name:</span> {seller?.username || listing?.name || 'n/a'}
            </p>
            <p>
              <span className="font-semibold">email:</span> {seller?.email || 'n/a'}
            </p>
            <p>
              <span className="font-semibold">contact:</span> please contact via platform messaging
            </p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => toast.info('please use the platform to message the seller')}
            >
              contact seller
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AdDetails;