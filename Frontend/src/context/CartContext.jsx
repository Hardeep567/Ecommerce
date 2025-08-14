import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItem, setCartItem] = useState([]);

    const addToCart = (product) => {
        const { id, selectedColor } = product;

        const itemInCart = cartItem.find(
            (item) => item.id === id && item.selectedColor === selectedColor
        );

        if (itemInCart) {
            // If same product with same color exists, increase quantity
            const updatedCart = cartItem.map((item) =>
                item.id === id && item.selectedColor === selectedColor
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCartItem(updatedCart);
            toast.success("Product quantity increased!");
        } else {
            // Add as a new item with quantity 1
            setCartItem([...cartItem, { ...product, quantity: 1 }]);
            toast.success("Product is added to cart!");
        }
    };

    const updateQuantity = (productId, selectedColor, action) => {
        setCartItem((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === productId && item.selectedColor === selectedColor) {
                        let newUnit = item.quantity;
                        if (action === "increase") {
                            newUnit += 1;
                            toast.success("Quantity is increased!");
                        } else if (action === "decrease") {
                            newUnit -= 1;
                            toast.success("Quantity is decreased!");
                        }
                        return newUnit > 0 ? { ...item, quantity: newUnit } : null;
                    }
                    return item;
                })
                .filter((item) => item != null)
        );
    };

    const deleteItem = (productId, selectedColor) => {
        setCartItem((prev) =>
            prev.filter(
                (item) => !(item.id === productId && item.selectedColor === selectedColor)
            )
        );
        toast.success("Product is deleted from cart!");
    };

    return (
        <CartContext.Provider
            value={{ cartItem, setCartItem, addToCart, updateQuantity, deleteItem }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
