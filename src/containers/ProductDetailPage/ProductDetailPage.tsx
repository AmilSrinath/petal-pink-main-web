import React, {FC, useEffect, useState} from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import AccordionInfo from "./AccordionInfo";
import BagIcon from "components/BagIcon";
import {PRODUCTS} from "data/data";
import {NoSymbolIcon, ClockIcon, SparklesIcon, PlusIcon, MinusIcon,} from "@heroicons/react/24/outline";
import IconDiscount from "components/IconDiscount";
import Prices from "components/Prices";
import toast from "react-hot-toast";
import detail1JPG from "images/products/detail1.jpg";
import detail2JPG from "images/products/detail2.jpg";
import detail3JPG from "images/products/detail3.jpg";
import Policy from "./Policy";
import NotifyAddTocart from "components/NotifyAddTocart";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import {Disclosure, Transition} from "@headlessui/react";
import {useCart} from "./CartContext";
import {StarIcon} from "@heroicons/react/24/solid"; // Import useCart to access cart context

interface Product {
    product_id: number;
    product_name: string;
    product_price: number;
    discount: number;
    weight:number;
    amount:number;
    unit_type:string;
    image_url: string;
    image_url_2:string;
    image_url_3: string,
    description: string;
    keyPoints:string;
    category: string;
    faq: string;
    howToUse: string;
    tags: string[];
    link: string;
}

export interface ProductDetailPageProps {
    className?: string;
}

