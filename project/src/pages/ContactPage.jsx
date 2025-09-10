import React, { useState, useEffect } from 'react';
import { productService } from '../api/productService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const ContactPage = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await productService.getContact(); 
        // ✅ response.data is already the contact object
        setContact(response.data);
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
        setError('Failed to load contact information');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <p>{error || 'Contact information not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-neutral-900 mb-4">
            Get In Touch
          </h1>
          <p className="font-body text-lg text-neutral-600 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Email */}
          <div className="card p-6 text-center shadow-sm rounded-xl">
            <div className="flex justify-center mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <a
              href={`mailto:${contact.email}`}
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              {contact.email}
            </a>
          </div>

          {/* Phone */}
          <div className="card p-6 text-center shadow-sm rounded-xl">
            <div className="flex justify-center mb-4">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
            <a
              href={`tel:${contact.phone.replace(/\D/g, '')}`}
              className="text-green-600 hover:text-green-700 transition-colors duration-200"
            >
              {contact.phone}
            </a>
          </div>

          {/* Address */}
          <div className="card p-6 text-center shadow-sm rounded-xl">
            <div className="flex justify-center mb-4">
              <MapPin className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
            <p className="text-gray-600 whitespace-pre-line">{contact.address}</p>
          </div>

          {/* WhatsApp */}
          <div className="card p-6 text-center shadow-sm rounded-xl">
            <div className="flex justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:text-teal-700 transition-colors duration-200"
            >
              Chat with us on WhatsApp
            </a>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(contact.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
