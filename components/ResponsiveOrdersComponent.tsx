"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { CreditCard, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/orderStatus";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import DirectPaymentModal from "./DirectPaymentModal";

const ResponsiveOrdersComponent = ({
  orders,
}: {
  orders: MY_ORDERS_QUERYResult;
}) => {
  const [generatingInvoiceId, setGeneratingInvoiceId] = useState<string | null>(
    null
  );
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult[0] | null
  >(null);

  // Render product images
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderProductImages = (products: any[], isCard = false) => {
    if (!products || products.length === 0) {
      return <span className="text-sm text-gray-400">No products</span>;
    }

    const maxVisible = isCard ? 2 : 3;
    const displayProducts = products.slice(0, maxVisible);
    const remainingCount = Math.max(0, products.length - maxVisible);
    const imageSize = isCard ? "h-10 w-10" : "h-8 w-8";

    return (
      <div className="flex min-w-0 items-center">
        <div className="flex min-w-0 items-center">
          {displayProducts.map((item, index) => {
            const imageUrl = item.product?.images?.[0] || item.product?.image;

            return (
              <div
                key={index}
                className={`relative ${imageSize} shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm ${
                  index > 0 ? "-ml-2" : ""
                }`}
                style={{ zIndex: 30 - index * 10 }}
              >
                {imageUrl ? (
                  <Image
                    src={urlFor(imageUrl).url()}
                    alt={item.product?.name || "Product"}
                    fill
                    sizes={isCard ? "40px" : "32px"}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <span className="text-xs text-gray-500">?</span>
                  </div>
                )}
              </div>
            );
          })}

          {remainingCount > 0 && (
            <div
              className={`-ml-2 ${imageSize} z-10 flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-600 shadow-sm`}
            >
              <span
                className={`${
                  isCard ? "text-sm" : "text-xs"
                } font-semibold text-white`}
              >
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handlePayNow = (orderId: string) => {
    if (!orderId) return;

    const order = orders.find((item) => item._id === orderId);

    if (order) {
      setSelectedOrder(order);
      setPaymentModalOpen(true);
    }
  };

  const handlePaymentModalClose = () => {
    setPaymentModalOpen(false);
    setSelectedOrder(null);
  };

  const handleGenerateInvoice = async (orderId: string) => {
    if (!orderId) return;

    setGeneratingInvoiceId(orderId);

    try {
      const response = await fetch(`/api/orders/${orderId}/generate-invoice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || "Invoice generated successfully!");
        window.location.reload();
      } else {
        toast.error(data.error || "Failed to generate invoice");
      }
    } catch (error) {
      console.error("Invoice generation error:", error);
      toast.error("Failed to generate invoice");
    } finally {
      setGeneratingInvoiceId(null);
    }
  };

  const isOrderPayable = (order: MY_ORDERS_QUERYResult[number]) => {
    const isPaid = order.paymentStatus === PAYMENT_STATUSES.PAID;
    const isCancelled = order.status === ORDER_STATUSES.CANCELLED;

    return !isPaid && !isCancelled;
  };

  const getStatusBadgeVariant = (order: MY_ORDERS_QUERYResult[number]) => {
    if (
      order.paymentStatus === "paid" ||
      order.status === "completed" ||
      order.status === "delivered"
    ) {
      return "bg-green-100 text-green-800";
    }

    if (order.status === "cancelled") {
      return "bg-red-100 text-red-800";
    }

    return "bg-yellow-100 text-yellow-800";
  };

  const renderInvoiceSection = (order: MY_ORDERS_QUERYResult[number]) => {
    if (order?.invoice?.hosted_invoice_url) {
      return (
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 truncate text-sm text-gray-600">
            {order.invoice.number || `INV-${order.orderNumber?.slice(-6)}`}
          </span>

          <Button
            size="sm"
            variant="ghost"
            aria-label="Download invoice"
            className="h-8 w-8 shrink-0 p-0"
            onClick={() => {
              window.open(
                order.invoice?.hosted_invoice_url,
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (order?.paymentStatus === "paid") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2 text-xs"
          disabled={generatingInvoiceId === order._id}
          onClick={() => handleGenerateInvoice(order._id)}
        >
          {generatingInvoiceId === order._id ? (
            <>
              <span className="mr-1 h-3 w-3 animate-spin rounded-full border-b-2 border-gray-600" />
              Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      );
    }

    return <span className="text-xs text-gray-400">----</span>;
  };

  // Mobile and tablet order card
  const OrderCard = ({ order }: { order: MY_ORDERS_QUERYResult[0] }) => (
    <Card className="w-full min-w-0 max-w-full overflow-hidden border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="break-words text-sm font-medium">
              Order #{order.orderNumber?.slice(-10) ?? "N/A"}
            </div>

            <div className="text-xs text-gray-500">
              {order.orderDate &&
                format(new Date(order.orderDate), "dd/MM/yyyy")}
            </div>
          </div>

          <Badge
            className={`${getStatusBadgeVariant(
              order
            )} ml-1 shrink-0 rounded-full px-2 py-1 text-xs font-medium`}
          >
            {order.status
              ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
              : "Pending"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="min-w-0 space-y-4">
        {/* Customer information */}
        <div className="flex min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="min-w-0 max-w-full break-words font-medium">
            {order.customerName || "Customer"}
          </span>

          {order.email && (
            <span className="min-w-0 max-w-full break-all text-gray-600">
              {order.email}
            </span>
          )}
        </div>

        {/* Products and total */}
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Products:</span>
            {renderProductImages(order.products || [], true)}
          </div>

          <div className="shrink-0 font-semibold">
            <PriceFormatter
              amount={order.totalPrice}
              className="text-black"
            />
          </div>
        </div>

        {/* Invoice and actions */}
        <div className="min-w-0 space-y-3 border-t pt-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">Invoice:</span>
            {renderInvoiceSection(order)}
          </div>

          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              asChild
              variant="outline"
              className="h-11 w-full min-w-0 flex-1 sm:w-auto sm:flex-none"
            >
              <Link
                href={`/user/orders/${order._id}`}
                className="flex w-full min-w-0 items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4 shrink-0" />
                <span className="text-sm">View Order</span>
              </Link>
            </Button>

            {isOrderPayable(order) && (
              <Button
                onClick={() => handlePayNow(order._id)}
                className="h-11 w-full min-w-0 flex-1 whitespace-nowrap bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:flex-none"
              >
                <CreditCard className="mr-2 h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">Pay Now</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full min-w-0 max-w-full">
      {/* Payment modal */}
      {selectedOrder &&
        selectedOrder._id &&
        selectedOrder.orderNumber && (
          <DirectPaymentModal
            isOpen={paymentModalOpen}
            onClose={handlePaymentModalClose}
            orderId={selectedOrder._id}
            orderTotal={selectedOrder.totalPrice || 0}
            orderNumber={selectedOrder.orderNumber}
          />
        )}

      {/* Mobile and tablet cards */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:hidden">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden min-w-0 max-w-full overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Order #
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Customer
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Products
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Total
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Invoice
              </th>
              <th className="px-2 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-b transition-colors hover:bg-gray-50"
              >
                <td className="px-2 py-4">
                  <div className="break-words text-sm font-medium">
                    {order.orderNumber?.slice(-10) ?? "N/A"}
                  </div>
                </td>

                <td className="px-2 py-4 text-sm">
                  {order.orderDate &&
                    format(new Date(order.orderDate), "dd/MM/yyyy")}
                </td>

                <td className="px-2 py-4">
                  <div className="text-sm font-medium">
                    {order.customerName}
                  </div>
                </td>

                <td className="max-w-40 px-2 py-4 text-sm text-gray-600">
                  <div className="truncate">{order.email}</div>
                </td>

                <td className="px-2 py-4">
                  {renderProductImages(order.products || [])}
                </td>

                <td className="px-2 py-4">
                  <PriceFormatter
                    amount={order.totalPrice}
                    className="text-sm font-medium"
                  />
                </td>

                <td className="px-2 py-4">
                  <Badge
                    className={`${getStatusBadgeVariant(
                      order
                    )} rounded-full px-2 py-1 text-xs font-medium`}
                  >
                    {order.status
                      ? order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)
                      : "Pending"}
                  </Badge>
                </td>

                <td className="px-2 py-4">
                  {renderInvoiceSection(order)}
                </td>

                <td className="px-2 py-4">
                  <div className="flex items-center justify-start gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="min-w-[70px] whitespace-nowrap"
                    >
                      <Link
                        href={`/user/orders/${order._id}`}
                        className="flex items-center justify-center gap-1"
                      >
                        <Eye className="h-3 w-3 shrink-0" />
                        <span>View</span>
                      </Link>
                    </Button>

                    {isOrderPayable(order) && (
                      <Button
                        onClick={() => handlePayNow(order._id)}
                        size="sm"
                        className="min-w-[100px] whitespace-nowrap bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <CreditCard className="mr-1 h-3 w-3 shrink-0" />
                        <span className="text-xs font-medium">Pay Now</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsiveOrdersComponent;
