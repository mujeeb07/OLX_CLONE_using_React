import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { db } from '../firebase/setup';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

// sell form component
function SellForm({ setShowForm }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [sellername, setSellerName] = useState('');
  const [phone, setPhone] = useState(''); // new field for phone
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // check if user is logged in
  if (!user) {
    return (
      <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-zinc-900/75 transition-opacity" aria-hidden="true"></div>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-2xl sm:p-6">
              <div className="p-6">
                <h2 className="text-base font-semibold text-gray-900">please log in</h2>
                <p className="mt-2 text-sm text-gray-600">you must be logged in to post a listing.</p>
                <button
                  className="mt-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                  onClick={() => setShowForm(false)}
                >
                  close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // upload images to cloudinary
  const uploadImagesToCloudinary = async (files) => {
    const uploadPreset = 'olx-clone';
    const cloudName = 'dhrrrgsc6';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const response = await fetch(uploadUrl, { method: 'POST', body: formData });
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        if (data.secure_url) uploadedUrls.push(data.secure_url);
      } catch (error) {
        throw error;
      }
    }
    return uploadedUrls;
  };

  // handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      // upload images
      let imageUrls = [];
      if (photos.length > 0) {
        imageUrls = await uploadImagesToCloudinary(photos);
      }

      // save seller details to users collection
      const userData = {
        uid: user.uid,
        email: user.email,
        username: sellername,
        phone: phone || '',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), userData, { merge: true });

      // save listing to listings collection
      const listingData = {
        title,
        sellername,
        brand,
        price: parseFloat(price),
        category,
        condition,
        description,
        photos: imageUrls,
        location,
        state,
        userId: user.uid,
        createdAt: new Date(),
      };
      await addDoc(collection(db, 'listings'), listingData);

      toast.success('listing posted successfully!', {
        position: 'top-right',
        autoClose: 2000,
      });
      setShowForm(false);
    } catch (error) {
      console.error('error posting listing:', error);
      setError('error posting listing: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  // handle file input changes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('max 5 photos allowed');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    const validTypes = [' входimage/png', 'image/jpeg', 'image/gif'];
    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        setError('only png, jpeg, gif allowed');
        return;
      }
      if (file.size > maxSize) {
        setError('file size exceeds 10mb');
        return;
      }
    }

    setPhotos(files);
    setError('');
  };

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-zinc-900/75 transition-opacity" aria-hidden="true"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-2xl sm:p-6">
            <form onSubmit={handleFormSubmit} className="space-y-8 p-6">
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  {error}
                </div>
              )}
              {/* product details */}
              <div className="border-b border-gray-900/10 pb-8">
                <h2 className="text-base font-semibold text-gray-900">product details</h2>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label htmlFor="product-title" className="block text-sm/6 font-medium text-gray-900">
                      product title
                    </label>
                    <input
                      type="text"
                      name="product-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="e.g., iPhone 13 Pro Max"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="seller-name" className="block text-sm/6 font-medium text-gray-900">
                      seller name
                    </label>
                    <input
                      type="text"
                      name="seller-name"
                      value={sellername}
                      onChange={(e) => setSellerName(e.target.value)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="please enter your name"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                      phone number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="e.g., +91 9876543210"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="brand" className="block text-sm/6 font-medium text-gray-900">
                      brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="e.g., Apple"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                      price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="e.g., 500.00"
                    />
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="category" className="block text-sm/6 font-medium text-gray-900">
                      category
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <select
                        id="category"
                        name="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option value="">select a category</option>
                        <option>electronics</option>
                        <option>furniture</option>
                        <option>vehicles</option>
                        <option>clothing</option>
                        <option>books</option>
                        <option>other</option>
                      </select>
                      <svg
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="condition" className="block text-sm/6 font-medium text-gray-900">
                      condition
                    </label>
                    <div className="mt-2 grid grid-cols-1">
                      <select
                        id="condition"
                        name="condition"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        required
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      >
                        <option value="">select condition</option>
                        <option>new</option>
                        <option>like new</option>
                        <option>used - good</option>
                        <option>used - fair</option>
                      </select>
                      <svg
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900">
                      description
                    </label>
                    <textarea
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows="4"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="describe your product (e.g., features, condition, reason for selling)"
                    ></textarea>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="photos" className="block text-sm/6 font-medium text-gray-900">
                      photos
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <svg
                          className="mx-auto size-12 text-gray-300"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1ം.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                          <label
                            htmlFor="photos"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500"
                          >
                            <span>upload photos</span>
                            <input
                              id="photos"
                              name="photos"
                              type="file"
                              accept="image/png,image/jpeg,image/gif"
                              multiple
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs/5 text-gray-600">png, jpg, gif up to 10mb (max 5 photos)</p>
                      </div>
                    </div>
                    {/* image preview */}
                    {photos.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Array.from(photos).map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                              onClick={() =>
                                setPhotos(Array.from(photos).filter((_, i) => i !== index))
                              }
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* location details */}
              <div className="border-b border-gray-900/10 pb-8">
                <h2 className="text-base font-semibold text-gray-900">location</h2>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                      city
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="e.g., New York"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="region" className="block text-sm/6 font-medium text-gray-900">
                      state / province
                    </label>
                    <input
                      type="text"
                      name="region"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      placeholder="e.g., NY"
                    />
                  </div>
                </div>
              </div>

              {/* form actions */}
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm/6 font-semibold text-gray-900"
                  onClick={() => setShowForm(false)}
                  disabled={uploading}
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={uploading}
                >
                  {uploading ? 'posting...' : 'post listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellForm;