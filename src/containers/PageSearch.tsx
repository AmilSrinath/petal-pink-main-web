"use client"

import type React from "react"

import { type FC, useEffect, useState, useRef } from "react"
import { Helmet } from "react-helmet-async"
import Input from "shared/Input/Input"
import ButtonCircle from "shared/Button/ButtonCircle"
import ProductCard from "components/ProductCard"
import axios from "axios"
import { FaThLarge, FaTh, FaThList, FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

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

export interface PageSearchProps {
  className?: string
}

const PageSearch: FC<PageSearchProps> = ({ className = "" }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [columns, setColumns] = useState(4)
  const [isLoading, setIsLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<Product[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const serverUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${serverUrl}/api/customerOrderSave/getAllData`)
        console.log("Fetched products:", response.data)

        const productData = response.data.map((item: any) => ({
          product_id: Number(item.product_id),
          product_name: item.product_name || "",
          product_price: Number(item.product_price) || 0,
          discount: Number(item.discount) || 0,
          weight: Number(item.weight) || 0,
          amount: Number(item.amount) || 0,
          unit_type: item.unit_type || "",
          image_url: item.image_url || "",
          image_url_2: item.image_url_2 || "",
          image_url_3: item.image_url_3 || "",
          description: item.description || "",
          keyPoints: item.keyPoints || "",
          category: item.category,
          faq: item.faq || "",
          howToUse: item.howToUse || "",
          tags: Array.isArray(item.tags) ? item.tags : [],
          link: "/product-detail/",
        }))

        console.log("Processed products:", productData)
        setProducts(productData)
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [serverUrl])

  // Handle search input changes with improved filtering
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const searchTermLower = searchTerm.toLowerCase().trim()
      console.log("Searching for:", searchTermLower)

      const filtered = products.filter((product) => {
        const productNameLower = (product.product_name || "").toLowerCase()
        const descriptionLower = (product.description || "").toLowerCase()
        const categoryLower = (product.category || "").toLowerCase()

        return (
          productNameLower.includes(searchTermLower) ||
          descriptionLower.includes(searchTermLower) ||
          categoryLower.includes(searchTermLower) ||
          (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTermLower)))
        )
      })

      console.log("Filtered results:", filtered)

      const sortedFiltered = filtered.sort((a, b) => {
        const aNameLower = (a.product_name || "").toLowerCase()
        const bNameLower = (b.product_name || "").toLowerCase()

        if (aNameLower === searchTermLower && bNameLower !== searchTermLower) return -1
        if (bNameLower === searchTermLower && aNameLower !== searchTermLower) return 1

        if (aNameLower.startsWith(searchTermLower) && !bNameLower.startsWith(searchTermLower)) return -1
        if (bNameLower.startsWith(searchTermLower) && !aNameLower.startsWith(searchTermLower)) return 1

        return aNameLower.localeCompare(bNameLower)
      })

      setFilteredSuggestions(sortedFiltered.slice(0, 10))
      setShowDropdown(true)
      setSelectedIndex(-1)
    } else {
      setFilteredSuggestions([])
      setShowDropdown(false)
      setSelectedIndex(-1)
    }
  }, [searchTerm, products])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleProductSelect = (product: Product) => {
    console.log("Selected product:", product)
    setSearchTerm(product.product_name)
    setShowDropdown(false)
    setSelectedIndex(-1)
    navigate(`/product-detail/${product.product_id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredSuggestions.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleProductSelect(filteredSuggestions[selectedIndex])
        } else if (filteredSuggestions.length > 0) {
          handleProductSelect(filteredSuggestions[0])
        }
        break
      case "Escape":
        setShowDropdown(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
      handleProductSelect(filteredSuggestions[selectedIndex])
    } else if (filteredSuggestions.length > 0) {
      handleProductSelect(filteredSuggestions[0])
    }
  }

  const getGridClasses = () => {
    switch (columns) {
      case 3:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      case 4:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      case 5:
        return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      default:
        return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    }
  }

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim() || !text) return text

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 font-semibold px-1 rounded"
        >
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  const getTotalMatchingResults = () => {
    if (!searchTerm.trim()) return 0
    const searchTermLower = searchTerm.toLowerCase().trim()
    return products.filter((product) => {
      const productNameLower = (product.product_name || "").toLowerCase()
      const descriptionLower = (product.description || "").toLowerCase()
      const categoryLower = (product.category || "").toLowerCase()

      return (
        productNameLower.includes(searchTermLower) ||
        descriptionLower.includes(searchTermLower) ||
        categoryLower.includes(searchTermLower) ||
        (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTermLower)))
      )
    }).length
  }

  return (
    <div className={`nc-PageSearch min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`} data-nc-id="PageSearch">
      <Helmet>
        <title>Search Products || Ciseco Ecommerce</title>
      </Helmet>

      {/* Modern Hero Section with Gradient */}
      <div className="relative min-h-[60vh] overflow-visible">
        {/* Multi-layered Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-600/30 via-purple-600/20 to-pink-500/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-orange-300/10"></div>

        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-float"></div>
        <div
          className="absolute top-1/3 right-1/3 w-6 h-6 bg-white/15 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-white/25 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent">
                Find Your Perfect
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-100 via-orange-100 to-yellow-100 bg-clip-text text-transparent">
                Product
              </span>
            </h1>
            {/* <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-light leading-relaxed">
              Discover amazing products from our curated collection with intelligent search
            </p> */}
          </div>

          {/* Modern Search Bar with Glassmorphism */}
          <div className="max-w-4xl mx-auto relative" ref={searchRef}>
            <form className="relative" onSubmit={handleSubmit}>
              <div className="relative group">
                {/* Glassmorphism Background */}
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl group-hover:bg-white/15 transition-all duration-300"></div>

                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 rounded-3xl blur-sm group-hover:blur-none transition-all duration-300"></div>

                <div className="relative flex items-center">
                  <div className="absolute left-8 text-black/70 z-20">
                    <FaSearch size={24} />
                  </div>
                  <Input
                    ref={inputRef}
                    className="w-full pl-20 pr-24 py-8 text-xl border-0 rounded-3xl bg-transparent text-black placeholder-gray-400 focus:ring-0 focus:outline-none relative z-10"
                    id="search-input"
                    type="search"
                    placeholder="Search for amazing products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      if (searchTerm.trim() && filteredSuggestions.length > 0) {
                        setShowDropdown(true)
                      }
                    }}
                    autoComplete="off"
                  />
                  <ButtonCircle
                    className="absolute right-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 z-20 border-2 border-white/20"
                    size="w-14 h-14"
                    type="submit"
                  >
                    <i className="las la-arrow-right text-2xl"></i>
                  </ButtonCircle>
                </div>
              </div>
            </form>

            {/* Modern Search Dropdown with Glassmorphism */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-4 bg-black/5 backdrop-blur-md rounded-3xl border border-black/5 shadow-2xl max-h-96 overflow-y-auto"
                style={{ zIndex: 9999 }}
              >
                {filteredSuggestions.length > 0 ? (
                  <>
                    <div className="p-3">
                      {filteredSuggestions.map((product, index) => (
                        <div
                          key={`${product.product_id}-${index}`}
                          className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                            index === selectedIndex
                              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-l-4 border-white/50 backdrop-blur-sm"
                              : "hover:bg-white/10 backdrop-blur-sm"
                          }`}
                          onClick={() => handleProductSelect(product)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <img
                                src={product.image_url || "/placeholder.svg?height=56&width=56&query=product"}
                                alt={product.product_name}
                                className="w-14 h-14 object-cover rounded-xl border-2 border-white/20"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg?height=56&width=56"
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl"></div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-black truncate">
                              {highlightMatch(product.product_name, searchTerm)}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-base font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                Rs. {product.product_price}
                              </p>
                              {product.discount > 0 && (
                                <span className="text-xs bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full font-medium">
                                  {product.discount}% off
                                </span>
                              )}
                            </div>
                            {product.category && <p className="text-sm text-white/70 mt-1">{product.category}</p>}
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white/70"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {getTotalMatchingResults() > 10 && (
                      <div className="px-6 py-4 border-t border-white/10 bg-white/5 backdrop-blur-sm rounded-b-3xl">
                        <p className="text-sm text-white/70 text-center">
                          Showing 10 of {getTotalMatchingResults()} results
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  searchTerm.trim() && (
                    <div className="p-8 text-center">
                      <div className="w-20 h-20 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <FaSearch className="text-white/50 text-2xl" />
                      </div>
                      <p className="text-white/80 text-lg">No products found for "{searchTerm}"</p>
                      <p className="text-sm text-white/60 mt-2">Try searching with different keywords</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content with Modern Design */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              All Products
            </h2>
            <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold shadow-lg">
              {products.length} {products.length === 1 ? "product" : "products"}
            </span>
          </div>

          {/* Modern Grid Layout Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-3 hidden sm:block font-medium">View:</span>
            <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-xl border border-gray-200 dark:border-gray-700">
              {[
                { cols: 3, icon: FaThLarge },
                { cols: 4, icon: FaTh },
                { cols: 5, icon: FaThList },
              ].map(({ cols, icon: Icon }) => (
                <button
                  key={cols}
                  onClick={() => setColumns(cols)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                    columns === cols
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading with Modern Spinner */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* No Results with Modern Design */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-full flex items-center justify-center shadow-xl">
              <FaSearch className="text-purple-600 dark:text-purple-400 text-4xl" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto text-lg">
              No products available at the moment. Please check your API connection.
            </p>
          </div>
        )}

        {/* Product Grid with Enhanced Cards */}
        {!isLoading && products.length > 0 && (
          <div className={`grid ${getGridClasses()} gap-8 lg:gap-10`}>
            {products.map((item) => (
              <div
                key={item.product_id}
                className="transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
              >
                <ProductCard data={item} />
              </div>
            ))}
          </div>
        )}

        {/* Modern Load More Section */}
        {!isLoading && products.length > 0 && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                Showing <span className="text-purple-600 font-bold">{products.length}</span> products
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>
    </div>
  )
}

export default PageSearch
