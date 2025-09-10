import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    image: product?.image || '',
    featured: product?.featured || false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef();

  const categories = ['Whey Protein', 'Mass Gainer', 'Creatine', 'Pre-Workout'];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setImageFile(file);
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImagePreview(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file); // actual file
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result); // base64 preview for UI
    };
    reader.readAsDataURL(file);
  }
};


  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!imagePreview && !product) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsLoading(true);

  //   // Simulate loading delay
  //   setTimeout(() => {
  //     const submitData = {
  //       ...formData,
  //       price: parseFloat(formData.price),
  //       image: imagePreview || formData.image,
  //     };

  //     // In a real app, you would handle file upload here
  //     if (imageFile) {
  //       // For demo, we're using the preview URL
  //       submitData.image = imagePreview;
  //     }

  //     onSubmit(submitData);
  //     setIsLoading(false);
  //   }, 1000);
  // };
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsLoading(true);

  try {
    // Prepare form data
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      image: imageFile || null, // <-- Pass actual file object
    };

    await onSubmit(submitData); // Calls productService.createProduct or updateProduct
  } catch (err) {
    console.error("Error submitting product:", err);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="font-heading font-bold text-xl text-neutral-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block font-body font-medium text-neutral-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
                errors.name ? 'border-red-500' : 'border-neutral-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-body">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-body font-medium text-neutral-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              placeholder="Enter product description"
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block font-body font-medium text-neutral-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
                  errors.price ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 font-body">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block font-body font-medium text-neutral-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body ${
                  errors.category ? 'border-red-500' : 'border-neutral-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 font-body">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-body font-medium text-neutral-700 mb-2">
              Product Image *
            </label>
            <div className="space-y-4">
              {imagePreview && (
                <div className="relative w-32 h-32">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-neutral-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  errors.image 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-neutral-300 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div className="p-3 bg-neutral-100 rounded-full">
                      {imagePreview ? <ImageIcon className="h-8 w-8 text-primary" /> : <Upload className="h-8 w-8 text-neutral-400" />}
                    </div>
                  </div>
                  <div>
                    <p className="font-body font-medium text-neutral-700">
                      {imagePreview ? 'Click to change image' : 'Click to upload image'}
                    </p>
                    <p className="font-body text-sm text-neutral-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-600 font-body">{errors.image}</p>
            )}
          </div>

          {/* Featured Checkbox */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 font-body text-neutral-700">
                Mark as featured product
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-neutral-600 font-body font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
              )}
              {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;