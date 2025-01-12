import { Edit, Users, Activity, MessageCircle } from "lucide-react";
import useAuth from "../Hooks/UseAuth";
import { useLanguage } from "../ContextProvider/LanguageContext";

export default function AdminProfile() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Dummy Admin Data
  const admin = {
    name: "Twintech Soft. Ltd",
    role: "Administrator",
    email: "admin@twintechsoft.com",
    profilePicture:
      "https://images.squarespace-cdn.com/content/v1/53b599ebe4b08a2784696956/1451882872681-B0PM3YN9RPLLA36MKVI8/image-asset.jpeg?format=500w",
    joinedDate: "January 2021",
    totalUsers: 1500,
    totalPosts: 4500,
    messages: 120,
  };

  return (
    <div className="h-full p-6">
      <div className="rounded-[24px] bg-white50 backdrop-blur-16.5 overflow-hidden">
        {/* Header Section */}
        <div className="relative ">
          <div className="rounded-[24px] mt-10 h-40"></div>
          <div className="absolute top-1/2 left-6 transform -translate-y-1/2 flex flex-col lg:flex-row items-center justify-between space-x-4">
            <img
              src={admin.profilePicture}
              alt="Admin Profile"
              className="w-24 h-24 rounded-full border-4 border-white shadow-md"
            />
            <div>
              <h1 className="text-xl font-bold ">{admin.name}</h1>
              <p className="text-sm">{admin.role}</p>
              <p className="text-sm ">{user.email}</p>
            </div>
            <div className="flex justify-around p-6 border-t">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
                <Edit size={18} />
                <span>{t("EditProfile")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="border-2 flex flex-col justify-center items-center border-white bg-white50 backdrop-blur-16.5 rounded-3xl py-16 px-24 shadow-sm">
              <h2 className="text-lg font-semibold">{admin.totalUsers}</h2>
              <p className="text-gray-500">{t("TotalUsers")}</p>
            </div>
            <div className="border-2 flex flex-col justify-center items-center border-white bg-white50 backdrop-blur-16.5 rounded-3xl py-16 px-24 shadow-sm">
              <h2 className="text-lg font-semibold">{admin.totalPosts}</h2>
              <p className="text-gray-500">{t("TotalPosts")}</p>
            </div>
            <div className="border-2 flex flex-col justify-center items-center border-white bg-white50 backdrop-blur-16.5 rounded-3xl py-16 px-24 shadow-sm">
              <h2 className="text-lg font-semibold">{admin.messages}</h2>
              <p className="text-gray-500">{t("Messages")}</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">{t("RecentActivity")}</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-4">
              <Activity size={20} className="text-teal-500" />
              <p>Approved 15 new user accounts.</p>
            </li>
            <li className="flex items-center space-x-4">
              <Users size={20} className="text-purple-500" />
              <p>Added 3 new moderators.</p>
            </li>
            <li className="flex items-center space-x-4">
              <MessageCircle size={20} className="text-yellow-500" />
              <p>Responded to 8 user queries.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
