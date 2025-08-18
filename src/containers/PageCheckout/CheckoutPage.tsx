"use client";

import { useCart } from "../ProductDetailPage/CartContext";
import { useState, useEffect } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Label from "../../components/Label/Label";
import Input from "../../shared/Input/Input";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

// Define the types for the product and cart items
interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  image_url: string;
  weight: number; // Add weight property
}
interface CartItem {
  product: Product;
  quantity: number;
}

const provinceOptions = [
  { value: "central", label: "Central" },
  { value: "eastern", label: "Eastern" },
  { value: "northern", label: "Northern" },
  { value: "southern", label: "Southern" },
  { value: "western", label: "Western" },
  { value: "north_central", label: "North Central" },
  { value: "north_western", label: "North Western" },
  { value: "uva", label: "Uva" },
  { value: "sabaragamuwa", label: "Sabaragamuwa" },
];
const CheckoutPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [orderId, setOrderId] = useState(""); // State to store the order ID

  const [fistKillo, setFistKillo] = useState(350); // Initial default value
  const [secondKillo, setSecondKillo] = useState(70); // Initial default value
  const [loading, setLoading] = useState(true); // Loading state for fetching config

  // Customer details state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("Sri Lanka");
  const [paymentMethod, setPaymentMethod] = useState<
    "CreditCard" | "CashOnDelivery"
  >("CashOnDelivery");

  const serverUrl = process.env.REACT_APP_API_URL;

  // Validation state
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    email: "",
    phone1: "",
    province: "",
  });

  // Fetch configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/api/configuration/getAllConfig`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch configuration");
        }

        const data = await response.json();
        const configs = data.configs;

        // Set fistKillo and secondKillo based on the response
        const firstKiloConfig = configs.find(
          (config: any) => config.config_name === "price-of-the-first-kilo"
        );
        const addedKiloConfig = configs.find(
          (config: any) => config.config_name === "price-of-the-added-kilo"
        );

        if (firstKiloConfig) setFistKillo(Number(firstKiloConfig.config_value));
        if (addedKiloConfig)
          setSecondKillo(Number(addedKiloConfig.config_value));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching configuration:", error);
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const subtotal = cart.reduce(
    (acc: number, item: CartItem) =>
      acc + item.product.product_price * item.quantity,
    0
  );

  const totalWeight = cart.reduce((acc: number, item: CartItem) => {
    return acc + item.product.weight * item.quantity;
  }, 0);

  // Calculate shipping estimate based on total weight
  const shippingEstimate =
    totalWeight >= 1000
      ? Math.floor(totalWeight / 1000) * secondKillo + fistKillo
      : fistKillo;

  const orderTotal = subtotal + shippingEstimate;

  const handleScrollToEl = (id: string) => {
    const element = document.getElementById(id);
    setTimeout(() => {
      element?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  // Validation function
  const validateFields = () => {
    const newErrors: any = {};
    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!address1) newErrors.address1 = "Address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!phone1) {
      newErrors.phone1 = "Phone number 1 is required.";
    } else if (!/^\d{10}$/.test(phone1)) {
      newErrors.phone1 = "Phone number 1 must be 10 digits.";
    }
    if (!province) newErrors.province = "Province is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async () => {
    if (!validateFields()) {
      return; // Stop form submission if validation fails
    }

    const orderDetails = cart.map((item) => ({
      productName: item.product.product_name,
      price: item.product.product_price,
      quantity: item.quantity,
      subTotal: item.product.product_price * item.quantity,
    }));

    const payload = {
      firstName,
      lastName,
      address1,
      address2,
      city,
      email,
      phone1,
      phone2,
      province,
      country,
      cartItems: orderDetails,
      total: orderTotal,
      delivery: shippingEstimate,
      sub_total: subtotal,
      paymentMethod,
    };

    try {
      const response = await fetch(
        `${serverUrl}/api/customerOrderSave/saveOrder`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json(); // Assuming the server returns an order ID
        const generatedOrderId = data.orderId; // Extract the order ID from the response
        setOrderId(`#${generatedOrderId}`); // Format the order ID (e.g., #P000001)
        console.log("Order placed successfully");
        setIsModalOpen(true); // Open the modal
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const isCartEmpty = cart.length === 0;

  // Modal component
  const OrderSuccessModal = () => {
    return (
      <>
        {/* Dark overlay */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
              zIndex: 999, // Ensure it's below the modal but above other content
            }}
          />
        )}

        {/* Modal */}
        <div
          style={{
            display: isModalOpen ? "block" : "none", // Show modal only when isModalOpen is true
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            zIndex: 1000, // Ensure modal is above the overlay
            borderRadius: "8px",
            textAlign: "center", // Center align all content inside the modal
          }}
        >
          <h2
            style={{
              color: "#5CB338",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Order Successful!
          </h2>
          <p style={{ margin: "15px" }}>
            Your order has been placed successfully.
          </p>
          <p>
            <strong>Your Order ID:</strong> {orderId}
          </p>
          <ButtonPrimary
            className="mt-8 w-full"
            onClick={() => {
              setIsModalOpen(false); // Close the modal
              navigate("/"); // Redirect to the dashboard
              clearCart();
            }}
          >
            Close
          </ButtonPrimary>
        </div>
      </>
    );
  };

  const renderProduct = (item: CartItem, index: number) => {
    const { product, quantity } = item;
    const { image_url, product_price, product_name, weight } = product;
    const productSubtotal = product_price * quantity;

    return (
      <div key={index} className="relative flex py-7 first:pt-0 last:pb-0">
        <OrderSuccessModal />

        <div className="relative h-36 w-24 sm:w-28 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={image_url || "/placeholder.svg"}
            alt={product_name}
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between">
              <div className="flex-[1.5]">
                <h3 className="text-base font-semibold">{product_name}</h3>
                <div className="mt-1.5 sm:mt-2.5 flex text-xm text-slate-600 dark:text-slate-300">
                  LKR {product_price}
                </div>
              </div>
              {/* Remove from Cart */}
              <button
                onClick={() => removeFromCart(product.product_id)}
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
            </div>
            <div className="flex mt-auto pt-4 items-end justify-between text-sm">
              <div className="sm:flex text-center relative items-center">
                {/* Decrease Quantity Button */}
                <button
                  className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-md"
                  onClick={() =>
                    updateQuantity(
                      product.product_id,
                      Math.max(1, quantity - 1)
                    )
                  } // Ensure it doesn't go below 1
                >
                  -
                </button>
                {/* Quantity Display */}
                <span className="mx-2">{quantity}</span>
                {/* Increase Quantity Button */}
                <button
                  className="px-2 py-1 border border-slate-200 dark:border-slate-700 rounded-md"
                  onClick={() =>
                    updateQuantity(product.product_id, quantity + 1)
                  }
                >
                  +
                </button>
              </div>

              <div className="hidden flex-1 sm:flex justify-end">
                <div>LKR {productSubtotal}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLeft = () => {
    return (
      <div className="space-y-8">
        <div id="ContactInfo" className="scroll-mt-24">
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden z-0 ml">
            <div className="flex flex-col sm:flex-row items-start p-6 ">
              <svg
                className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 2 12C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="sm:ml-8">
                <h3 className=" text-slate-700 dark:text-slate-300 flex ">
                  <span className="uppercase tracking-tight">CONTACT INFO</span>
                </h3>
              </div>
            </div>
            <div className="ml-7 mb-4">
              <div className="max-w-lg">
                <Label className="text-sm">Your phone number 1</Label>
                <Input
                  className="mt-1.5"
                  placeholder={"07XXXXXXXX"}
                  type={"tel"}
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                />
                {errors.phone1 && (
                  <p className="text-red-500 text-sm">{errors.phone1}</p>
                )}
              </div>
              <div className="max-w-lg">
                <Label className="text-sm">Your phone number 2</Label>
                <Input
                  className="mt-1.5"
                  placeholder={"07XXXXXXXX"}
                  type={"tel"}
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                />
              </div>
              <div className="max-w-lg">
                <Label className="text-sm">Email address</Label>
                <Input
                  className="mt-1.5"
                  placeholder={"nimalrathnayaka@gmail.com"}
                  type={"email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div id="ShippingAddress" className="scroll-mt-24 ml">
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="p-6 flex flex-col sm:flex-row items-start ml">
              <span className="hidden sm:block">
                <svg
                  className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.1401 15.0701V13.11C12.1401 10.59 14.1801 8.54004 16.7101 8.54004H18.6701"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.62012 8.55005H7.58014C10.1001 8.55005 12.1501 10.59 12.1501 13.12V13.7701V17.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.14008 6.75L5.34009 8.55L7.14008 10.35"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.8601 6.75L18.6601 8.55L16.8601 10.35"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="sm:ml-8">
                <h3 className=" text-slate-700 dark:text-slate-300 flex ">
                  <span className="uppercase tracking-tight">
                    SHIPPING ADDRESS
                  </span>
                </h3>
              </div>
            </div>
            <div className="ml-7 mb-4 mr-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                <div>
                  <Label className="text-sm">First name</Label>
                  <Input
                    className="mt-1.5"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm">Last name</Label>
                  <Input
                    className="mt-1.5"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="sm:flex space-y-4 sm:space-y-0 sm:space-x-3">
                <div className="flex-1">
                  <Label className="text-sm">Address 1</Label>
                  <Input
                    className="mt-1.5"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                  {errors.address1 && (
                    <p className="text-red-500 text-sm">{errors.address1}</p>
                  )}
                </div>
                <div className="flex-1">
                  <Label className="text-sm">Address 2</Label>
                  <Input
                    className="mt-1.5"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-3">
                <div>
                  <Label className="text-sm">City</Label>
                  <Input
                    className="mt-1.5"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm">State/Province</label>
                  <Select
                    className="mt-1.5"
                    options={provinceOptions}
                    value={provinceOptions.find(
                      (opt) => opt.value === province
                    )}
                    onChange={(selected) => setProvince(selected?.value || "")}
                    placeholder="Select a province"
                  />
                  {errors.province && (
                    <p className="text-red-500 text-sm">{errors.province}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="ShippingAddress" className="scroll-mt-24 ml">
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="p-6 flex flex-col sm:flex-row items-start">
              <span className="hidden sm:block">
                <svg
                  className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.92969 15.8792L15.8797 3.9292"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.1013 18.2791L12.3013 17.0791"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.793 15.5887L16.183 13.1987"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 21.9985H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="sm:ml-8">
                <h3 className="text-slate-700 dark:text-slate-400 flex">
                  <span className="uppercase tracking-tight">
                    PAYMENT METHOD
                  </span>
                </h3>
              </div>
            </div>

            {/* Payment Method Options */}
            <div className="p-6 space-y-4 ">
              {/*<div*/}
              {/*    className="flex items-start space-x-4 sm:space-x-6 border border-slate-200 dark:border-slate-700 rounded-xl p-3">*/}
              {/*    <input*/}
              {/*        type="radio"*/}
              {/*        name="payment-method"*/}
              {/*        id="Credit-Card"*/}
              {/*        className="pt-3.5"*/}
              {/*        value="CreditCard"*/}
              {/*        checked={paymentMethod === "CreditCard"}*/}
              {/*        onChange={() => setPaymentMethod("CreditCard")}*/}
              {/*    />*/}
              {/*    <div className="flex-1 ">*/}
              {/*        <label*/}
              {/*            htmlFor="Credit-Card"*/}
              {/*            className="flex items-center space-x-4 sm:space-x-6"*/}
              {/*        >*/}
              {/*            <div>*/}
              {/*<span className="hidden sm:block">*/}
              {/*    <svg*/}
              {/*        className="w-6 h-6 text-slate-700 dark:text-slate-400 mt-0.5"*/}
              {/*        viewBox="0 0 24 24"*/}
              {/*        fill="none"*/}
              {/*        xmlns="http://www.w3.org/2000/svg"*/}
              {/*    >*/}
              {/*        <path*/}
              {/*            d="M3.92969 15.8792L15.8797 3.9292"*/}
              {/*            stroke="currentColor"*/}
              {/*            strokeWidth="1.5"*/}
              {/*            strokeMiterlimit="10"*/}
              {/*            strokeLinecap="round"*/}
              {/*            strokeLinejoin="round"*/}
              {/*        />*/}
              {/*        <path*/}
              {/*            d="M11.1013 18.2791L12.3013 17.0791"*/}
              {/*            stroke="currentColor"*/}
              {/*            strokeWidth="1.5"*/}
              {/*            strokeMiterlimit="10"*/}
              {/*            strokeLinecap="round"*/}
              {/*            strokeLinejoin="round"*/}
              {/*        />*/}
              {/*        <path*/}
              {/*            d="M13.793 15.5887L16.183 13.1987"*/}
              {/*            stroke="currentColor"*/}
              {/*            strokeWidth="1.5"*/}
              {/*            strokeMiterlimit="10"*/}
              {/*            strokeLinecap="round"*/}
              {/*            strokeLinejoin="round"*/}
              {/*        />*/}
              {/*        <path*/}
              {/*            d="M3.60127 10.239L10.2413 3.599C12.3613 1.479 13.4213 1.469 15.5213 3.569L20.4313 8.479C22.5313 10.579 22.5213 11.639 20.4013 13.759L13.7613 20.399C11.6413 22.519 10.5813 22.529 8.48127 20.429L3.57127 15.519C1.47127 13.419 1.47127 12.369 3.60127 10.239Z"*/}
              {/*            stroke="currentColor"*/}
              {/*            strokeWidth="1.5"*/}
              {/*            strokeLinecap="round"*/}
              {/*            strokeLinejoin="round"*/}
              {/*        />*/}
              {/*        <path*/}
              {/*            d="M2 21.9985H22"*/}
              {/*            stroke="currentColor"*/}
              {/*            strokeWidth="1.5"*/}
              {/*            strokeLinecap="round"*/}
              {/*            strokeLinejoin="round"*/}
              {/*        />*/}
              {/*    </svg>*/}
              {/*</span>*/}
              {/*            </div>*/}
              {/*            <p className="font-medium">Debit / Credit Card</p>*/}
              {/*        </label>*/}

              {/*        /!* Conditionally render Credit Card Form *!/*/}
              {/*        {paymentMethod === "CreditCard" && (*/}
              {/*            <div className="mt-4 space-y-4">*/}
              {/*                <div className="max-w-lg">*/}
              {/*                    <Label className="text-sm">Card number</Label>*/}
              {/*                    <Input className="mt-1.5" type="text"*/}
              {/*                           placeholder="1234 5678 9123 4567"/>*/}
              {/*                </div>*/}
              {/*                <div className="max-w-lg">*/}
              {/*                    <Label className="text-sm">Name on Card</Label>*/}
              {/*                    <Input className="mt-1.5" placeholder="John Doe"/>*/}
              {/*                </div>*/}
              {/*                <div*/}
              {/*                    className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">*/}
              {/*                    <div className="sm:w-2/3">*/}
              {/*                        <Label className="text-sm">Expiration date (MM/YY)</Label>*/}
              {/*                        <Input className="mt-1.5" placeholder="MM/YY"/>*/}
              {/*                    </div>*/}
              {/*                    <div className="flex-1">*/}
              {/*                        <Label className="text-sm">CVC</Label>*/}
              {/*                        <Input className="mt-1.5" placeholder="CVC"/>*/}
              {/*                    </div>*/}
              {/*                </div>*/}
              {/*            </div>*/}
              {/*        )}*/}
              {/*    </div>*/}
              {/*</div>*/}

              {/* Cash on Delivery Option */}
              <div className="flex items-start space-x-4 sm:space-x-6 border border-slate-200 dark:border-slate-700 rounded-xl p-3">
                <input
                  type="radio"
                  name="payment-method"
                  id="Cash-on-Delivery"
                  className="pt-3.5"
                  value="CashOnDelivery"
                  checked={paymentMethod === "CashOnDelivery"}
                  onChange={() => setPaymentMethod("CashOnDelivery")}
                />
                <div className="flex-1">
                  <label
                    htmlFor="Cash-on-Delivery"
                    className="flex items-center space-x-4 sm:space-x-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6"
                    >
                      <path
                        d="M3 12h4v4h2v-6h8v4h2v-4h2M7 16h2m-2-4h4v2h-4v-2zM12 8v2h2m4-2v4m-6 0h4v-2h-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="10"
                        y="4"
                        width="10"
                        height="6"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="4"
                        rx="1"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <circle cx="6.5" cy="16" r="0.75" fill="currentColor" />
                      <line
                        x1="3"
                        y1="15"
                        x2="10"
                        y2="15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <line
                        x1="3"
                        y1="17"
                        x2="10"
                        y2="17"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <p className="font-medium">Cash on Delivery</p>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="nc-CheckoutPage">
      <main className="container py-16 lg:pb-28 lg:pt-20">
        <div className="mb-16">
          <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
            Checkout
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1">{renderLeft()}</div>

          <div className="flex-shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:lg:mx-14 2xl:mx-16"></div>

          <div className="w-full lg:w-[36%]">
            <h3 className="text-lg font-semibold">Order summary</h3>
            <div className="mt-8 divide-y divide-slate-200/70 dark:divide-slate-700">
              {cart.map(renderProduct)}
            </div>

            <div className="mt-10 pt-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200/70 dark:border-slate-700">
              <div className="mt-4 flex justify-between py-2.5">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{`${subtotal.toFixed(
                  2
                )}`}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span>Shipping estimate({totalWeight}g)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">{`${shippingEstimate.toFixed(
                  2
                )}`}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                <span>Order total</span>
                <span>{`${orderTotal.toFixed(2)}`}</span>
              </div>
            </div>
            <ButtonPrimary
              onClick={handleSubmitOrder}
              className="mt-8 w-full"
              disabled={isCartEmpty} // Disable the button if the cart is empty
            >
              {isCartEmpty ? "Cart is Empty" : "Checkout"}{" "}
              {/* Change button text dynamically */}
            </ButtonPrimary>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
