import { MdDashboard } from "react-icons/md";
import { FaWallet, FaSignOutAlt, FaTimes } from "react-icons/fa"; // Added FaTimes for better close icon
import { HiChartPie } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ setView, view, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItem = "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200";
  const activeItem = "bg-white text-indigo-700 font-bold shadow-md scale-[1.02]";
  const inactiveItem = "text-indigo-100 hover:bg-white/10 hover:text-white";

  return (
    <>
      {/* Overlay: Only visible on mobile when sidebar is open */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-700 to-indigo-900 p-6 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <button 
          className="md:hidden absolute top-5 right-5 text-white p-2"
          onClick={() => setSidebarOpen(false)}
        >
          <FaTimes size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-white p-2 rounded-lg text-indigo-700">
            <FaWallet size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">FinTrack</h2>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          <div
            onClick={() => { setView("home"); setSidebarOpen(false); }}
            className={`${menuItem} ${view === "home" ? activeItem : inactiveItem}`}
          >
            <MdDashboard size={22} />
            <span>Dashboard</span>
          </div>

          <div
            onClick={() => { setView("expense"); setSidebarOpen(false); }}
            className={`${menuItem} ${view === "expense" ? activeItem : inactiveItem}`}
          >
            <FaWallet size={20} />
            <span>Expenses</span>
          </div>

          <div
            onClick={() => { setView("report"); setSidebarOpen(false); }}
            className={`${menuItem} ${view === "report" ? activeItem : inactiveItem}`}
          >
            <HiChartPie size={22} />
            <span>Reports</span>
          </div>

          <div className="pt-4 mt-4 border-t border-white/20">
            <div
              onClick={handleLogout}
              className={`${menuItem} text-red-200 hover:bg-red-500/20 hover:text-red-100`}
            >
              <FaSignOutAlt size={20} />
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}