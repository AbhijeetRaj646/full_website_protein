import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange, className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={() => onCategoryChange('')}
        className={`px-4 py-2 rounded-full font-body font-medium transition-colors ${
          selectedCategory === ''
            ? 'bg-primary text-white'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full font-body font-medium transition-colors ${
            selectedCategory === category
              ? 'bg-primary text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;