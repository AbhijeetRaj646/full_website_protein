import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Star, Shield, Truck, RefreshCcw } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { productService } from '../api/productService.js';
import { APP_CONFIG } from '../config.js';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response.data.product);
      } catch (error) {
        setError('Product not found');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleWhatsAppOrder = () => {
    const message = `Hi! I'm interested in ordering ${product.name} ($${product.price}). Can you please provide more details?`;
    const url = `https://wa.me/${APP_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <p className="font-body text-neutral-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading font-bold text-2xl text-neutral-900 mb-4">
            Product Not Found
          </h2>
          <p className="font-body text-neutral-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Quality Assured',
      description: 'Lab-tested for purity'
    },
    {
      icon: <Truck className="h-5 w-5" />,
      title: 'Fast Shipping',
      description: 'Free delivery over $50'
    },
    {
      icon: <RefreshCcw className="h-5 w-5" />,
      title: '30-Day Return',
      description: 'Money-back guarantee'
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/products"
            className="inline-flex items-center text-neutral-600 hover:text-primary font-body transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square lg:aspect-auto">
              <img
                src={product.image_url ? `http://localhost:8000${product.image_url}` : '/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-body font-medium">
                  {product.category}
                </span>
              </div>

              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="font-body text-neutral-500 ml-2">(47 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="font-heading font-bold text-4xl text-primary">
                  ₹{product.price}
                </span>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-3">
                  Description
                </h3>
                <p className="font-body text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-4">
                  Why Choose This Product?
                </h3>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary mr-4">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-body font-semibold text-neutral-900">
                          {feature.title}
                        </h4>
                        <p className="font-body text-sm text-neutral-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full flex items-center justify-center px-8 py-4 bg-green-600 text-white font-body font-semibold text-lg rounded-lg hover:bg-green-700 transition-colors group"
              >
                <MessageSquare className="w-6 h-6 mr-3" />
                Order Now via WhatsApp
              </button>

              <p className="font-body text-sm text-neutral-500 text-center mt-4">
                Click to chat with us on WhatsApp for instant ordering and support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;