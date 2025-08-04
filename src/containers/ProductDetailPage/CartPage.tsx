import React from "react";
import { useCart } from "./CartContext";
import { Product } from "../../data/data";
import NcInputNumber from "components/NcInputNumber";
import Prices from "components/Prices";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import {useNavigate} from "react-router-dom";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart(); // Access the cart, updateQuantity, and removeFromCart from the context
  const navigate = useNavigate();

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity); // Update the quantity in the cart context
  };

  const renderProduct = (item: { product: Product; quantity: number }, index: number) => {
    const { image_url, product_price, product_name, product_id } = item.product;
    const { quantity } = item;

    return (
        <div key={index} className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0">
          <div className="relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <img src={image_url} alt={product_name} className="h-full w-full object-contain object-center"/>
            {/*<Link to="/product-detail" className="absolute inset-0"></Link>*/}
          </div>

          <div className="ml-3 sm:ml-6 flex flex-1 flex-col relative">
            {/* Close Icon Positioned at Top-Right Corner */}
            <button
                onClick={() => removeFromCart(item.product.product_id)}
                className="absolute top-0 right-0 z-10 text-primary-600 hover:text-primary-500"
            >
              {/* Close Icon (SVG Example) */}
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
              >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div>
              <div className="flex justify-between mt-8">
                <div className="flex-[1.5]">
                  <h3 className="text-base font-semibold">{product_name}</h3>
                  <div className="mt-1.5 sm:mt-2.5 flex text-xl text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <h2>LKR {product_price}</h2>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-between w-full sm:hidden relative">
                    <Prices price={product_price * quantity}/>
                  </div>
                </div>

                <div className="sm:block text-center relative">
                  <NcInputNumber
                      defaultValue={quantity} // The current quantity of the product
                      onChange={(newQuantity) => handleQuantityChange(product_id, newQuantity)}
                  />
                </div>

                <div className="hidden flex-1 sm:flex justify-end">
                  <Prices price={product_price * quantity} className="mt-0.5"/> {/* Update price based on quantity */}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.product_price * item.quantity, 0);
  };

  const isCartEmpty = cart.length === 0;

  const handleCheckout = () => {
    navigate('/checkout');
  }

  return (
      <div className="nc-CartPage">
        <main className="container py-16 lg:pb-28 lg:pt-20 ">
          <div className="mb-12 sm:mb-16">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
              Shopping Cart
            </h2>
          </div>

          <hr className="border-slate-200 dark:border-slate-700 my-10 xl:my-12"/>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
              {cart.length > 0 ? (
                  cart.map(renderProduct) // Render products from the cart array
              ) : (
                  <div className="text-center text-slate-500">
                    Your cart is empty.
                  </div>
              )}
            </div>
            <div
                className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="sticky top-28">
                <h3 className="text-lg font-semibold ">Order Summary</h3>
                <div
                    className="mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80">
                  <div className="flex justify-between pb-4">
                  <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                    {calculateSubtotal()}.00 {/* Calculate subtotal */}
                  </span>
                  </div>
                  <div className="flex justify-between py-4">
                    <span>Shipping estimate</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">
                    Shipping calculated at checkout
                  </span>
                  </div>
                </div>
                <ButtonPrimary
                    onClick={handleCheckout}
                    className="mt-8 w-full"
                    disabled={isCartEmpty} // Disable the button if the cart is empty
                >
                  {isCartEmpty ? "Cart is Empty" : "Checkout"} {/* Change button text dynamically */}
                </ButtonPrimary>
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default CartPage;