# Max Gainz Nutrition - E-commerce Frontend

A modern, responsive e-commerce frontend for a protein supplements brand built with React, TypeScript, and Tailwind CSS.

## Features

### Public Features
- **Homepage**: Hero banner, brand introduction, featured products
- **Product Catalog**: Grid layout with category filtering and search
- **Product Details**: Detailed view with WhatsApp ordering integration
- **Responsive Design**: Mobile-first approach with smooth animations

### Admin Features
- **Authentication**: Secure login with protected routes
- **Product Management**: Full CRUD operations for products
- **Dashboard**: Statistics overview and product management
- **File Upload**: Image upload with preview functionality
- **Search & Filter**: Advanced product search and filtering

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Fonts**: Oswald (headings) + Roboto (body)

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Configuration

#### API Configuration
To change the API base URL, edit `src/config.js`:

```javascript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api', // Change this to your API URL
};
```

#### WhatsApp Integration
To configure WhatsApp ordering, update the phone number in `src/config.js`:

```javascript
export const APP_CONFIG = {
  WHATSAPP_NUMBER: '1234567890', // Replace with your WhatsApp business number
};
```

#### Admin Credentials
Default admin credentials (change in production):
- Username: `admin`
- Password: `protein123`

### Mock Data

The application currently uses mock data for demonstration. The mock API service (`src/api/productService.js`) simulates all backend operations including:
- Product CRUD operations
- File upload handling
- Authentication
- Category management

### Project Structure

```
src/
├── api/              # API services and HTTP client
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── config.js        # Configuration file
└── App.tsx          # Main application component
```

### Key Components

- **Header**: Navigation with mobile menu
- **ProductCard**: Product display component
- **CategoryFilter**: Product filtering interface
- **ProductForm**: Add/Edit product form with validation
- **Toast**: Notification system
- **ProtectedRoute**: Route protection for admin areas

### API Integration

The app is ready for backend integration. Replace the mock service in `src/api/productService.js` with real API calls when your backend is ready.

Expected API endpoints:
- `GET /products` - List all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product (multipart/form-data)
- `PUT /products/:id` - Update product (multipart/form-data)
- `DELETE /products/:id` - Delete product

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Design System

### Colors
- **Primary**: #0D2A5C (Dark Blue)
- **Secondary**: #1E3A8A (Blue)
- **Accent**: #10B981 (Green)
- **Neutrals**: Gray scale from 50-900

### Typography
- **Headings**: Oswald font family
- **Body**: Roboto font family

### Spacing
- Consistent 8px spacing system
- Responsive breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)

## License

This project is for demonstration purposes. All rights reserved.