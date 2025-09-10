import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, FileText, Phone, LogOut, Loader2 } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../hooks/useToast.js';
import { productService } from '../api/productService.js';

const ContentManagement = () => {
  const [aboutContent, setAboutContent] = useState({
    title: '',
    content: '',
    lastUpdated: ''
  });

  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    address: '',
    whatsappLink: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({ about: false, contact: false });

  const navigate = useNavigate();
  const { success, error } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aboutResponse, contactResponse] = await Promise.all([
        productService.getAbout(),
        productService.getContact()
      ]);

      setAboutContent({
        title: aboutResponse.title || '',
        content: aboutResponse.content || '',
        lastUpdated: aboutResponse.lastUpdated || ''
      });

      setContactData({
        email: contactResponse.email || '',
        phone: contactResponse.phone || '',
        address: contactResponse.address || '',
        whatsappLink: contactResponse.whatsappLink || ''
      });
    } catch (err) {
      error('Error fetching content data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleSaveAbout = async () => {
    setSaving({ ...saving, about: true });
    try {
      await productService.updateAbout(aboutContent);
      success('About content updated successfully');
    } catch (err) {
      error('Error updating about content');
      console.error('Error updating about:', err);
    } finally {
      setSaving({ ...saving, about: false });
    }
  };

  const handleSaveContact = async () => {
    setSaving({ ...saving, contact: true });
    try {
      await productService.updateContact(contactData);
      success('Contact details updated successfully');
    } catch (err) {
      error('Error updating contact details');
      console.error('Error updating contact:', err);
    } finally {
      setSaving({ ...saving, contact: false });
    }
  };

  const handleContactChange = (field, value) => {
    setContactData({ ...contactData, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <p className="font-body text-neutral-600">Loading content management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="font-heading font-bold text-2xl text-neutral-900">
                Content Management
              </h1>
              <p className="font-body text-neutral-600 mt-1">
                Manage About Us and Contact Details
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 text-neutral-600 hover:text-primary font-body transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-neutral-600 hover:text-red-600 font-body transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* About Us Section */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-xl text-neutral-900">
                    About Us Content
                  </h2>
                  <p className="font-body text-sm text-neutral-600">
                    Edit the about us section content
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={aboutContent.title}
                onChange={(e) =>
                  setAboutContent({ ...aboutContent, title: e.target.value })
                }
                placeholder="Enter About Us title"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              />

              <RichTextEditor
                value={aboutContent.content}
                onChange={(value) => setAboutContent({ ...aboutContent, content: value })}
                placeholder="Enter about us content..."
              />

              {aboutContent.lastUpdated && (
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(aboutContent.lastUpdated).toLocaleString()}
                </p>
              )}

              <button
                onClick={handleSaveAbout}
                disabled={saving.about}
                className="w-full flex items-center justify-center px-6 py-3 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving.about ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save About Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-accent/10 rounded-lg mr-3">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-xl text-neutral-900">
                    Contact Details
                  </h2>
                  <p className="font-body text-sm text-neutral-600">
                    Update contact information
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-body font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={contactData.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block font-body font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={contactData.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block font-body font-medium text-neutral-700 mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  rows="3"
                  value={contactData.address}
                  onChange={(e) => handleContactChange('address', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                  placeholder="Enter business address"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block font-body font-medium text-neutral-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={contactData.whatsappLink}
                  onChange={(e) => handleContactChange('whatsappLink', e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
                  placeholder="Enter WhatsApp number"
                />
                <p className="mt-1 text-sm text-neutral-500 font-body">
                  Enter number without country code prefix (e.g., 1234567890)
                </p>
              </div>

              <button
                onClick={handleSaveContact}
                disabled={saving.contact}
                className="w-full flex items-center justify-center px-6 py-3 bg-accent text-white font-body font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving.contact ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Contact Details
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white rounded-xl shadow-card p-6">
          <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-4">
            About Us Preview
          </h3>
          <div
            className="prose prose-neutral max-w-none font-body"
            dangerouslySetInnerHTML={{ __html: aboutContent.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
