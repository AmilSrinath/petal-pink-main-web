"use client"

import React, { type FC } from "react"
import { Link, useNavigate } from "react-router-dom"
import NcImage from "shared/NcImage/NcImage"
import Prices from "./Prices"
import { ArrowsPointingOutIcon, HeartIcon } from "@heroicons/react/24/outline"
import { type Product, PRODUCTS } from "data/data"
import { StarIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import BagIcon from "./BagIcon"
import toast from "react-hot-toast"
import { Transition } from "@headlessui/react"
import ModalQuickView from "./ModalQuickView"
import ProductStatus from "./ProductStatus"
import { useCart } from "../containers/ProductDetailPage/CartContext"

export interface ProductCardProps {
  className?: string
  data?: Product
  isLiked?: boolean
}

const ProductCard: FC<ProductCardProps> = ({ className = "", data = PRODUCTS[0], isLiked = false }) => {
  const { product_id, product_name, product_price, discount, sizes, variants, variantType, status, image_url } = data
  const [variantActive, setVariantActive] = React.useState(0)
  const [showModalQuickView, setShowModalQuickView] = React.useState(false)
  const [liked, setLiked] = React.useState(isLiked)
  const navigate = useNavigate()

  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(data, 1)
    notifyAddTocart({ size: "XL" })
  }

  const handleQuickView = () => {
    setShowModalQuickView(true)
  }

  const handleProductDetailClick = () => {
    navigate(`/product-detail/${product_id}`)
  }

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(!liked)
  }

  const notifyAddTocart = ({ size }: { size?: string }) => {
    toast.custom(
      (t) => (
        <Transition
          appear
          show={t.visible}
          className="p-6 max-w-md w-full bg-gradient-to-br from-white/95 via-purple-50/90 to-pink-50/90 dark:from-slate-800/95 dark:via-purple-900/30 dark:to-pink-900/30 backdrop-blur-xl shadow-2xl rounded-3xl pointer-events-auto ring-1 ring-purple-200/50 dark:ring-purple-700/50 text-slate-900 dark:text-slate-200 border border-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-700 dark:to-pink-700"
          enter="transition-all duration-500 ease-out"
          enterFrom="opacity-0 translate-x-20 scale-90 rotate-3"
          enterTo="opacity-100 translate-x-0 scale-100 rotate-0"
          leave="transition-all duration-300 ease-in"
          leaveFrom="opacity-100 translate-x-0 scale-100 rotate-0"
          leaveTo="opacity-0 translate-x-20 scale-90 rotate-3"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Added to cart!
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Item successfully added</p>
            </div>
          </div>
          <div className="border-t border-gradient-to-r from-purple-200/60 to-pink-200/60 dark:from-purple-700/60 dark:to-pink-700/60 pt-4" />
          {renderProductCartOnNotify({ size })}
        </Transition>
      ),
      { position: "top-right", id: "nc-product-notify", duration: 4000 },
    )
  }

  const renderProductCartOnNotify = ({ size }: { size?: string }) => {
    return (
      <div className="flex space-x-4">
        <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 ring-2 ring-purple-200/50 dark:ring-purple-700/50">
          <img
            src={image_url || "/placeholder.svg"}
            alt={product_name}
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 mb-1">
              {product_name}
            </h3>
            <Prices price={product_price} className="text-sm font-bold" />
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
              Qty 1
            </span>
            <Link
              to={"/cart"}
              className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              View cart →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getBorderClass = (Bgclass = "") => {
    if (Bgclass.includes("red")) return "ring-red-400 shadow-red-200/50"
    if (Bgclass.includes("violet")) return "ring-violet-400 shadow-violet-200/50"
    if (Bgclass.includes("orange")) return "ring-orange-400 shadow-orange-200/50"
    if (Bgclass.includes("green")) return "ring-green-400 shadow-green-200/50"
    if (Bgclass.includes("blue")) return "ring-blue-400 shadow-blue-200/50"
    if (Bgclass.includes("sky")) return "ring-sky-400 shadow-sky-200/50"
    if (Bgclass.includes("yellow")) return "ring-yellow-400 shadow-yellow-200/50"
    return "ring-purple-300 shadow-purple-200/50"
  }

  const renderVariants = () => {
    if (!variants || !variants.length || !variantType) {
      return null
    }

    if (variantType === "color") {
      return (
        <div className="flex space-x-2">
          {variants.map((variant, index) => (
            <button
              key={index}
              onClick={() => setVariantActive(index)}
              className={`relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 transition-all duration-300 hover:scale-110 shadow-lg ${
                variantActive === index
                  ? getBorderClass(variant.color) + " ring-opacity-100 shadow-lg"
                  : "ring-slate-200 dark:ring-slate-700 hover:ring-purple-300 dark:hover:ring-purple-600"
              }`}
              title={variant.name}
            >
              <div className={`absolute inset-0 rounded-full ${variant.color}`}></div>
              {variantActive === index && (
                <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm"></div>
              )}
            </button>
          ))}
        </div>
      )
    }

    return (
      <div className="flex space-x-2">
        {variants.map((variant, index) => (
          <button
            key={index}
            onClick={() => setVariantActive(index)}
            className={`relative w-14 h-8 rounded-xl overflow-hidden ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 transition-all duration-300 hover:scale-105 shadow-md ${
              variantActive === index
                ? "ring-purple-400 shadow-purple-200/50"
                : "ring-slate-200 dark:ring-slate-700 hover:ring-purple-300 dark:hover:ring-purple-600"
            }`}
            title={variant.name}
          >
            <img
              src={variant.thumbnail || "/placeholder.svg"}
              alt="variant"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            {variantActive === index && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm"></div>
            )}
          </button>
        ))}
      </div>
    )
  }

  const renderGroupButtons = () => {
    return (
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out rounded-b-3xl">
        <div className="flex space-x-3">
          <button
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border-0 rounded-2xl py-3 px-4 font-semibold text-sm hover:scale-105 active:scale-95"
            onClick={handleAddToCart}
          >
            <div className="flex items-center justify-center space-x-2">
              <BagIcon className="w-4 h-4" />
              <span>Add to bag</span>
            </div>
          </button>
          <button
            className="px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl transition-all duration-300 text-white hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
            onClick={handleQuickView}
            title="Quick view"
          >
            <ArrowsPointingOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  const renderSizeList = () => {
    if (!sizes || !sizes.length) {
      return null
    }

    return (
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 ease-out rounded-b-3xl">
        <div className="flex justify-center space-x-2">
          {sizes.map((size, index) => (
            <button
              key={index}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/90 to-white/70 hover:from-white hover:to-white/90 backdrop-blur-sm text-slate-900 font-bold text-sm transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-xl shadow-lg border border-white/20"
              onClick={() => notifyAddTocart({ size })}
              title={`Add size ${size} to cart`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const rating = (Math.random() * 1 + 4).toFixed(1)
  const reviewCount = Math.floor(Math.random() * 70 + 20)

  return (
    <>
      <div
        className={`nc-ProductCard group relative flex flex-col bg-gradient-to-br from-white/80 via-white/60 to-purple-50/30 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-purple-900/20 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] border border-white/20 dark:border-slate-700/30 overflow-hidden ring-1 ring-purple-100/50 dark:ring-purple-800/30 ${className}`}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

        {/* Image Container */}
        <div className="relative flex-shrink-0 bg-gradient-to-br from-slate-50/50 to-purple-100/30 dark:from-slate-800/50 dark:to-purple-900/30 rounded-t-3xl overflow-hidden aspect-[4/5] group-hover:scale-[1.03] transition-transform duration-700 ease-out">
          <div onClick={handleProductDetailClick} className="cursor-pointer h-full relative">
            <NcImage containerClassName="h-full w-full" src={image_url} className="object-cover w-full h-full" />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-white dark:hover:bg-slate-800 shadow-lg hover:shadow-xl ring-1 ring-white/20 dark:ring-slate-700/20"
          >
            {liked ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Product Status */}
          <div className="absolute top-4 left-4">
            <ProductStatus status={status} />
          </div>

          {/* Action Buttons */}
          {sizes ? renderSizeList() : renderGroupButtons()}
        </div>

        {/* Content */}
        <div className="relative p-6 space-y-4 flex-1">
          {/* Variants */}
          {renderVariants()}

          {/* Product Name */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-tight group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {product_name}
            </h2>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            {discount > 0 && (
              <Prices
                price={discount}
                className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              />
            )}
            <Prices
              price={product_price}
              className={`${
                discount > 0
                  ? "text-sm text-slate-500 dark:text-slate-400 line-through"
                  : "text-xl font-bold text-slate-900 dark:text-slate-100"
              }`}
            />
            {discount > 0 && (
              <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                {Math.round(((product_price - discount) / product_price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(Number.parseFloat(rating))
                        ? "text-amber-400"
                        : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{rating}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">({reviewCount})</span>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleAddToCart}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95"
              title="Quick add to cart"
            >
              <BagIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <ModalQuickView
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
        productData={data}
      />
    </>
  )
}

export default ProductCard
