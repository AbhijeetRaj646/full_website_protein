import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';

const ProductCard = ({ product, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image_url ? `http://localhost:8000${product.image_url}` : '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.featured && (
          <div className="absolute top-3 left-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-body font-semibold">
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-2">
          <span className="inline-block bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm font-body">
            {product.category}
          </span>
        </div>

        <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <p className="font-body text-neutral-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 text-yellow-400 fill-current"
              />
            ))}
          </div>
          <span className="font-body text-sm text-neutral-500 ml-2">(47)</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-2xl text-primary">
              ₹{product.price}
            </span>
          </div>
          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center px-4 py-2 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary/90 transition-colors group/btn"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;