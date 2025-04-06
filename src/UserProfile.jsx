import { useState, useEffect } from "react";
import { auth, db } from "./Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    country: "",
    postal: "",
    about: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      const fetchProfile = async () => {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setFormData((prev) => ({
            ...prev,
            ...snap.data(),
            email: user.email,
          }));
        }
      };
      fetchProfile();
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    const ref = doc(db, "users", user.uid);
    await updateDoc(ref, formData);
    alert("✅ Profile updated successfully");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-base-200 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">👤 My Account</h2>
          <button onClick={handleSave} className="btn btn-success">
            Save
          </button>
        </div>

        {/* User Info */}
        <h4 className="text-lg font-semibold mb-2">User Information</h4>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input
            name="username"
            placeholder="Username"
            className="input input-bordered w-full"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            className="input input-bordered w-full bg-gray-200 text-gray-500 cursor-not-allowed"
            value={formData.email}
            disabled
          />
          <input
            name="firstname"
            placeholder="First Name"
            className="input input-bordered w-full"
            value={formData.firstname}
            onChange={handleChange}
          />
          <input
            name="lastname"
            placeholder="Last Name"
            className="input input-bordered w-full"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        {/* Contact Info */}
        <h4 className="text-lg font-semibold mb-2">Contact Information</h4>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <input
            name="address"
            placeholder="Address"
            className="input input-bordered w-full"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            name="city"
            placeholder="City"
            className="input input-bordered w-full"
            value={formData.city}
            onChange={handleChange}
          />
          <input
            name="country"
            placeholder="Country"
            className="input input-bordered w-full"
            value={formData.country}
            onChange={handleChange}
          />
          <input
            name="postal"
            placeholder="Postal Code"
            className="input input-bordered w-full"
            value={formData.postal}
            onChange={handleChange}
          />
        </div>

        {/* About Me */}
        <h4 className="text-lg font-semibold mb-2">About Me</h4>
        <textarea
          name="about"
          placeholder="Write something about yourself..."
          className="textarea textarea-bordered w-full h-32"
          value={formData.about}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default UserProfile;
