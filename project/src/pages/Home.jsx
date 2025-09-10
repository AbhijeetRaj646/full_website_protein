import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { productService } from '../api/productService.js';
import { APP_CONFIG } from '../config.js';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        const featured = response.data.products.filter(product => product.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Featured Products Section */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 mb-4">
              Featured Products
            </h2>
            <p className="font-body text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover our most popular supplements, trusted by thousands of fitness enthusiasts worldwide.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-primary text-white font-body font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-neutral-900 mb-6">
                Why Choose {APP_CONFIG.BRAND_NAME}?
              </h2>
              <p className="font-body text-lg text-neutral-600 mb-6">
                We're committed to providing the highest quality supplements to help you achieve 
                your fitness goals. Our products are scientifically formulated, rigorously tested, 
                and trusted by athletes worldwide.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-4"></div>
                  <span className="font-body text-neutral-700">Premium ingredients sourced globally</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-4"></div>
                  <span className="font-body text-neutral-700">Third-party lab tested for purity</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-4"></div>
                  <span className="font-body text-neutral-700">Fast and reliable shipping</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-4"></div>
                  <span className="font-body text-neutral-700">30-day money-back guarantee</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1"
                alt="Quality supplements"
                className="rounded-xl shadow-card max-w-md w-full"
              />
            </div>
          </div>
        </div> */}
            <div className="text-center mt-12">
        <h2 className="text-3xl font-bold mb-4">Why Choose {APP_CONFIG.BRAND_NAME}?</h2>
        <p className="text-lg text-neutral-600 mb-6">
          Learn more about our mission, vision, and what drives {APP_CONFIG.BRAND_NAME}.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Learn More About Us
        </Link>
      </div>
  
      </section>
    </div>
  );
};

export default Home;