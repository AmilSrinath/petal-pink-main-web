"use client"

import { type FC, useEffect, useState } from "react"
import Next from "shared/NextPrev/Next"
import Prev from "shared/NextPrev/Prev"
import useInterval from "react-use/lib/useInterval"
import useBoolean from "react-use/lib/useBoolean"
import axios from "axios"

interface Hero2DataType {
  id: number
  image_url: string
  title: string
  subtitle: string
  btn_link: string
}

export interface SectionHero2Props {
  className?: string
}

let TIME_OUT: NodeJS.Timeout | null = null

const SectionHero2: FC<SectionHero2Props> = ({ className = "" }) => {
  const [banners, setBanners] = useState<Hero2DataType[]>([])
  const [indexActive, setIndexActive] = useState(0)
  const [isRunning, toggleIsRunning] = useBoolean(true)

  const serverUrl = process.env.REACT_APP_API_URL

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/configuration/getAllBanners`)
        setBanners(response.data.banners)
      } catch (error) {
        console.error("Error fetching banners:", error)
      }
    }
    fetchBanners()
  }, [])

  useInterval(
    () => {
      handleAutoNext()
    },
    isRunning ? 5500 : null,
  )

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= banners.length - 1) {
        return 0
      }
      return state + 1
    })
  }

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= banners.length - 1) {
        return 0
      }
      return state + 1
    })
    handleAfterClick()
  }

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return banners.length - 1
      }
      return state - 1
    })
    handleAfterClick()
  }

  const handleAfterClick = () => {
    toggleIsRunning(false)
    if (TIME_OUT) {
      clearTimeout(TIME_OUT)
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true)
    }, 1000)
  }

  const renderItem = (index: number) => {
    const isActive = indexActive === index
    const item = banners[index]
    if (!isActive) {
      return null
    }
    return (
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation flex flex-col-reverse lg:flex-col relative overflow-hidden ${className}`}
        key={index}
      >
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-cyan-600/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Glassmorphism Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex justify-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
          {banners.map((_, index) => {
            const isActive = indexActive === index
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index)
                  handleAfterClick()
                }}
                className={`relative cursor-pointer transition-all duration-300 ${isActive ? "w-8 h-3" : "w-3 h-3"}`}
              >
                <div
                  className={`w-full h-full rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-pink-400 to-purple-500 shadow-lg shadow-pink-500/50"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                ></div>
              </div>
            )
          })}
        </div>

        {/* Modern Navigation Buttons */}
        <Prev
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20"
          btnClassName="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
          svgSize="w-6 h-6"
          onClickPrev={handleClickPrev}
        />
        <Next
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20"
          btnClassName="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
          svgSize="w-6 h-6"
          onClickNext={handleClickNext}
        />

        <div className="relative container pb-8 pt-20 sm:pt-24 lg:py-32 xl:py-40">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Content Section */}
            <div className="relative z-10 space-y-8 sm:space-y-10">
              {/* Modern Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-pink-300/30 rounded-full px-4 py-2 text-sm font-medium text-white">
                <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-pulse"></div>
                New Collection
              </div>

              {/* Modern Typography */}
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-pink-100 to-purple-100 bg-clip-text text-transparent">
                    {item.title}
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-2xl">
                  {item.subtitle}
                </p>
              </div>

              {/* Modern CTA Section */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => (window.location.href = '/beauty')}
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl hover:from-pink-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25 focus:outline-none focus:ring-4 focus:ring-pink-500/50"
                >
                  <span className="relative z-10">Explore Collection</span>
                  <svg
                    className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Stats Section */}
              <div className="flex items-center gap-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100K+</div>
                  <div className="text-sm text-white/70">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10+</div>
                  <div className="text-sm text-white/70">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.9</div>
                  <div className="text-sm text-white/70">Rating</div>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative lg:order-last">
              {/* Decorative Elements */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400/30 to-purple-600/30 rounded-3xl blur-2xl"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20"></div>

              {/* Main Image Container */}
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <img
                  className="w-full h-auto object-contain rounded-xl transition-transform duration-700 hover:scale-105"
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                />

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce delay-300"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce delay-700"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-8 top-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"></div>
                  <span className="text-white text-sm font-medium">Free Shipping</span>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl animate-float delay-1000">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></div>
                  <span className="text-white text-sm font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{banners.map((_, index) => renderItem(index))}</>
}

export default SectionHero2
