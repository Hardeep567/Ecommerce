import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterSection from '../components/FilterSection';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import MobileFilter from '../components/MobileFilter';
import Loading from "../assets/Loading4.webm";
import Lottie from 'lottie-react';
import notfound from "../assets/notfound.json";

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [page, setPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/product');
        const productsData = Array.isArray(res.data)
          ? res.data
          : res.data?.products || res.data?.data || [];
        setProducts(productsData);
        console.log('Here')
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Event handlers
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
    setOpenFilter(false);
  };

  const handleBrandChange = (e) => {
    setBrand(e.target.value);
    setPage(1);
    setOpenFilter(false);
  };

  const pageHandler = (selectedPage) => {
    setPage(selectedPage);
    window.scrollTo(0, 0);
  };

  // Filter logic
  const filteredData = products.filter((item) => {
    const matchesSearch = !search || item.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category?.toLowerCase() === category.toLowerCase();
    const matchesBrand = brand === "All" || item.brand === brand;

    const itemPrice = parseFloat(item?.variants?.[0]?.price ?? 0); // support variant pricing
    const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const dynamicPage = Math.ceil(filteredData.length / 8);
  const allCategories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  const allBrands = ["All", ...new Set(products.map(p => p.brand).filter(Boolean))];

  // Loading
  if (loading) {
    return (
      <div className='flex items-center justify-center h-[400px]'>
        <video muted autoPlay loop>
          <source src={Loading} type='video/webm' />
        </video>
      </div>
    );
  }

  // Error
  if (error) {
    return <div className="text-red-500 text-center p-10">{error}</div>;
  }

  // Main JSX
  return (
    <div>
      <div className='max-w-6xl mx-auto px-4 mb-10'>
        <MobileFilter
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
          search={search}
          setSearch={setSearch}
          brand={brand}
          setBrand={setBrand}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          category={category}
          setCategory={setCategory}
          handleCategoryChange={handleCategoryChange}
          handleBrandChange={handleBrandChange}
          allCategories={allCategories}
          allBrands={allBrands}
        />

        <div className='flex gap-8'>
          <FilterSection
            search={search}
            setSearch={setSearch}
            brand={brand}
            setBrand={setBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            category={category}
            setCategory={setCategory}
            handleCategoryChange={handleCategoryChange}
            handleBrandChange={handleBrandChange}
            allCategories={allCategories}
            allBrands={allBrands}
          />

          {filteredData.length > 0 ? (
            <div className='flex flex-col justify-center items-center w-full'>
              <p className="text-green-600 mb-4">Found {filteredData.length} products</p>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-7 mt-10'>
                {filteredData
                  .slice((page - 1) * 8, page * 8)
                  .map((product, index) => (
                    <ProductCard key={product.id || index} product={product} />
                  ))}
              </div>
              {dynamicPage > 1 && (
                <Pagination
                  pageHandler={pageHandler}
                  page={page}
                  dynamicPage={dynamicPage}
                />
              )}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center md:h-[600px] md:w-[900px] mt-10'>
              <p className="text-red-600 mb-4">No products found.</p>
              {products.length === 0 ? (
                <p>No products available from API</p>
              ) : (
                <div className="text-center">
                  <Lottie animationData={notfound} className='w-[500px]' />
                  <p>All products filtered out</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
