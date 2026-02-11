import Sidebar from "../components/Sidebar";
import Expense from "./Expense";
import Report from "./Report";
import Home from "./Home";
import "../dashboard.css";
import { useState } from "react";

export default function Dashboard() {

  const [view, setView] = useState("home"); // ✅ default home

  return (
    <div className="dashboard">

      <Sidebar setView={setView} view={view}/>

      <div className="content">
        {view === "home" && <Home />}
        {view === "expense" && <Expense />}
        {view === "report" && <Report />}
      </div>

    </div>
  );
}
