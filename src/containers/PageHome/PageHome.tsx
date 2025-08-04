"use client"

import { useEffect, useState } from "react"
import SectionHero2 from "components/SectionHero/SectionHero2"
import SectionSliderProductCard from "components/SectionSliderProductCard"
import type { Product } from "../PageSearch"
import { fetchProducts } from "../../data/product_auto_fetch"

function PageHome() {
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchProducts()
        if (response) {
          const fetchedProducts = response.map((item: any) => ({
            product_id: item.product_id,
            product_name: item.product_name,
            description: item.description || "",
            keyPoints: item.keyPoints || "",
            product_price: item.product_price,
            image_url: item.image_url,
            image_url_2: item.image_url_2,
            image_url_3: item.image_url_3,
            category: item.category || "Unknown",
            faq: item.faq || "",
            howToUse: item.howToUse || "",
            tags: item.tags ? item.tags.split(",") : [],
            link: `/product-detail/${item.product_id}`,
            variants: item.variants ? item.variants.split(",") : [],
          }))
          // @ts-ignore
          setProducts(fetchedProducts)
        } else {
          console.error("No data received from the API.")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="nc-PageHome relative overflow-hidden bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-orange-500/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full filter blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10">
        {/* SECTION HERO */}
        <SectionHero2 />

        <div className="container relative space-y-24 my-24 lg:space-y-32 lg:my-32">
          {/* SECTION */}
          {products.length > 0 && (
            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 border border-white/20 dark:border-white/10 shadow-xl">
              <SectionSliderProductCard data={products} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageHome
