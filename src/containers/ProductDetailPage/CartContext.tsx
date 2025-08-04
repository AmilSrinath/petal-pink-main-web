import React, { createContext, useContext, useState, useEffect, FC, ReactNode } from "react";
import { Product } from "data/data"; // Assuming your Product interface is already defined in data

// Define CartItem interface to include quantity
export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: Product, quantity?: number) => void;
    updateQuantity: (itemId: number, quantity: number) => void;
    removeFromCart: (itemId: number) => void;
    clearCart: () => void;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the CartContext
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

// CartProvider component
export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product, quantity: number = 1) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(item => item.product.product_id === product.product_id);

            if (existingItemIndex >= 0) {
                // Update the quantity if the item is already in the cart
                const updatedCart = [...prevCart];
                updatedCart[existingItemIndex].quantity += quantity;
                return updatedCart;
            }

            // If the item is not in the cart, add it
            return [...prevCart, { product, quantity }];
        });
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.product.product_id === itemId ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (itemId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.product.product_id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    // Log cart whenever it changes
    useEffect(() => {
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
