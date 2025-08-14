import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import Category from './Category';

const Carousel = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/product');
        setProducts(res.data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const SamplePrevArrow = ({ className, style, onClick }) => (
    <div
      className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f53347",
        color: "white",
        borderRadius: "50%",
        left: "25px",
        zIndex: 10,
        width: "40px",
        height: "40px",
      }}
    >
      <AiOutlineArrowLeft />
    </div>
  );

  const SampleNextArrow = ({ className, style, onClick }) => (
    <div
      className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f53347",
        color: "white",
        borderRadius: "50%",
        right: "25px",
        zIndex: 10,
        width: "40px",
        height: "40px",
      }}
    >
      <AiOutlineArrowRight />
    </div>
  );

  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div>
      <Slider {...settings}>
        {products.slice(0, 4).map((item, index) => (
          <div key={index} className='bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e]'>
            <div className='flex flex-col md:flex-row gap-10 justify-center h-[600px] my-20 md:my-0 items-center px-4'>
              <div className='md:space-y-6 space-y-3'>
                <h3 className='text-red-500 font-semibold font-sans text-sm'>
                  Powering Your World with the Best in Electronics
                </h3>
                <h1 className='md:text-4xl text-xl font-bold uppercase line-clamp-2 md:line-clamp-3 md:w-[500px] text-white'>
                  {item.name}
                </h1>
                <p className='md:w-[500px] line-clamp-3 text-gray-400 pr-7'>{item.description}</p>
                <button className='bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-2 rounded-md cursor-pointer mt-2'>
                  Shop Now
                </button>
              </div>
              <div className="w-[500px] h-[500px] rounded-full overflow-hidden shadow-2xl shadow-red-400 hover:scale-105 transition-all">
                <img
                  src={`http://localhost:3000/nickelfox${item.variants?.[0]?.image_url || "/fallback.jpg"}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <Category />
    </div>
  );
};

export default Carousel;