const ProductDetailPage: FC<ProductDetailPageProps> = ({className = ""}) => {
    const {sizes, variants, status, allOfSizes} = PRODUCTS[0];
    const LIST_IMAGES_DEMO = [detail1JPG, detail2JPG, detail3JPG];

    const [variantActive, setVariantActive] = React.useState(0);
    const [sizeSelected, setSizeSelected] = React.useState(sizes ? sizes[0] : "");
    const [qualitySelected, setQualitySelected] = React.useState(1);
    const [isOpenModalViewAllReviews, setIsOpenModalViewAllReviews] = useState(false);

    const {addToCart} = useCart(); // Get addToCart from cart context
    const {product_id} = useParams<{ product_id: string }>(); // Get the product id from URL params
    const [product, setProduct] = useState<Product | null>(null); // State to store the fetched product

    const serverUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Fetch product details by ID from the API
        const fetchProductById = async () => {
            try {
                const response = await axios.get(
                    `${serverUrl}/api/customerOrderSave/getProductById/${product_id}`
                );
                setProduct(response.data); // Set the product data
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };

        fetchProductById();
    }, [product_id]);

    if (!product) {
        return <div></div>; // Handle the case where product is not found
    }

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
                    <p className="block text-base font-semibold leading-none">
                        Added to cart!
                    </p>
                    <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
                    {renderProductCartOnNotify({ size })}
                </Transition>
            ),
            { position: "top-right", id: "nc-product-notify", duration: 2000 }
        );
    };

    const renderProductCartOnNotify = ({ size }: { size?: string }) => {
        return (
            <div className="flex ">
                <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img
                        src={product.image_url}
                        alt={product.product_name}
                        className="h-full w-full object-cover object-center"
                    />
                </div>

                <div className="ml-4 flex flex-1 flex-col">
                    <div>
                        <div className="flex justify-between ">
                            <Prices price={product.product_price} className="mt-0.5" />
                        </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm">
                        <p className="text-gray-500 dark:text-slate-400">Qty 1</p>

                        <div className="flex">
                            <Link
                                to={"/cart"}
                                className="font-medium text-primary-6000 dark:text-primary-500 "
                            >
                                View cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleAddToCart = () => {
        if (product) {
            // Check if the image_url already contains the base64 prefix
            const formattedProduct = {
                ...product,
                image_url: product.image_url.startsWith("data:image/jpeg;base64,") ? product.image_url : product.image_url,
            };

            addToCart(formattedProduct, 1); // Add product to cart
            notifyAddTocart({ size: "XL" });
        }
    };

    const renderVariants = () => {
        if (!variants || !variants.length) {
            return null;
        }

        return (
            <div>
                <label htmlFor="">
          <span className="text-sm font-medium">
            Color:
            <span className="ml-1 font-semibold">
              {variants[variantActive].name}
            </span>
          </span>
                </label>
                <div className="flex mt-3">
                    {variants.map((variant, index) => (
                        <div
                            key={index}
                            onClick={() => setVariantActive(index)}
                            className={`relative flex-1 max-w-[75px] h-10 sm:h-11 rounded-full border-2 cursor-pointer ${
                                variantActive === index
                                    ? "border-primary-6000 dark:border-primary-500"
                                    : "border-transparent"
                            }`}
                        >
                            <div className="absolute inset-0.5 rounded-full overflow-hidden z-0">
                                <img
                                    src={variant.thumbnail}
                                    alt=""
                                    className="absolute w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSizeList = () => {
        if (!allOfSizes || !sizes || !sizes.length) {
            return null;
        }
        return (
            <div>
                <div className="flex justify-between font-medium text-sm">
                    <label htmlFor="">
            <span className="">
              Size:
              <span className="ml-1 font-semibold">{sizeSelected}</span>
            </span>
                    </label>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="##"
                        className="text-primary-6000 hover:text-primary-500"
                    >
                        See sizing chart
                    </a>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 mt-3">
                    {allOfSizes.map((size, index) => {
                        const isActive = size === sizeSelected;
                        const sizeOutStock = !sizes.includes(size);
                        return (
                            <div
                                key={index}
                                className={`relative h-10 sm:h-11 rounded-2xl border flex items-center justify-center 
                text-sm sm:text-base uppercase font-semibold select-none overflow-hidden z-0 ${
                                    sizeOutStock
                                        ? "text-opacity-20 dark:text-opacity-20 cursor-not-allowed"
                                        : "cursor-pointer"
                                } ${
                                    isActive
                                        ? "bg-primary-6000 border-primary-6000 text-white hover:bg-primary-6000"
                                        : "border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                                }`}
                                onClick={() => {
                                    if (sizeOutStock) {
                                        return;
                                    }
                                    setSizeSelected(size);
                                }}
                            >
                                {size}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderStatus = () => {
        if (!status) {
            return null;
        }
        const CLASSES =
            "absolute top-3 left-3 px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 nc-shadow-lg rounded-full flex items-center justify-center text-slate-700 text-slate-900 dark:text-slate-300";
        if (status === "New in") {
            return (
                <div className={CLASSES}>
                    <SparklesIcon className="w-3.5 h-3.5"/>
                    <span className="ml-1 leading-none">{status}</span>
                </div>
            );
        }
        if (status === "50% Discount") {
            return (
                <div className={CLASSES}>
                    <IconDiscount className="w-3.5 h-3.5"/>
                    <span className="ml-1 leading-none">{status}</span>
                </div>
            );
        }
        if (status === "Sold Out") {
            return (
                <div className={CLASSES}>
                    <NoSymbolIcon className="w-3.5 h-3.5"/>
                    <span className="ml-1 leading-none">{status}</span>
                </div>
            );
        }
        if (status === "limited edition") {
            return (
                <div className={CLASSES}>
                    <ClockIcon className="w-3.5 h-3.5"/>
                    <span className="ml-1 leading-none">{status}</span>
                </div>
            );
        }
        return null;
    };


    const renderKeyPoints = () => {
        if (!product?.keyPoints) {
            return null;
        }

        // Split the keyPoints string by the special character or line break delimiter (e.g., '#')
        const keyPointsArray = product.keyPoints.split('#');

        return (
            <ul className="list-disc list-inside leading-7">
                {keyPointsArray.map((point, index) => (
                    <li key={index}>{point.trim()}</li> // Trim any extra spaces
                ))}
            </ul>
        );
    };

    const renderSectionContent = () => {
        return (
            <div className="space-y-7 2xl:space-y-8">
                {/* ---------- 1 HEADING ----------  */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-semibold">
                        {product.product_name}
                    </h2>

                    <div>{product.amount}{product.unit_type}</div>

                    <div className="flex items-center mt-5 space-x-4 sm:space-x-5">
                        {/* <div className="flex text-xl font-semibold">$112.00</div> */}
                            {product.discount > 0 && (
                                <Prices
                                    price={product.discount}
                                    className="mr-0"
                                    style={{color: "green", fontSize: "18px",}}
                                />
                            )}
                            <Prices
                                price={product.product_price}
                                style={{
                                    color: product.discount > 0 ? "red" : "green", // Line-through only if there is a discount
                                    fontSize: "14px",
                                    textDecoration: product.discount > 0 ? "line-through" : "none",
                                    borderColor: product.discount > 0 ? 'red' : 'green',
                                }}
                            />

                        <div className="h-7 border-l border-slate-300 dark:border-slate-700"></div>

                        <div className="flex items-center">
                          <a
                            href="#reviews"
                            className="flex items-center text-sm font-medium"
                          >
                            <StarIcon className="w-5 h-5 pb-[1px] text-yellow-400" />
                            <div className="ml-1.5 flex">
                              <span>4.9</span>
                              <span className="block mx-2">·</span>
                              <span className="text-slate-600 dark:text-slate-400 underline">
                                142 reviews
                              </span>
                            </div>
                          </a>
                          <span className="hidden sm:block mx-2.5">·</span>
                          {/*<div className="hidden sm:flex items-center text-sm">*/}
                          {/*  <SparklesIcon className="w-3.5 h-3.5" />*/}
                          {/*  <span className="ml-1 leading-none">{status}</span>*/}
                          {/*</div>*/}
                        </div>
                    </div>
                </div>

                {/* ---------- 3 VARIANTS AND SIZE LIST ----------  */}
                {/*<div className="">{renderVariants()}</div>*/}
                {/*<div className="">{renderSizeList()}</div>*/}

                {/*  ---------- 4  QTY AND ADD TO CART BUTTON */}
                <div className="flex space-x-3.5">
                    {/*<div className="flex items-center justify-center bg-slate-100/70 dark:bg-slate-800/70 px-2 py-3 sm:p-3.5 rounded-full">*/}
                    {/*  <NcInputNumber*/}
                    {/*    defaultValue={qualitySelected}*/}
                    {/*    onChange={setQualitySelected}*/}
                    {/*  />*/}
                    {/*</div>*/}
                    <ButtonPrimary
                        className="flex-1 flex-shrink-0"
                        onClick={handleAddToCart}
                    >
                        <BagIcon className="hidden sm:inline-block w-5 h-5 mb-0.5"/>
                        <span className="ml-3">Add to cart</span>
                    </ButtonPrimary>
                </div>

                {/*  */}
                <hr className=" 2xl:!my-10 border-slate-200 dark:border-slate-700"></hr>
                {/*  */}

                {/* ---------- 5 ----------  */}
                {/*<AccordionInfo />*/}

                <Disclosure defaultOpen={true}>
                    {({open}) => (
                        <>
                            <Disclosure.Button
                                className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                                <span>Description</span>
                                {!open ? (
                                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400"/>
                                ) : (
                                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400"/>
                                )}
                            </Disclosure.Button>
                            <Disclosure.Panel
                                className="p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6"
                                as="div"
                                dangerouslySetInnerHTML={{__html: product.description}}
                            ></Disclosure.Panel>
                        </>
                    )}
                </Disclosure>

                <Disclosure defaultOpen={true}>
                    {({open}) => (
                        <>
                            <Disclosure.Button
                                className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                                <span>Features</span>
                                {!open ? (
                                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400"/>
                                ) : (
                                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400"/>
                                )}
                            </Disclosure.Button>
                            <Disclosure.Panel
                                className="p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6">
                                {renderKeyPoints()}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>


                <Disclosure defaultOpen={true}>
                    {({open}) => (
                        <>
                            <Disclosure.Button
                                className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                                <span>How to Use</span>
                                {!open ? (
                                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400"/>
                                ) : (
                                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400"/>
                                )}
                            </Disclosure.Button>
                            <Disclosure.Panel
                                className="p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6"
                                as="div"
                                dangerouslySetInnerHTML={{__html: product?.howToUse}}
                            ></Disclosure.Panel>
                        </>
                    )}
                </Disclosure>


                <Disclosure defaultOpen={true}>
                    {({open}) => (
                        <>
                            <Disclosure.Button
                                className="flex items-center justify-between w-full px-4 py-2 font-medium text-left bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-slate-500 focus-visible:ring-opacity-75 ">
                                <span>FAQ</span>
                                {!open ? (
                                    <PlusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400"/>
                                ) : (
                                    <MinusIcon className="w-4 h-4 text-slate-600 dark:text-slate-400"/>
                                )}
                            </Disclosure.Button>
                            <Disclosure.Panel
                                className="p-4 pt-3 last:pb-0 text-slate-600 text-sm dark:text-slate-300 leading-6"
                                as="div"
                                dangerouslySetInnerHTML={{__html: product?.faq}}
                            ></Disclosure.Panel>
                        </>
                    )}
                </Disclosure>


                {/* ---------- 6 ----------  */}
                <div className="hidden xl:block">
                    <Policy/>
                </div>
            </div>
        );
    };

    // const renderDetailSection = () => {
    //   return (
    //     <div className="">
    //       <h2 className="text-2xl font-semibold">Product Details</h2>
    //       <div className="prose prose-sm sm:prose dark:prose-invert sm:max-w-4xl mt-7">
    //         <p>
    //           The patented eighteen-inch hardwood Arrowhead deck --- finely
    //           mortised in, makes this the strongest and most rigid canoe ever
    //           built. You cannot buy a canoe that will afford greater satisfaction.
    //         </p>
    //         <p>
    //           The St. Louis Meramec Canoe Company was founded by Alfred Wickett in
    //           1922. Wickett had previously worked for the Old Town Canoe Co from
    //           1900 to 1914. Manufacturing of the classic wooden canoes in Valley
    //           Park, Missouri ceased in 1978.
    //         </p>
    //         <ul>
    //           <li>Regular fit, mid-weight t-shirt</li>
    //           <li>Natural color, 100% premium combed organic cotton</li>
    //           <li>
    //             Quality cotton grown without the use of herbicides or pesticides -
    //             GOTS certified
    //           </li>
    //           <li>Soft touch water based printed in the USA</li>
    //         </ul>
    //       </div>
    //     </div>
    //   );
    // };

    const renderReviews = () => {
        return (
            <div className="">
                {/*/!* HEADING *!/*/}
                {/*<h2 className="text-2xl font-semibold flex items-center">*/}
                {/*  <StarIcon className="w-7 h-7 mb-0.5" />*/}
                {/*  <span className="ml-1.5"> 4,87 · 142 Reviews</span>*/}
                {/*</h2>*/}

                {/*/!* comment *!/*/}
                {/*<div className="mt-10">*/}
                {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-11 gap-x-28">*/}
                {/*    <ReviewItem />*/}
                {/*    <ReviewItem*/}
                {/*      data={{*/}
                {/*        comment: `I love the charcoal heavyweight hoodie. Still looks new after plenty of washes. */}
                {/*          If you’re unsure which hoodie to pick.`,*/}
                {/*        date: "December 22, 2021",*/}
                {/*        name: "Stiven Hokinhs",*/}
                {/*        starPoint: 5,*/}
                {/*      }}*/}
                {/*    />*/}
                {/*    <ReviewItem*/}
                {/*      data={{*/}
                {/*        comment: `The quality and sizing mentioned were accurate and really happy with the purchase. Such a cozy and comfortable hoodie. */}
                {/*        Now that it’s colder, my husband wears his all the time. I wear hoodies all the time. `,*/}
                {/*        date: "August 15, 2022",*/}
                {/*        name: "Gropishta keo",*/}
                {/*        starPoint: 5,*/}
                {/*      }}*/}
                {/*    />*/}
                {/*    <ReviewItem*/}
                {/*      data={{*/}
                {/*        comment: `Before buying this, I didn't really know how I would tell a "high quality" sweatshirt, but after opening, I was very impressed. */}
                {/*        The material is super soft and comfortable and the sweatshirt also has a good weight to it.`,*/}
                {/*        date: "December 12, 2022",*/}
                {/*        name: "Dahon Stiven",*/}
                {/*        starPoint: 5,*/}
                {/*      }}*/}
                {/*    />*/}
                {/*  </div>*/}

                {/*  <ButtonSecondary*/}
                {/*    onClick={() => setIsOpenModalViewAllReviews(true)}*/}
                {/*    className="mt-10 border border-slate-300 dark:border-slate-700 "*/}
                {/*  >*/}
                {/*    Show me all 142 reviews*/}
                {/*  </ButtonSecondary>*/}
                {/*</div>*/}
            </div>
        );
    };

    return (
        <div className={`nc-ProductDetailPage ${className}`}>
            {/* MAIn */}
            <main className="container mt-5 lg:mt-11">
                <div className="lg:flex">
                    {/* CONTENT */}
                    <div className="w-full lg:w-[55%] ">
                        {/* HEADING */}
                        <div className="relative">
                            <div className="aspect-w-16 aspect-h-16">
                                <img
                                    src={product.image_url}
                                    className="w-full rounded-2xl object-cover"
                                />
                            </div>
                            {renderStatus()}
                            {/* META FAVORITES */}
                            {/*<LikeButton className="absolute right-3 top-3 " />*/}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-3 sm:gap-6 sm:mt-6 xl:gap-8 xl:mt-8">
                            {[product.image_url_2, product.image_url_3]
                                .filter((item) => item) // Filter out falsy values
                                .map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="aspect-w-11 xl:aspect-w-10 2xl:aspect-w-11 aspect-h-16"
                                        >
                                            <img
                                                src={item}
                                                className="w-full rounded-2xl object-cover"
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    {/* SIDEBAR */}
                    <div className="w-full lg:w-[45%] pt-10 lg:pt-0 lg:pl-7 xl:pl-9 2xl:pl-10">
                        {renderSectionContent()}
                    </div>
                </div>

                {/* DETAIL AND REVIEW */}
                <div className="mt-12 sm:mt-16 space-y-10 sm:space-y-16">
                    <div className="block xl:hidden">
                        {/*<Policy />*/}
                    </div>

                    {/*{renderDetailSection()}*/}

                    <hr className="border-slate-200 dark:border-slate-700"/>

                    {renderReviews()}

                    <hr className="border-slate-200 dark:border-slate-700"/>

                    {/*/!* OTHER SECTION *!/*/}
                    {/*<SectionSliderProductCard*/}
                    {/*  heading="Customers also purchased"*/}
                    {/*  subHeading=""*/}
                    {/*  headingFontClassName="text-2xl font-semibold"*/}
                    {/*  headingClassName="mb-10 text-neutral-900 dark:text-neutral-50"*/}
                    {/*/>*/}

                    {/*/!* SECTION *!/*/}
                    {/*<div className="pb-20 xl:pb-28 lg:pt-14">*/}
                    {/*  <SectionPromo2 />*/}
                    {/*</div>*/}
                </div>
            </main>

            {/* MODAL VIEW ALL REVIEW */}
            {/*<ModalViewAllReviews*/}
            {/*  show={isOpenModalViewAllReviews}*/}
            {/*  onCloseModalViewAllReviews={() => setIsOpenModalViewAllReviews(false)}*/}
            {/*/>*/}
        </div>
    );
};

export default ProductDetailPage;