import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaWallet, FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../css/Home.css";

export default function Home() {
  const [expense, setExpense] = useState([]);
  const [showAll, setShowAll] = useState(false); // State to toggle view
  const token = localStorage.getItem("token");

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpense(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Calculations
  const totalIncome = expense
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalExpense = expense
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + Number(e.amount), 0);

  const balance = totalIncome - totalExpense;

  // Logic: Show all if showAll is true, else show only 3
  const displayedItems = showAll 
    ? [...expense].reverse() 
    : [...expense].reverse().slice(0, 3);

  return (
    <div className="home-container">
      {/* STAT CARDS */}
      <div className="stats-grid">
        <div className="stat-card balance">
          <div className="stat-icon"><FaWallet /></div>
          <div className="stat-info">
            <p>Total Balance</p>
            <h2>₹{balance.toLocaleString()}</h2>
          </div>
        </div>

        <div className="stat-card income">
          <div className="stat-icon"><FaArrowUp /></div>
          <div className="stat-info">
            <p>Total Income</p>
            <h2 className="text-green">₹{totalIncome.toLocaleString()}</h2>
          </div>
        </div>

        <div className="stat-card expense">
          <div className="stat-icon"><FaArrowDown /></div>
          <div className="stat-info">
            <p>Total Expense</p>
            <h2 className="text-red">₹{totalExpense.toLocaleString()}</h2>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="recent-section">
        <div className="section-header">
          <h3>{showAll ? "All Transactions" : "Recent Transactions"}</h3>
          <button 
            className="view-all-btn" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All"}
          </button>
        </div>

        <div className="transaction-list">
          {displayedItems.length === 0 ? (
            <div className="no-data">
              <p>No transactions yet.</p>
            </div>
          ) : (
            displayedItems.map((item) => (
              <div className="transaction-item" key={item._id}>
                <div className="item-details">
                  <div className={`icon-box ${item.type}`}>
                    {item.type === "income" ? <FaArrowUp /> : <FaArrowDown />}
                  </div>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.category}</p>
                  </div>
                </div>
                <div className="item-amount">
                  <h4 className={item.type}>
                    {item.type === "income" ? "+" : "-"} ₹{item.amount}
                  </h4>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}