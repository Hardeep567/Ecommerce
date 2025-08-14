import React from "react";

interface Variant {
  price: number;
  color: string;
  image_url: string;
  size: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  category?: string;
  brand?: string;
  variants?: Variant[];
}

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const variant = product.variants?.[0]; // get first variant

  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition duration-300 ease-in-out text-center">
      {/* Show image if available */}
      {variant?.image_url ? (
        <img
          src={variant.image_url}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      ) : (
        <div className="w-full h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <h3 className="text-lg font-semibold">{product.name}</h3>

      {/* Show price if available */}
      {variant?.price !== undefined ? (
        <p className="text-green-600 font-bold mt-2">${variant.price}</p>
      ) : (
        <p className="text-red-500 mt-2">Price not available</p>
      )}
    </div>
  );
};

export default ProductCard;
