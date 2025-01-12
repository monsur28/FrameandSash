import { useNavigate } from "react-router-dom";
import { useLanguage } from "../ContextProvider/LanguageContext";

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
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCompanyClick = (ordersName) => {
    const companyOffer = orders.find((item) => item.name === ordersName);
    const encodedName = encodeURIComponent(ordersName);
    navigate(`/dashboard/offers/${encodedName}`, {
      state: companyOffer, // Passing the manufacturer data to the next page
    });
  };

  return (
    <div className="p-6 border-2 border-white bg-white50 backdrop-blur-16.5 rounded-lg h-screen overflow-x-auto">
      <table className="table-auto w-full rounded-lg shadow-md">
        <thead className=" text-gray-600">
          <tr>
            <th className="px-6 py-3 text-left font-medium">
              {t("companyName")}
            </th>
            <th className="px-6 py-3 text-left font-medium">
              {t("activeOrder")}
            </th>
            <th className="px-6 py-3 text-left font-medium">
              {t("completedOrder")}
            </th>
            <th className="px-6 py-3 text-left font-medium">
              {t("canceledOrder")}
            </th>
          </tr>
        </thead>
        <tbody className="rounded-lg divide-y-8 divide-white">
          {orders.map((order, index) => (
            <tr
              key={index}
              onClick={() => handleCompanyClick(order.name)}
              className="bg-[#7ac7c4] text-white rounded-lg"
            >
              <td className="px-6 py-4 flex items-center gap-3">
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
              </td>
              <td className="px-6 py-4">{order.orderNumber}</td>
              <td className="px-6 py-4">{order.amount}</td>
              <td className="px-6 py-4">{order.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
