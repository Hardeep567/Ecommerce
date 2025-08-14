import React, { useState , useEffect} from 'react';
import { useCart } from '../context/CartContext';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuNotebookText } from 'react-icons/lu';
import { MdDeliveryDining } from 'react-icons/md';
import { GiShoppingBag } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import emptyCart from '../assets/empty-cart.png';
import axios from 'axios';

const Cart = ({ location = '', getLocation }) => {
  const { cartItem, updateQuantity, deleteItem } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    address: location?.city || location?.town || location?.village|| '',
    state: location?.state || '',
    postcode: location?.postcode || '',
    country: location?.country || '',
    phone: '',
    promo: ''
  });

  useEffect(() =>{
    const checkToken = async () => {
      const token = localStorage.getItem('token');

      console.log(token);
      try {
  const res = await axios.get('http://localhost:3001/api/cart', {
    withCredentials: true,
  });
  console.log(res.data);

  if (!res.data) {
    window.location.href = 'http://localhost:3000/nickelfox/authentication/login';
  }
} catch (err) {
  console.log('Cart API Error:', err.message);
  window.location.href = 'http://localhost:3000/nickelfox/authentication/login';
}
    }
    checkToken();
  },[])

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const totalPrice = cartItem.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="mt-10 max-w-6xl mx-auto mb-5 px-4 md:px-0">
      {cartItem.length > 0 ? (
        <>
          <h1 className="font-bold text-2xl">My Cart ({cartItem.length})</h1>

          {/* Cart Items */}
          <div className="mt-10 space-y-3">
            {cartItem.map((item, index) => (
              <div
                key={`${item.id}-${item.selectedColor}-${index}`}
                className="bg-gray-100 p-5 rounded-md flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:3000/nickelfox${item.image_url}`}
                    alt={item.name}
                    className="w-20 h-20 rounded-md"
                  />
                  <div>
                    <h1 className="md:w-[300px] line-clamp-2">{item.name}</h1>
                    <p className="text-red-500 font-semibold text-lg">${item.price}</p>
                  </div>
                </div>

                <div className="bg-red-500 text-white flex gap-4 p-2 rounded-md font-bold text-xl">
                  <button onClick={() => updateQuantity(item.id, item.selectedColor, 'decrease')}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.selectedColor, 'increase')}>+</button>
                </div>

                <span
                  onClick={() => deleteItem(item.id, item.selectedColor)}
                  className="cursor-pointer p-3 hover:bg-white/60 rounded-full hover:shadow-2xl"
                >
                  <FaRegTrashAlt className="text-red-500 text-2xl" />
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20 mt-6">
            {/* Delivery Info */}
            <div className="bg-gray-100 rounded-md p-7 space-y-4">
              <h1 className="text-gray-800 font-bold text-xl">Delivery Info</h1>
              <div className="space-y-2">
                <label>Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  type="text"
                  className="p-2 rounded-md w-full"
                />
              </div>
              <div className="space-y-2">
                <label>Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  type="text"
                  className="p-2 rounded-md w-full"
                />
              </div>
              <div className="flex gap-5">
                <div className="w-full space-y-2">
                  <label>State</label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    type="text"
                    className="p-2 rounded-md w-full"
                  />
                </div>
                <div className="w-full space-y-2">
                  <label>PostCode</label>
                  <input
                    name="postcode"
                    value={form.postcode}
                    onChange={handleChange}
                    type="text"
                    className="p-2 rounded-md w-full"
                  />
                </div>
              </div>
              <div className="flex gap-5">
                <div className="w-full space-y-2">
                  <label>Country</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    type="text"
                    className="p-2 rounded-md w-full"
                  />
                </div>
                <div className="w-full space-y-2">
                  <label>Phone No</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="text"
                    className="p-2 rounded-md w-full"
                  />
                </div>
              </div>

              <button className="bg-red-500 text-white px-3 py-1 rounded-md mt-3">
                Submit
              </button>

              <div className="text-center text-gray-700">---------OR-----------</div>

              <div className="flex justify-center">
                <button
                  onClick={getLocation}
                  className="bg-red-500 text-white px-3 py-2 rounded-md"
                >
                  Detect Location
                </button>
              </div>
            </div>

            {/* Bill Section */}
            <div className="bg-white border border-gray-100 shadow-xl rounded-md p-7 space-y-4 h-max">
              <h1 className="text-gray-800 font-bold text-xl">Bill Details</h1>
              <div className="flex justify-between">
                <h1 className="flex gap-1 items-center text-gray-700">
                  <LuNotebookText /> Items total
                </h1>
                <p>${totalPrice}</p>
              </div>
              <div className="flex justify-between">
                <h1 className="flex gap-1 items-center text-gray-700">
                  <MdDeliveryDining /> Delivery Charge
                </h1>
                <p className="text-red-500 font-semibold">
                  <span className="line-through text-gray-600">$25</span> FREE
                </p>
              </div>
              <div className="flex justify-between">
                <h1 className="flex gap-1 items-center text-gray-700">
                  <GiShoppingBag /> Handling Charge
                </h1>
                <p className="text-red-500 font-semibold">$5</p>
              </div>
              <hr className="text-gray-200" />
              <div className="flex justify-between font-semibold text-lg">
                <h1>Grand Total</h1>
                <p>${totalPrice + 5}</p>
              </div>

              <div>
                <h1 className="font-semibold text-gray-700 mb-2">Apply Promo Code</h1>
                <div className="flex gap-3">
                  <input
                    name="promo"
                    value={form.promo}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter code"
                    className="p-2 rounded-md w-full"
                  />
                  <button className="bg-white text-black border border-gray-200 px-4 py-1 rounded-md">
                    Apply
                  </button>
                </div>
              </div>

              <button className="bg-red-500 text-white px-3 py-2 rounded-md w-full mt-3"
              onClick={() =>{
                navigate('/payment', {
                          state: { cartItem, totalPrice }
                        });
              }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center h-[600px]">
          <h1 className="text-red-500/80 font-bold text-5xl text-muted">
            Oh no! Your cart is empty
          </h1>
          <img src={emptyCart} alt="Empty Cart" className="w-[400px]" />
          <button
            onClick={() => navigate('/products')}
            className="bg-red-500 text-white px-3 py-2 rounded-md"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
