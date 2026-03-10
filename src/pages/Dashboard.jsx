import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Expense from "./Expense";
import Report from "./Report";
import Home from "./Home";
import { HiMenuAlt1 } from "react-icons/hi"; // For a cleaner menu icon

export default function Dashboard() {
  const [view, setView] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar Component */}
      <Sidebar
        setView={setView}
        view={view}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header: Mobile (Visible) / Desktop (Refined) */}
        <header className="bg-white border-b border-slate-200 px-4 py-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <HiMenuAlt1 size={26} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 capitalize">
              {view === "home" ? "Overview" : view}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-500 font-medium">User Profile</span>
            <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
              MK
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Welcome Message (Optional) */}
            {/* <div className="mb-6 hidden md:block">
              <h2 className="text-2xl font-bold text-slate-800">Welcome Back 👋</h2>
              <p className="text-slate-500">Here's what's happening with your finances today.</p>
            </div> */}

            {/* View Rendering */}
            <div className="animate-in fade-in duration-500">
              {view === "home" && <Home />}
              {view === "expense" && <Expense />}
              {view === "report" && <Report />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}