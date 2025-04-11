import React from "react";
import {
  FaUser,
  FaDatabase,
  FaSignOutAlt,
  FaShoppingCart,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";
import Logo from '../images/Logo1.png';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
  <div className="max-w-screen-xl mx-auto px-6 py-5 flex items-center justify-between">
    {/* Logo (ชิดซ้าย) */}
    <div
      className="text-3xl font-extrabold text-gray-800 cursor-pointer tracking-wide"
      onClick={() => navigate("/shopping")}
    >
    <img src={Logo} alt="Shopping Logo" className="h-20 w-auto" />  
    </div>

    {/* Nav + Logout (ชิดขวา) */}
    <div className="flex items-center gap-6">
      <div className="hidden md:flex gap-6 text-base font-medium">
        <button
          onClick={() => navigate("/shopping")}
          className="text-gray-700 hover:text-primary transition flex items-center gap-1"
        >
          <FaShoppingCart />
          Shopping
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="text-gray-700 hover:text-primary transition flex items-center gap-1"
        >
          <FaUser />
          Profile
        </button>
        <button
          onClick={() => navigate("/crud")}
          className="text-gray-700 hover:text-primary transition flex items-center gap-1"
        >
          <FaDatabase />
          CRUD Page
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="btn btn-outline btn-error btn-sm md:btn-md font-semibold"
      >
        <FaSignOutAlt className="mr-1" />
        Logout
      </button>
    </div>
  </div>
</div>
  );
};

export default Sidebar;
