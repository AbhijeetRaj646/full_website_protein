import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit3, Trash2, LogOut, Package, Users, DollarSign, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useToast } from '../hooks/useToast.js';
import { productService } from '../api/productService.js';
import ProductForm from '../components/ProductForm.jsx';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [about, setAbout] = useState({ title: "", content: "" });
  const [contact, setContact] = useState({ email: "", phone: "", address: "", whatsappLink: "" });
  const [savingAbout, setSavingAbout] = useState(false);
  const [savingContact, setSavingContact] = useState(false);


  useEffect(() => {
    fetchProducts();
    fetchAboutData();
    fetchContactData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data.products);
    } catch (err) {
      error('Error fetching products');
      console.error('Error fetching products:', err);
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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (product) => {
    try {
      await productService.deleteProduct(product.id);
      setProducts(products.filter(p => p.id !== product.id));
      success('Product deleted successfully');
    } catch (err) {
      error('Error deleting product');
      console.error('Error deleting product:', err);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        const response = await productService.updateProduct(editingProduct.id, productData);
        setProducts(products.map(p => 
          p.id === editingProduct.id ? response.data.product : p
        ));
        success('Product updated successfully');
      } else {
        const response = await productService.createProduct(productData);
        setProducts([...products, response.data.product]);
        success('Product created successfully');
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (err) {
      error('Error saving product');
      console.error('Error saving product:', err);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

const fetchAboutData = async () => {
  try {
    const res = await productService.getAbout();
    setAbout({
      title: res.data.title || "",
      content: res.data.content || ""
    });
  } catch (err) {
    error("Error fetching About content");
    console.error(err);
  }
};

const fetchContactData = async () => {
  try {
    const res = await productService.getContact();
    setContact({
      email: res.data.email || "",
      phone: res.data.phone || "",
      address: res.data.address || "",
      whatsappLink: res.data.whatsappLink || ""
    });
  } catch (err) {
    error("Error fetching Contact details");
    console.error(err);
  }
};


const handleSaveAbout = async () => {
  setSavingAbout(true);
  try {
    console.log("Saving About payload:", about);  // 👀 Debug log
    await productService.updateAbout(about);
    success("About updated successfully");
  } catch (err) {
    error("Error updating About");
    console.error(err);
  } finally {
    setSavingAbout(false);
  }
};


const handleSaveContact = async () => {
  setSavingContact(true);
  try {
    await productService.updateContact({
      email: contact.email,
      phone: contact.phone,
      address: contact.address,
      whatsappLink: contact.whatsappLink
    });
    success("Contact updated successfully");
  } catch (err) {
    error("Error updating Contact");
    console.error(err);
  } finally {
    setSavingContact(false);
  }
};

  // Stats
  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: <Package className="h-8 w-8" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Categories',
      value: new Set(products.map(p => p.category)).size,
      icon: <Users className="h-8 w-8" />,
      color: 'bg-green-500'
    },
    {
      title: 'Avg. Price',
      value: `₹${(products.reduce((sum, p) => sum + p.price, 0) / products.length || 0).toFixed(2)}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'Featured',
      value: products.filter(p => p.featured).length,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" className="mb-4" />
          <p className="font-body text-neutral-600">Loading dashboard...</p>
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
                Admin Dashboard
              </h1>
              <p className="font-body text-neutral-600 mt-1">
                Manage your products and inventory
              </p>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-card p-6">
              <div className="flex items-center">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="font-body text-sm text-neutral-600">{stat.title}</p>
                  <p className="font-heading font-bold text-2xl text-neutral-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-body"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddProduct}
              className="flex items-center px-6 py-2 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-neutral-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-neutral-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-neutral-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-body font-medium text-neutral-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-body font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            src={product.image_url ? `http://localhost:8000${product.image_url}` : '/placeholder.png'}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-body font-medium text-neutral-900">
                            {product.name}
                          </div>
                          <div className="font-body text-sm text-neutral-500 line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-body font-medium bg-neutral-100 text-neutral-800 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-body font-semibold text-neutral-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-body font-medium rounded-full ${
                        product.featured 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {product.featured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* About & Contact Section */}
{/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
{/* About & Contact Section */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
  {/* About Section */}
  <div className="bg-white rounded-xl shadow-card p-6">
    <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-4">
      About Section
    </h3>
    {/* About Title */}
    <input
      type="text"
      placeholder="About Title"
      value={about.title || ""}
      onChange={(e) => setAbout({ ...about, title: e.target.value })}
      className="w-full border border-neutral-300 rounded-lg p-3 mb-4 font-body focus:ring-2 focus:ring-primary focus:border-transparent"
    />
    {/* About Content */}
    <textarea
      placeholder="About Content"
      value={about.content || ""}
      onChange={(e) => setAbout({ ...about, content: e.target.value })}
      className="w-full min-h-[120px] border border-neutral-300 rounded-lg p-3 font-body focus:ring-2 focus:ring-primary focus:border-transparent"
    />
    <button
      onClick={handleSaveAbout}
      disabled={savingAbout}
      className="mt-4 px-6 py-2 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      {savingAbout ? "Saving..." : "Save About"}
    </button>
  </div>

  {/* Contact Section */}
  <div className="bg-white rounded-xl shadow-card p-6">
    <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-4">
      Contact Details
    </h3>
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={contact.email || ""}
        onChange={(e) => setContact({ ...contact, email: e.target.value })}
        className="w-full border border-neutral-300 rounded-lg p-3 font-body focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <input
        type="text"
        placeholder="Phone"
        value={contact.phone || ""}
        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        className="w-full border border-neutral-300 rounded-lg p-3 font-body focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <textarea
        placeholder="Address"
        value={contact.address || ""}
        onChange={(e) => setContact({ ...contact, address: e.target.value })}
        className="w-full min-h-[80px] border border-neutral-300 rounded-lg p-3 font-body focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <input
        type="text"
        placeholder="WhatsApp Number"
        value={contact.whatsappLink || ""}
        onChange={(e) => setContact({ ...contact, whatsappLink: e.target.value })}
        className="w-full border border-neutral-300 rounded-lg p-3 font-body focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
    <button
      onClick={handleSaveContact}
      disabled={savingContact}
      className="mt-4 px-6 py-2 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      {savingContact ? "Saving..." : "Save Contact"}
    </button>
  </div>
</div>


        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-24 w-24 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
              No products found
            </h3>
            <p className="font-body text-neutral-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddProduct}
                className="px-6 py-2 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add First Product
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleProductSubmit}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-card p-6 max-w-md mx-4">
            <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-4">
              Delete Product
            </h3>
            <p className="font-body text-neutral-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-neutral-600 font-body font-medium rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white font-body font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;