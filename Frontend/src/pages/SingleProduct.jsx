import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../assets/Loading4.webm';
import Breadcrums from '../components/Breadcrums';
import { IoCartOutline } from 'react-icons/io5';
import { useCart } from '../context/CartContext';

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const getSingleProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/products/${id}`);
      setProduct(res.data);
      console.log('Fetched product:', res.data);
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [id]);

  const selectedVariant = product?.variants?.[selectedIndex];

  const handleAddToCart = () => {
    const item = {
      ...product,
      selectedColor: selectedVariant?.color,
      image_url: selectedVariant?.image_url,
      price: selectedVariant?.price,
      quantity: Number(quantity),
    };
    addToCart(item);
  };

  if (!product) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <video muted autoPlay loop>
          <source src={Loading} type='video/webm' />
        </video>
      </div>
    );
  }

  return (
    <div className='px-4 pb-4 md:px-0'>
      <Breadcrums title={product.name} />

      <div className='max-w-6xl mx-auto md:p-6 grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Image */}
        <div className='w-full'>
          <img
            src={`http://localhost:3000/nickelfox${selectedVariant?.image_url || '/placeholder.jpg'}`}
            alt={product.name}
            className='rounded-2xl w-full object-cover'
          />
        </div>

        {/* Details */}
        <div className='flex flex-col gap-6'>
          <h1 className='md:text-3xl text-xl font-bold text-gray-800'>{product.name}</h1>

          <div className='text-gray-700'>
            {product.brand?.toUpperCase()} / {product.category?.toUpperCase()}
          </div>

          <p className='text-xl text-red-500 font-bold'>
            Rs {selectedVariant?.price || 'N/A'}
          </p>

          <p className='text-gray-600'>{product.description}</p>

          {/* Colors */}
          <div className='flex items-center gap-4'>
            <label className='text-sm font-medium text-gray-700'>Colors:</label>
            <div className='flex gap-2'>
              {product.variants?.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    selectedIndex === i ? 'ring-2 ring-black' : ''
                  }`}
                  style={{ backgroundColor: v.color?.toLowerCase() }}
                  title={v.color}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className='flex items-center gap-4'>
            <label className='text-sm font-medium text-gray-700'>Quantity:</label>
            <input
              type='number'
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className='w-20 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500'
            />
          </div>

          {/* Add to Cart */}
          <div className='flex gap-4 mt-4'>
            <button
              onClick={handleAddToCart}
              className='px-6 flex gap-2 py-2 text-lg bg-red-500 text-white rounded-md'
            >
              <IoCartOutline className='w-6 h-6' /> Add to Cart!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
