import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram } from 'lucide-react';
import { APP_CONFIG } from '../config.js';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-8 w-8" />
              <span className="font-heading font-bold text-2xl">
                {APP_CONFIG.BRAND_NAME}
              </span>
            </div>
            <p className="font-body text-neutral-300 mb-4 max-w-md">
              Your trusted partner in fitness nutrition. We provide premium quality 
              supplements to help you achieve your fitness goals and build the body 
              you've always wanted.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-300 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-body text-neutral-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="font-body text-neutral-300 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <a href="#" className="font-body text-neutral-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-neutral-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=Whey Protein" className="font-body text-neutral-300 hover:text-white transition-colors">
                  Whey Protein
                </Link>
              </li>
              <li>
                <Link to="/products?category=Mass Gainer" className="font-body text-neutral-300 hover:text-white transition-colors">
                  Mass Gainer
                </Link>
              </li>
              <li>
                <Link to="/products?category=Creatine" className="font-body text-neutral-300 hover:text-white transition-colors">
                  Creatine
                </Link>
              </li>
              <li>
                <Link to="/products?category=Pre-Workout" className="font-body text-neutral-300 hover:text-white transition-colors">
                  Pre-Workout
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-neutral-600 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-body text-neutral-300 text-sm">
            © 2024 {APP_CONFIG.BRAND_NAME}. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="font-body text-neutral-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-neutral-300 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;