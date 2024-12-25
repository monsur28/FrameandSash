const orders = [
  {
    logo: "https://i.ibb.co/ryTWxGF/plygem.webp",
    name: "Pay Gem",
    orderNumber: "004",
    amount: "$5846",
    rating: 4.8,
  },
  {
    logo: "https://i.ibb.co/yQGBMPk/Championwindows.webp",
    name: "Alside Inc",
    orderNumber: "006",
    amount: "$5646",
    rating: 4.7,
  },
  {
    logo: "https://i.ibb.co/bmW36hz/alsidelogo.webp",
    name: "Pella",
    orderNumber: "009",
    amount: "$5246",
    rating: 4.8,
  },
];

export default function Offers() {
  return (
    <div className="p-6 border-2 border-white bg-white/50 backdrop-blur-[16.5px] rounded-lg h-screen">
      <div className="grid grid-cols-4 mb-4 px-4">
        <h2 className="text-gray-500 font-medium">Company Name</h2>
        <h2 className="text-gray-500 font-medium">Active Order</h2>
        <h2 className="text-gray-500 font-medium">Completed Order</h2>
        <h2 className="text-gray-500 font-medium">Canceled Order</h2>
      </div>

      <div className="space-y-3">
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center bg-[#7ac7c4] rounded-xl p-4 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img
                  src={order.logo}
                  alt={`${order.name} logo`}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-medium">{order.name}</span>
            </div>
            <span>{order.orderNumber}</span>
            <span>{order.amount}</span>
            <span>{order.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
