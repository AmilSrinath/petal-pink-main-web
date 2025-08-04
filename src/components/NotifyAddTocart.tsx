import { Transition } from "@headlessui/react"
import Prices from "components/Prices"
import { PRODUCTS } from "data/data"
import type { FC } from "react"
import { Link } from "react-router-dom"

interface Props {
  show: boolean
  productImage: string
  variantActive: number
  sizeSelected: string
  qualitySelected: number
  orderId?: string
}

const NotifyAddTocart: FC<Props> = ({ show, productImage, variantActive, qualitySelected, sizeSelected, orderId }) => {
  const { product_name, product_price, variants } = PRODUCTS[0]

  const renderProductCartOnNotify = () => {
    return (
      <div className="flex ">
        <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <img
            src={productImage || "/placeholder.svg"}
            alt={product_name}
            className="h-full w-full object-contain object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex justify-between ">
              <div>
                <h3 className="text-base font-medium ">{product_name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  <span>{variants ? variants[variantActive].name : `Natural`}</span>
                  <span className="mx-2 border-l border-slate-200 dark:border-slate-700 h-4"></span>
                  <span>{sizeSelected || "XL"}</span>
                </p>
              </div>
              <Prices price={product_price} className="mt-0.5" />
            </div>
          </div>
          <div className="flex flex-1 items-end justify-between text-sm">
            <p className="text-gray-500 dark:text-slate-400">{`Qty ${qualitySelected}`}</p>

            <div className="flex space-x-3">
              <Link to={"/cart"} className="font-medium text-primary-6000 dark:text-primary-500 hover:underline">
                View cart
              </Link>
              {orderId && (
                <Link
                  to={`/order-tracking/${orderId}`}
                  className="font-medium text-green-600 dark:text-green-500 hover:underline"
                >
                  Track Order
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Transition
      appear
      show={show}
      className="p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200"
      enter="transition-all duration-150"
      enterFrom="opacity-0 translate-x-20"
      enterTo="opacity-100 translate-x-0"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 translate-x-0"
      leaveTo="opacity-0 translate-x-20"
    >
      <p className="block text-base font-semibold leading-none">Order Placed Successfully!</p>
      {orderId && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Order ID: {orderId}</p>}
      <hr className=" border-slate-200 dark:border-slate-700 my-4" />
      {renderProductCartOnNotify()}
    </Transition>
  )
}

export default NotifyAddTocart
