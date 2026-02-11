import { useEffect, useState } from "react";
import axios from "axios";
import "../css/Home.css";

export default function Home() {

  const [expense, setExpense] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setExpense(res.data);
  };

  // ✅ Calculations
  const totalIncome = expense
    .filter(e => e.type === "income")
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalExpense = expense
    .filter(e => e.type === "expense")
    .reduce((s, e) => s + Number(e.amount), 0);

  const balance = totalIncome - totalExpense;

  const recent = [...expense].reverse().slice(0,5);

  return (
    <div className="home">

      <h1 className="welcome">Welcome Back 👋</h1>

      {/* CARDS */}

      <div className="cards">

        <div className="card balance">
          <p>Total Balance</p>
          <h2>₹{balance}</h2>
        </div>

        <div className="card income">
          <p>Income</p>
          <h2>₹{totalIncome}</h2>
        </div>

        <div className="card expense">
          <p>Expense</p>
          <h2>₹{totalExpense}</h2>
        </div>

      </div>

      {/* RECENT */}

      <div className="recent">
        <h3>Recent Transactions</h3>

        {recent.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          recent.map(item => (
            <div className="recent-item" key={item._id}>
              
              <div>
                <strong>{item.title}</strong>
                <p>{item.category}</p>
              </div>

              <h4 className={item.type}>
                {item.type === "income" ? "+" : "-"} ₹{item.amount}
              </h4>

            </div>
          ))
        )}

      </div>

    </div>
  );
}
