"use client"

import { type FC, useEffect, useState } from "react"
import Heading from "components/Heading/Heading"
import ProductCard from "./ProductCard"
import axios from "axios"

export interface SectionGridProductCardProps {
  className?: string
  itemClassName?: string
  heading?: string
  headingFontClassName?: string
  headingClassName?: string
  subHeading?: string
  data?: Product[]
  showAll?: boolean
  maxItems?: number
}

export interface Product {
  product_id: number
  product_name: string
  product_price: number
  discount: number
  weight: number
  amount: number
  unit_type: string
  image_url: string
  image_url_2: string
  image_url_3: string
  description: string
  keyPoints: string
  category: string
  faq: string
  howToUse: string
  tags: string[]
  link: string
}

const SectionGridProductCard: FC<SectionGridProductCardProps> = ({
  className = "",
  itemClassName = "",
  headingFontClassName,
  headingClassName,
  heading,
  subHeading = "Petal pink",
  showAll = false,
  maxItems = 8,
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [showAllProducts, setShowAllProducts] = useState(showAll)

  const serverUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/customerOrderSave/getAllData`)
        const productData = response.data.map((item: any) => ({
          product_id: Number(item.product_id),
          product_name: item.product_name,
          product_price: item.product_price,
          discount: item.discount,
          weight: item.weight,
          amount: item.amount,
          unit_type: item.unit_type || "",
          image_url: item.image_url,
          image_url_2: item.image_url_2,
          image_url_3: item.image_url_3,
          description: item.description,
          keyPoints: item.keyPoints,
          category: item.category || "Uncategorized",
          faq: item.faq || "",
          howToUse: item.howToUse || "",
          tags: item.tags || [],
          link: `/product-detail/${item.product_id}`,
        }))
        setProducts(productData)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

    fetchProducts()
  }, [])

  const displayedProducts = showAllProducts ? products : products.slice(0, maxItems)

  return (
    <div className={`nc-SectionGridProductCard relative ${className}`}>
      {/* Enhanced Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-purple-300/20 to-pink-300/20 dark:from-purple-600/10 dark:to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 dark:from-blue-600/10 dark:to-cyan-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-32 w-36 h-36 bg-gradient-to-r from-green-300/20 to-emerald-300/20 dark:from-green-600/10 dark:to-emerald-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-32 right-10 w-44 h-44 bg-gradient-to-r from-orange-300/20 to-red-300/20 dark:from-orange-600/10 dark:to-red-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      <div className="flow-root">
        {/* Enhanced Colorful Header */}
        <div className="relative mb-8">
          <Heading
            className={`${headingClassName} relative z-10`}
            fontClass={headingFontClassName}
            rightDescText={
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-semibold">
                {subHeading}
              </span>
            }
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {heading || `New Arrivals`}
            </span>
          </Heading>
          {/* Colorful underline */}
          <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
        </div>

        {/* Enhanced Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {displayedProducts.map((item, index) => (
            <div
              key={item.product_id}
              className={`${itemClassName} relative group transform transition-all duration-300 hover:scale-[1.02]`}
            >
              <ProductCard data={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SectionGridProductCard
