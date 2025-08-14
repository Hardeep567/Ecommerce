import React, { useState, useRef, useEffect } from 'react';
import { getData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Category = () => {
  const navigate = useNavigate();
  const { data } = getData();
  const [selected, setSelected] = useState(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const containerRef = useRef(null);
  const buttonRefs = useRef({});

  // Get unique categories
  const getUniqueCategory = (data, property) => {
    const newVal = data?.map((curElem) => curElem[property]);
    return [...new Set(newVal)];
  };

  const categories = getUniqueCategory(data, 'category');

  // Update underline position on category change
  useEffect(() => {
    if (selected && buttonRefs.current[selected]) {
      const button = buttonRefs.current[selected];
      const container = containerRef.current;

      if (button && container) {
        const buttonRect = button.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const left = buttonRect.left - containerRect.left;
        const width = buttonRect.width;
        setUnderlineStyle({ left, width });
      }
    }
  }, [selected]);

  const handleClick = (category) => {
    setSelected(category);
    navigate(`/category/${category}`);
  };

  return (
    <div className="bg-[#101829]">
      <div
        className="relative max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-center md:justify-around py-7 px-4"
        ref={containerRef}
      >
        {categories.map((cat, idx) => (
          <button
            key={idx}
            ref={(el) => (buttonRefs.current[cat] = el)}
            onClick={() => handleClick(cat)}
            className={`relative z-10 uppercase font-semibold text-white px-4 py-1 rounded-md transition-all duration-200 ${
              selected === cat ? 'text-white' : 'text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}

        {/* Animated moving underline */}
        <motion.div
          className="absolute bottom-4 h-[3px] bg-red-500 rounded"
          animate={{
            left: underlineStyle.left,
            width: underlineStyle.width,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
          }}
        />
      </div>
    </div>
  );
};

export default Category;
