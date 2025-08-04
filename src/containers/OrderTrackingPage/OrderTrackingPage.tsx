"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ButtonPrimary from "shared/Button/ButtonPrimary"
import ButtonSecondary from "shared/Button/ButtonSecondary"
import Prices from "components/Prices"

interface OrderStatus {
  id: string
  status: "pending" | "processing" | "on_the_way" | "delivered" | "cancelled" | "returned"
  timestamp: string
  description: string
}

interface OrderItem {
  id: string
  name: string
  image_url: string
  price: number
  quantity: number
  variant: string
  size: string
}

interface OrderDetails {
  orderId: string
  orderDate: string
  estimatedDelivery: string
  totalAmount: number
  deliveryAmount: number
  subTotal: number
  paymentMethod: string
  shippingAddress: {
    name: string
    address: string
    city: string
    zipCode: string
    phone: string
    email: string
  }
  items: OrderItem[]
  currentStatus: OrderStatus["status"]
  statusHistory: OrderStatus[]
  trackingNumber?: string
}

// API Response interfaces
interface ApiOrderResponse {
  order: {
    order_id: string
    created_date: string
    payment: string
    total: number
    delivery: number
    sub_total: number
    order_status: string
    cus_id: number
    first_name: string
    last_name: string
    address1: string
    address2: string
    city: string
    email: string
    phone_1: string
    phone_2: string
    province: string
    country: string
  }
  items: Array<{
    product_name: string
    quantity: number
    price: number
    sub_total: number
    image_url: string
  }>
}

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Map API order status to component status (only the requested statuses)
  const mapOrderStatus = (apiStatus: string): OrderStatus["status"] => {
    switch (apiStatus.toLowerCase()) {
      case "pending":
        return "pending"
      case "confirmed":
      case "preparing":
      case "processing":
        return "processing"
      case "shipped":
      case "out_for_delivery":
      case "on_the_way":
        return "on_the_way"
      case "delivered":
        return "delivered"
      case "cancelled":
      case "cancel":
        return "cancelled"
      case "returned":
      case "return":
        return "returned"
      default:
        return "pending"
    }
  }

  // Format date string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate estimated delivery (add 3-5 days to order date)
  const calculateEstimatedDelivery = (orderDate: string): string => {
    const date = new Date(orderDate)
    date.setDate(date.getDate() + 4) // Add 4 days as example
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Check if 24 hours have passed since order placement
  const isOrderCancellable = (orderDate: string): boolean => {
    const orderDateTime = new Date(orderDate)
    const currentTime = new Date()
    const timeDifference = currentTime.getTime() - orderDateTime.getTime()
    const hoursDifference = timeDifference / (1000 * 3600) // Convert to hours
    return hoursDifference < 24
  }

  // Handle order cancellation confirmation
  const handleCancelConfirm = () => {
    setShowCancelDialog(true)
  }

  // Handle actual order cancellation after confirmation
  const handleCancelOrder = async () => {
    if (!orderDetails) return

    setShowCancelDialog(false)
    setCancelLoading(true)
    setCancelError(null)

    try {
      const response = await fetch(
        `http://localhost:4000/api/customerOrderSave/updateOrderStatus/${orderDetails.orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_status: "Cancelled",
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to cancel order: ${response.status}`)
      }

      // Update the order details to reflect cancellation
      setOrderDetails((prev) =>
        prev
          ? {
              ...prev,
              currentStatus: "cancelled",
            }
          : null,
      )

      alert("Order cancelled successfully!")
    } catch (err) {
      console.error("Error cancelling order:", err)
      setCancelError("Failed to cancel order. Please try again.")
    } finally {
      setCancelLoading(false)
    }
  }

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID is required")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`http://localhost:4000/api/customerOrderSave/getOrderDetails/${orderId}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiData: ApiOrderResponse = await response.json()

        // Map API response to component structure
        const mappedOrderDetails: OrderDetails = {
          orderId: apiData.order.order_id,
          orderDate: formatDate(apiData.order.created_date),
          estimatedDelivery: calculateEstimatedDelivery(apiData.order.created_date),
          totalAmount: apiData.order.total,
          deliveryAmount: apiData.order.delivery,
          subTotal: apiData.order.sub_total,
          paymentMethod: apiData.order.payment,
          trackingNumber: "TRK" + apiData.order.order_id.slice(-6),
          shippingAddress: {
            name: `${apiData.order.first_name} ${apiData.order.last_name}`,
            address: `${apiData.order.address1}${apiData.order.address2 ? ", " + apiData.order.address2 : ""}`,
            city: `${apiData.order.city}, ${apiData.order.province}`,
            zipCode: apiData.order.country,
            phone: apiData.order.phone_1,
            email: apiData.order.email,
          },
          items: apiData.items.map((item, index) => ({
            id: index.toString(),
            name: item.product_name,
            image_url: item.image_url,
            price: item.price,
            quantity: item.quantity,
            variant: "Standard",
            size: "Standard",
          })),
          currentStatus: mapOrderStatus(apiData.order.order_status),
          statusHistory: [
            {
              id: "1",
              status: "pending",
              timestamp: formatDate(apiData.order.created_date) + " - Order Placed",
              description: `Order placed successfully with ${apiData.order.payment} payment method`,
            },
            {
              id: "2",
              status: mapOrderStatus(apiData.order.order_status),
              timestamp: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              description: `Order is currently ${apiData.order.order_status.toLowerCase()}`,
            },
          ],
        }

        setOrderDetails(mappedOrderDetails)
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to fetch order details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  const getStatusColor = (status: OrderStatus["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900"
      case "processing":
        return "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900"
      case "on_the_way":
        return "text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-900"
      case "delivered":
        return "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900"
      case "cancelled":
        return "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900"
      case "returned":
        return "text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-900"
      default:
        return "text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-900"
    }
  }

  const getStatusText = (status: OrderStatus["status"]) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "processing":
        return "Processing"
      case "on_the_way":
        return "On the way"
      case "delivered":
        return "Delivered"
      case "cancelled":
        return "Cancel"
      case "returned":
        return "Return"
      default:
        return "Unknown Status"
    }
  }

  const getStatusDescription = (status: OrderStatus["status"]) => {
    switch (status) {
      case "pending":
        return "Order has been placed and is pending confirmation"
      case "processing":
        return "Order is being prepared and processed"
      case "on_the_way":
        return "Order is on the way to your delivery address"
      case "delivered":
        return "Order has been successfully delivered"
      case "cancelled":
        return "Order has been cancelled"
      case "returned":
        return "Order has been returned"
      default:
        return "Status update"
    }
  }

  if (loading) {
    return (
      <div className="nc-OrderTrackingPage">
        <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !orderDetails) {
    return (
      <div className="nc-OrderTrackingPage">
        <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {error || "Order Not Found"}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                {error || "The order you're looking for doesn't exist or has been removed."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonSecondary href="/account-my-order">View All Orders</ButtonSecondary>
                <ButtonPrimary href="/">Continue Shopping</ButtonPrimary>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="nc-OrderTrackingPage">
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-semibold text-slate-900 dark:text-slate-100">Order Tracking</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Track your order status and delivery information</p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Order #{orderDetails.orderId}
                </h2>
                <div className="space-y-1 text-slate-600 dark:text-slate-300">
                  <p>Placed on {orderDetails.orderDate}</p>
                  <p>Payment: {orderDetails.paymentMethod}</p>
                  {orderDetails.trackingNumber && <p>Tracking: {orderDetails.trackingNumber}</p>}
                </div>
              </div>
              <div className="flex flex-col items-start lg:items-end">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(orderDetails.currentStatus)}`}
                >
                  {getStatusText(orderDetails.currentStatus)}
                </span>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Total: Rs. {orderDetails.totalAmount}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Shipping Address</h3>
                <div className="text-slate-600 dark:text-slate-300 space-y-1">
                  <p className="font-medium">{orderDetails.shippingAddress.name}</p>
                  <p>{orderDetails.shippingAddress.address}</p>
                  <p>{orderDetails.shippingAddress.city}</p>
                  <p>{orderDetails.shippingAddress.phone}</p>
                  <p>{orderDetails.shippingAddress.email}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Delivery Information</h3>
                <div className="text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    <span className="text-slate-500">Estimated Delivery:</span>{" "}
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {orderDetails.estimatedDelivery}
                    </span>
                  </p>
                  <p>
                    <span className="text-slate-500">Delivery Fee:</span>{" "}
                    <span className="font-medium">Rs. {orderDetails.deliveryAmount}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Current Order Status</h3>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {getStatusText(orderDetails.currentStatus)}
                </h4>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {getStatusDescription(orderDetails.currentStatus)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
              Order Items ({orderDetails.items.length})
            </h3>
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-700">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 dark:text-slate-100 truncate">{item.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <Prices price={item.price * item.quantity} className="text-lg font-semibold" />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">Subtotal:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    Rs. {orderDetails.subTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-300">Delivery:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    Rs. {orderDetails.deliveryAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2">
                  <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Total Amount:</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Rs. {orderDetails.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderDetails.currentStatus === "pending" && (
              <ButtonSecondary
                onClick={handleCancelConfirm}
                disabled={!isOrderCancellable(orderDetails.orderDate) || cancelLoading}
                className={`${!isOrderCancellable(orderDetails.orderDate) ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {cancelLoading ? "Cancelling..." : "Order Cancel"}
              </ButtonSecondary>
            )}
            <ButtonPrimary href="/contact">Contact Support</ButtonPrimary>
          </div>

          {/* Confirmation Dialog */}
          {showCancelDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-md mx-4 border border-slate-200 dark:border-slate-700">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                    <svg
                      className="h-6 w-6 text-red-600 dark:text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Cancel Order?</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Are you sure you want to cancel this order? This action cannot be undone.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => setShowCancelDialog(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      Keep Order
                    </button>
                    <button
                      onClick={handleCancelOrder}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      Yes, Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Show cancellation error if any */}
          {cancelError && (
            <div className="text-center mt-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{cancelError}</p>
            </div>
          )}

          {/* Show cancellation info for pending orders */}
          {orderDetails.currentStatus === "pending" && !isOrderCancellable(orderDetails.orderDate) && (
            <div className="text-center mt-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Order cancellation is only available within 24 hours of placement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage
