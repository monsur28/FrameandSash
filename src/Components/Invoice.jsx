export default function Invoice({ order }) {
  return (
    <div className="min-h-[800px] print:min-h-0 print:overflow-auto">
      <div className="print:hidden">
        {/* Header for Screen */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md flex items-center justify-center text-white font-bold">
                <img src="https://i.ibb.co.com/Wy25CD3/7361b7fc8afb8967cde95738ba8c2d04.png" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Frame And Sash</h2>
                <p className="text-sm text-gray-500">
                  Frame And Sash is one of the best Furniture companies
                </p>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              <p>123 Commerce Street</p>
              <p>Dhaka, Bangladesh 1000</p>
              <p>Phone: +880 2-123456</p>
              <p>Email: support@frameandsash.com</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-500 mt-1">#{order.order_number}</p>
            <div className="mt-2 text-sm">
              <p>
                <span className="font-medium">Date Issued:</span>{" "}
                {order.order_date}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {order.payment.status}
              </p>
              <p className="mt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${
                      order.payment.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                >
                  {order.payment.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-4">
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Bill To:</h3>
          <div className="text-sm">
            <p className="font-medium">
              Name: {""}
              {order.customer
                ? `${order.customer.name || ""}`.trim()
                : "Customer Name"}
            </p>
            <p>Email: {order.customer?.email || "XXX@XXX.COM"}</p>
            <p>Phone: {order.customer?.phone || "+880 1XXX-XXXXXX"}</p>
            <p className="mt-2">
              Billing Address :{" "}
              {[
                order?.customer?.shipping_address,
                order?.customer?.city?.name,
                order?.customer?.country?.name,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </div>
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="font-semibold text-gray-700 mb-2">
            Payment Information:
          </h3>
          <div className="text-sm">
            <p>
              <span className="font-medium">Method:</span>{" "}
              {order.payment.method === "stripe"
                ? "Payment By Stripe"
                : order.payment.method === "cod"
                ? "Cash On Delivery"
                : order.payment.method}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {order.payment?.order_date || order.order_date}
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              {order.payment?.status || "Paid"}
            </p>
          </div>
          <h3 className="font-semibold text-gray-700 mt-2">
            Shipping Information:
          </h3>
          <div className="text-sm">
            <p>
              <span className="font-medium">Method:</span>{" "}
              {order.shipping.method}
            </p>
            <p>
              <span className="font-medium">Tracking Number:</span>{" "}
              {order.shipping?.tracking_number}
            </p>
            <p>
              <span className="font-medium">Zone:</span> {order.shipping?.zone}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-2">
        <div className="bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-3 px-4 font-semibold">Item</th>
                <th className="text-center py-3 px-4 font-semibold">
                  Quantity
                </th>
                <th className="text-right py-3 px-4 font-semibold">Price</th>
                <th className="text-right py-3 px-4 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr
                  key={item.product_name}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-3">
                      <span className="font-medium">{item.product_name}</span>
                      {item.dimensions && (
                        <div>
                          <span>
                            Dimension: {item.dimensions.height}x
                            {item.dimensions.width} {item.dimensions.unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{item.price}</td>
                  <td className="py-3 px-4 text-right">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex justify-end mb-2">
        <div className="w-full md:w-64">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 text-gray-600">Subtotal</td>
                  <td className="py-2 px-4 text-right font-medium">
                    {order.totals?.subtotal || order.totals?.total_amount}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 text-gray-600">Shipping</td>
                  <td className="py-2 px-4 text-right font-medium">
                    {order.totals?.shipping_cost || "৳100"}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2 px-4 text-gray-600">Total</td>
                  <td className="py-2 px-4 text-right font-bold">
                    {order.totals?.total_amount || order.totals?.total}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="border-t border-gray-200 pt-2 mb-2">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Notes:</h3>
            <p className="text-sm text-gray-600">
              Thank you for shopping with Frame and Sash. We appreciate your
              business and hope you enjoy your purchase!
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Terms & Conditions:
            </h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>All returns must be made within 7 days of delivery</li>
              <li>Items must be in original packaging and unused condition</li>
              <li>Shipping costs are non-refundable</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t border-gray-200 pt-6 text-sm text-gray-500">
        <p>If you have any questions about this invoice, please contact</p>
        <p>support@frameandsash.com or call +880 2-123456</p>
      </div>
    </div>
  );
}
