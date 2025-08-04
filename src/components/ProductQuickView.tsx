import React, { FC } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { StarIcon } from "@heroicons/react/24/solid";
import BagIcon from "components/BagIcon";
import NcInputNumber from "components/NcInputNumber";
import {Product} from "data/data";
import { useCart } from "../containers/ProductDetailPage/CartContext"; // Import useCart to access cart context
import {
    NoSymbolIcon,
    ClockIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import IconDiscount from "components/IconDiscount";
import Prices from "components/Prices";
import toast from "react-hot-toast";
import detail1JPG from "images/products/detail1.jpg";
import detail2JPG from "images/products/detail2.jpg";
import detail3JPG from "images/products/detail3.jpg";
import AccordionInfo from "containers/ProductDetailPage/AccordionInfo";
import { Link } from "react-router-dom";
import {Transition} from "@headlessui/react";

export interface ProductQuickViewProps {
    className?: string;
    productData: Product
}

const ProductQuickView: FC<ProductQuickViewProps> = ({ className = "", productData }) => {
    const { product_name, product_price, sizes, variants, status, description, image_url, image_url_2, image_url_3, keyPoints } = productData;
    const keyPointsArray = keyPoints.split('#').filter((point: string) => point.trim().length > 0);
    const { addToCart } = useCart(); // Get addToCart from cart context
    const [sizeSelected, setSizeSelected] = React.useState(sizes ? sizes[0] : "");
    const [qualitySelected, setQualitySelected] = React.useState(1);

    // Add product to cart and show notification
    const handleAddToCart = () => {
        addToCart(productData, qualitySelected); // Add product to cart
        notifyAddTocart({ size: sizeSelected });
    };

    const notifyAddTocart = ({ size }: { size?: string }) => {
        toast.custom(
            (t) => (
                <Transition
                    appear
                    show={t.visible}
                    className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
                    enter="transition-all duration-150"
                    enterFrom="opacity-0 translate-x-20"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition-all duration-150"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-20"
                >
                    <p className="block text-base font-semibold leading-none">Added to cart!</p>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
                    {renderProductCartOnNotify({ size })}
                </Transition>
            ),
            { position: "top-right", id: "nc-product-notify", duration: 3000 }
        );
    };

    const renderProductCartOnNotify = ({ size }: { size?: string }) => {
        return (
            <div className="flex ">
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                        src={image_url}
                        alt={product_name}
                        className="h-full w-full object-cover object-center"
                    />
                </div>
                <div className="ml-4 flex flex-1 flex-col">
                    <div>
                        <div className="flex justify-between ">
                            <Prices price={product_price} className="mt-0.5" />
                        </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500 dark:text-slate-400">Qty {qualitySelected}</p>
                        <div className="flex">
                            <Link to={"/cart"} className="font-medium text-primary-6000 dark:text-primary-500">
                                View cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    // const renderVariants = () => {
    //   if (!variants || !variants.length) {
    //     return null;
    //   }
    //
    //   return (
    //     <div>
    //       <label htmlFor="">
    //         <span className="text-sm font-medium">
    //           Color:
    //           <span className="ml-1 font-semibold">
    //             {variants[variantActive].name}
    //           </span>
    //         </span>
    //       </label>
    //       <div className="flex mt-2.5">
    //         {variants.map((variant, index) => (
    //           <div
    //             key={index}
    //             onClick={() => setVariantActive(index)}
    //             className={`relative flex-1 max-w-[75px] h-10 rounded-full border-2 cursor-pointer ${
    //               variantActive === index
    //                 ? "border-primary-6000 dark:border-primary-500"
    //                 : "border-transparent"
    //             }`}
    //           >
    //             <div className="absolute inset-0.5 rounded-full overflow-hidden z-0">
    //               <img
    //                 src={variant.thumbnail}
    //                 alt=""
    //                 className="absolute w-full h-full object-cover"
    //               />
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   );
    // };

    // const renderSizeList = () => {
    //   if (!allOfSizes || !sizes || !sizes.length) {
    //     return null;
    //   }
    //   return (
    //     <div>
    //       <div className="flex justify-between font-medium text-sm">
    //         <label htmlFor="">
    //           <span className="">
    //             Size:
    //             <span className="ml-1 font-semibold">{sizeSelected}</span>
    //           </span>
    //         </label>
    //         <a
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           href="##"
    //           className="text-primary-6000 hover:text-primary-500"
    //         >
    //           See sizing chart
    //         </a>
    //       </div>
    //       <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-2.5">
    //         {allOfSizes.map((size, index) => {
    //           const isActive = size === sizeSelected;
    //           const sizeOutStock = !sizes.includes(size);
    //           return (
    //             <div
    //               key={index}
    //               className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center
    //               text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${
    //                 sizeOutStock
    //                   ? "text-opacity-20 dark:text-opacity-20 cursor-not-allowed"
    //                   : "cursor-pointer"
    //               } ${
    //                 isActive
    //                   ? "bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000"
    //                   : "border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
    //               }`}
    //               onClick={() => {
    //                 if (sizeOutStock) {
    //                   return;
    //                 }
    //                 setSizeSelected(size);
    //               }}
    //             >
    //               {size}
    //             </div>
    //           );
    //         })}
    //       </div>
    //     </div>
    //   );
    // };

    const renderStatus = () => {
        if (!status) {
            return null;
        }
        const CLASSES =
            "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300";
        if (status === "New in") {
            return (
                <div className={CLASSES}>
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span className="ml-1 leading-none">{status}</span>
                </div>
            );
        }
        if (status === "50% Discount") {
            return (
                <div className={CLASSES}>
                    <IconDiscount className="w-3.5 h-3.5" />
                    <span className="ml-1 leading-none">{status}</span>
                </div>
            );
        }
        if (status === "Sold Out") {
            return (
                <div className={CLASSES}>
                    <NoSymbolIcon className="w-3.5 h-3.5" />
                    <span className="ml-1 leading-none">{status}</span>
                </div>
            );
        }
        if (status === "limited edition") {
            return (
                <div className={CLASSES}>
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span className="ml-1 leading-none">{status}</span>
                </div>
            );
        }
        return null;
    };

    const renderSectionContent = () => {
        return (
            <div className="space-y-8">
                {/* ---------- 1 HEADING ----------  */}
                <div>
                    <h2 className="text-2xl font-semibold transition-colors">
                        <p>{product_name}</p>
                    </h2>

                    <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
                        {/* <div className="flex text-xl font-semibold">$112.00</div> */}
                        <Prices
                            contentClass="py-1 px-2 md:py-1.5 md:px-3 text-lg font-semibold"
                            price={product_price}
                        />

                        <div className="h-6 border-l border-slate-300 dark:border-slate-700"></div>

                        <div className="flex items-center">
                            <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                            <div className="ml-1.5 flex">
                                <span>4.9</span>
                                <span className="block mx-2">·</span>
                                <span className="text-slate-600 dark:text-slate-400">
                                    142 reviews
                                </span>
                            </div>
                            <div className="hidden sm:flex items-center text-sm">
                                <span className="ml-1 leading-none">{status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
                {/*<div className="">{renderVariants()}</div>*/}
                {/*<div className="">{renderSizeList()}</div>*/}

                {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
                <div className="flex space-x-3.5">
                    <div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">
                        <NcInputNumber
                            defaultValue={qualitySelected}
                            onChange={setQualitySelected}
                        />
                    </div>
                    <ButtonPrimary
                        className="flex-1 flex-shrink-0"
                        onClick={handleAddToCart}
                    >
                        <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5" />
                        <span className="ml-3">Add to cart</span>
                    </ButtonPrimary>
                </div>

                {/*  */}
                <hr className=" border-slate-200 dark:border-slate-700"></hr>
                {/*  */}

                {/* ---------- 5 ----------  */}
                <AccordionInfo
                    data={[
                        {
                            name: "Description",
                            content:
                                `${description}`,
                        },
                        {
                            name: "Features",
                            content: `
            <ul class="list-disc list-inside leading-7">
              ${keyPointsArray.map(point => `<li>${point.trim()}</li>`).join('')}
            </ul>`,
                        },
                    ]}
                />
            </div>
        );
    };

    return (
        <div className={`nc-ProductQuickView ${className}`}>
            {/* MAIn */}
            <div className="lg:flex">
                {/* CONTENT */}
                <div className="w-full lg:w-[50%] ">
                    {/* HEADING */}
                    <div className="relative">
                        <div className="aspect-w-16 aspect-h-16">
                            <img
                                src={image_url}
                                className="w-full rounded-xl object-cover"
                            />
                        </div>

                        {/* STATUS */}
                        {renderStatus()}
                        {/* META FAVORITES */}
                        {/*<LikeButton className="absolute right-3 top-3 " />*/}
                    </div>
                    <div className="hidden lg:grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-5 xl:mt-5">
                        {[image_url_2, image_url_3].map((item, index) => {
                            return (
                                <div key={index} className="aspect-w-3 aspect-h-4">
                                    <img
                                        src={item}
                                        className="w-full rounded-xl object-cover"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="w-full lg:w-[50%] pt-6 lg:pt-0 lg:pl-7 xl:pl-8">
                    {renderSectionContent()}
                </div>
            </div>
        </div>
    );
};

export default ProductQuickView;