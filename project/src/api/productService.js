
const API_BASE = "http://localhost:8000"; // Your backend URL


// --- Mock About data ---
// let aboutData = {
//   title: 'About Our Company',
//   content: `
//     <h2>Welcome to our innovative company!</h2>
//     <p>We are a dynamic team dedicated to delivering exceptional solutions that transform businesses and empower growth.</p>
//     <h3>Our Mission</h3>
//     <p>To provide cutting-edge solutions that help businesses thrive in today's competitive landscape.</p>
//     <h3>What We Offer</h3>
//     <ul>
//       <li>Strategic consulting and planning</li>
//       <li>Custom software development</li>
//       <li>Digital transformation services</li>
//       <li>24/7 customer support</li>
//     </ul>
//   `,
//   lastUpdated: new Date().toISOString(),
// };

// // --- Mock Contact data ---
// let contactData = {
//   email: 'hello@company.com',
//   phone: '+1 (555) 123-4567',
//   address: '123 Business Street, Suite 100\nCity, State 12345',
//   whatsappLink: 'https://wa.me/15551234567',
//   lastUpdated: new Date().toISOString(),
// };

// --- Helper delay ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  //  // --- About ---
  // async getAbout() {
  //   await delay(300);
  //   return { data: { success: true, about: { ...aboutData } } };
  // },

  // async updateAbout(newContent) {
  //   await delay(500);
  //   aboutData = { ...aboutData, ...newContent, lastUpdated: new Date().toISOString() };
  //   return { data: { success: true, about: { ...aboutData } } };
  // },

  // // --- Contact ---
  // async getContact() {
  //   await delay(300);
  //   return { data: { success: true, contact: { ...contactData } } };
  // },

  // async updateContact(newContact) {
  //   await delay(500);
  //   contactData = { ...contactData, ...newContact, lastUpdated: new Date().toISOString() };
  //   return { data: { success: true, contact: { ...contactData } } };
  // },
// --- ABOUT ---
async getAbout() {
    const response = await fetch(`${API_BASE}/api/about`);
    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to fetch about:", errText);
      throw new Error("Failed to fetch about");
    }
    const data = await response.json();
    return { data: data.about }; // return in same shape as ContentManagement.jsx expects
  },

  async updateAbout(newContent) {
    const response = await fetch(`${API_BASE}/api/about`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContent),
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to update about:", errText);
      throw new Error("Failed to update about");
    }
    const data = await response.json();
    return { data: data.about };
  },

  // --- CONTACT ---
  async getContact() {
    const response = await fetch(`${API_BASE}/api/contact`);
    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to fetch contact:", errText);
      throw new Error("Failed to fetch contact");
    }
    const data = await response.json();
    return { data: data.contact }; // consistent with frontend
  },

  async updateContact(newContact) {
    const response = await fetch(`${API_BASE}/api/contact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContact),
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to update contact:", errText);
      throw new Error("Failed to update contact");
    }
    const data = await response.json();
    return { data: data.contact };
  },


  // --- PRODUCTS ---
  async getAllProducts() {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to fetch products:", errText);
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    return { data: { success: true, products } };
  },
  // Get all products
  async getAllProducts() {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to fetch products:", errText);
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    return { data: { success: true, products } };
  },

  // Get product by ID
  async getProductById(id) {
    const response = await fetch(`${API_BASE}/api/products/${id}`);
    if (!response.ok) {
      const errText = await response.text();
      console.error(`Failed to fetch product ${id}:`, errText);
      throw new Error("Product not found");
    }
    const product = await response.json();
    return { data: { success: true, product } };
  },

  // Create product
  async createProduct(productData) {
    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("description", productData.description || "");
    formData.append("price", productData.price || 0);
    formData.append("category", productData.category || "");
    if (productData.image) formData.append("image", productData.image); // send File object
    formData.append("featured", productData.featured ? "true" : "false");


    const response = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // required for backend auth
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Create product failed:", errText);
      throw new Error("Failed to create product");
    }

    const product = await response.json();
    return { data: { success: true, product } };
  },

  // Update product
  async updateProduct(id, productData) {
    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    if (productData.name) formData.append("name", productData.name);
    if (productData.description) formData.append("description", productData.description);
    if (productData.price) formData.append("price", productData.price);
    if (productData.category) formData.append("category", productData.category);
    if (productData.image) formData.append("image", productData.image); // send File object if updated
     // ✅ Add featured field
    formData.append("featured", productData.featured ? "true" : "false");

    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Update product ${id} failed:`, errText);
      throw new Error("Failed to update product");
    }

    const product = await response.json();
    return { data: { success: true, product } };
  },

  // Delete product
  async deleteProduct(id) {
    const token = localStorage.getItem("admin_token");
    const response = await fetch(`${API_BASE}/api/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Delete product ${id} failed:`, errText);
      throw new Error("Failed to delete product");
    }

    return { data: { success: true } };
  },

  // Get categories
  async getCategories() {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) {
      const errText = await response.text();
      console.error("Failed to fetch categories:", errText);
      throw new Error("Failed to fetch categories");
    }

    const products = await response.json();
    const categories = [...new Set(products.map(p => p.category))];
    return { data: { success: true, categories } };
  },
  
};
