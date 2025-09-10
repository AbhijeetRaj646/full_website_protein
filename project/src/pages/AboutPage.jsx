import React, { useState, useEffect } from 'react';
import { productService } from '../api/productService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { APP_CONFIG } from '../config.js';

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await productService.getAbout(); 
        // ✅ response.data is already the about object
        setAbout(response.data); 
      } catch (err) {
        console.error('Failed to fetch About content:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !about) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error || 'About content not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-neutral-900 mb-4">
            {about.title}
          </h1>
          <p className="font-body text-lg text-neutral-600 max-w-2xl mx-auto">
            Learn more about our mission, vision, and what drives {APP_CONFIG.BRAND_NAME}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className="prose prose-lg text-neutral-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: about.content }}
          />

          <div className="flex justify-center">
            {/* <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1"
              alt="About us"
              className="rounded-xl shadow-card max-w-md w-full"
            /> */}
            <img
              src="https://images.pexels.com/photos/16216617/pexels-photo-16216617.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1"
              alt="About us"
              className="rounded-xl shadow-card"
              style={{ width: "600px", height: "400px", objectFit: "cover" }}
            />
            
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(about.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
