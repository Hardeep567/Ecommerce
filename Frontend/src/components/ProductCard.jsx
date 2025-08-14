import React, { useState, useMemo } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const variants = product.variants || [];

  const selectedVariant = variants[selectedVariantIndex] || {
    color: 'gray',
    image_url: '/placeholder.jpg',
    price: 0,
  };

  const handleAddToCart = () => {
    const productWithVariant = {
      ...product,
      selectedColor: selectedVariant.color,
      image_url: selectedVariant.image_url,
      price: selectedVariant.price,
      quantity: 1,
    };
    addToCart(productWithVariant);
  };

  return (
    <div className="border relative border-gray-100 rounded-2xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all p-2 h-max">
      <img
        src={`http://localhost:3000/nickelfox${selectedVariant.image_url}`}
        alt={product.name}
        className="bg-gray-100 aspect-square object-cover rounded-md"
        onClick={() => navigate(`/products/${product.id}`)}
      />

      <h1 className="line-clamp-2 p-1 font-semibold">{product.name}</h1>
      <p className="my-1 text-lg text-gray-800 font-bold">Rs. {selectedVariant.price}</p>

      {/* Color Buttons */}
      <div className="flex gap-2 my-2">
        {variants.map((variant, index) => (
          <button
            key={index}
            className={`w-6 h-6 rounded-full border-2 ${
              selectedVariantIndex === index ? 'ring-2 ring-black' : ''
            }`}
            style={{ backgroundColor: variant.color?.toLowerCase() || 'gray' }}
            onClick={() => setSelectedVariantIndex(index)}
          ></button>
        ))}
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-red-500 px-3 py-2 text-lg rounded-md text-white w-full cursor-pointer flex gap-2 items-center justify-center font-semibold"
      >
        <IoCartOutline className="w-6 h-6" /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
