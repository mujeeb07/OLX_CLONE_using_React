import React from 'react';
import { formatDistanceToNow } from 'date-fns';

function Cards({ product }) {
  const imageUrl = product.photos && product.photos.length > 0 ? product.photos[0] : 'https://via.placeholder.com/150?text=No+Image';
  const publishedDate = product.createdAt?.toDate
    ? formatDistanceToNow(product.createdAt.toDate(), { addSuffix: true })
    : 'Unknown';
  const location = product.location && product.state ? `${product.location}, ${product.state}` : product.location || 'Unknown';

  return (
    <div className="max-w-xs w-full rounded border-gray-300 border-1 shadow-sm overflow-hidden relative hover:shadow-lg transition-shadow p-3">
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.title || 'Product'}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-bold">₹{product.price?.toFixed(2) || 'N/A'}</h2>
        <p className="text-sm text-gray-700 font-semibold truncate">{product.title || 'Untitled'}</p>
        <p className="text-sm text-gray-700">{product.category || 'Uncategorized'}</p>
        <div className="text-xs text-gray-500 flex justify-between pt-1">
          <span>{location}</span>
          <span>{publishedDate}</span>
        </div>
      </div>
    </div>
  );
}

export default Cards;