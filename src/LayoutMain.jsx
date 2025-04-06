import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const LayoutMain = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Sidebar />
      <main className="p-4 max-w-screen-xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutMain;
