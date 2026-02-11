import "../dashboard.css";
import { MdDashboard } from "react-icons/md";
import { FaWallet , FaSignOutAlt } from "react-icons/fa";
import { HiChartPie } from "react-icons/hi";

export default function Sidebar({ setView, view }) {
  return (
    <div className="sidebar">

      {/* Logo */}
      <h2 className="logo">💸 FinTrack</h2>

      <ul>

        <li
          className={view === "home" ? "active" : ""}
          onClick={() => setView("home")}
        >
          <MdDashboard size={22} />
          Dashboard
        </li>

        <li
          className={view === "expense" ? "active" : ""}
          onClick={() => setView("expense")}
        >
          <FaWallet size={20} />
          Expense
        </li>

        <li
          className={view === "report" ? "active" : ""}
          onClick={() => setView("report")}
        >
          <HiChartPie size={22} />
          Report
        </li>

        <li
          onClick={() => {
            localStorage.removeItem("token");
            window.location.reload();
          }}
        >
          <FaSignOutAlt size={20}/>
          Logout
        </li>
      </ul>
    </div>
  );
}
