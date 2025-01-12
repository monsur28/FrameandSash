import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../Hooks/UseAuth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateProfile() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.displayName || "");
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = user.photoURL;

      // Upload profile picture if a new file is selected
      if (profilePicture) {
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        setUploading(true);
        await uploadBytes(storageRef, profilePicture);
        photoURL = await getDownloadURL(storageRef);
        setUploading(false);
      }

      // Update the user's profile
      await updateUserProfile({
        displayName: name,
        photoURL,
      });

      toast.success("Profile updated successfully! 🎉", {
        position: "top-right",
      });
      navigate("/dashboard/settings"); // Navigate back to the settings page
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-6">
      <div className=" rounded-[24px] mt-10  bg-white50 backdrop-blur-16.5 p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium"
            >
              Profile Picture
            </label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>
          {uploading && (
            <p className="text-blue-500 text-sm">Uploading image...</p>
          )}
          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md ${
              loading || uploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
