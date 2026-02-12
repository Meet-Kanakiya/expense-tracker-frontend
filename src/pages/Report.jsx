import { useEffect, useCallback ,useState, useRef } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../css/Report.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

export default function Report() {
  const [expense, setExpense] = useState([]);
  const token = localStorage.getItem("token");
  const chartRef = useRef();

  
  const fetchExpenses = useCallback(async () => {
    const res = await axios.get("process.env.REACT_APP_API_URL/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setExpense(res.data);
  },[]);
  
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);
  // const expenseList = JSON.parse(localStorage.getItem("expense")) || [];

  const totalExpense = expense
    .filter(e => e.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalIncome = expense
    .filter(e => e.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = totalIncome - totalExpense;

  const pieData = expense
    .filter((e) => e.type === "expense")
    .map((e) => ({
      name: e.title,
      value: Number(e.amount),
    }))
    .sort((a, b) => b.value - a.value);


  const barData = expense
    .filter((e) => e.type === "expense")
    .map((e) => ({
      name: e.title,
      amount: Number(e.amount),
    }));

  /* ===== EXPORT AS IMAGE ===== */
  const exportImage = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "expense-report.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  /* ===== EXPORT AS PDF ===== */
  const exportPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("expense-report.pdf");
  };
  const cardStyle = {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center"
  };

  return (

    <div className="report-page">
      <div className="report-header">

        <h2>Expense Analytics</h2>
        <div className="export-btns">
          <button onClick={exportImage}>Export Image</button>
          <button onClick={exportPDF}>Export PDF</button>
        </div>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>

        {/* Expense */}
        <div style={cardStyle}>
          <h3>Total Expense</h3>
          <h2 style={{ color: "#ff4d4f" }}>₹{totalExpense}</h2>
        </div>

        {/* Income */}
        <div style={cardStyle}>
          <h3>Total Income</h3>
          <h2 style={{ color: "#52c41a" }}>₹{totalIncome}</h2>
        </div>

        {/* Balance */}
        <div style={cardStyle}>
          <h3>Balance</h3>
          <h2 style={{ color: "#1677ff" }}>₹{balance}</h2>
        </div>

      </div>

      <div ref={chartRef}>

        <div className="chart-grid">
          {/* PIE CHART */}
          <div className="chart-card">
            <h3>Income vs Expense</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}

                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "18px", fontWeight: "600" }}
                  >
                    ₹{totalExpense}
                  </text>

                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="chart-card">
            <h3>Expense Breakdown (Item wise)</h3>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={barData}
                barSize={45}
                margin={{ top: 30, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e6" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 13 }}
                />

                <YAxis />

                <Tooltip
                  cursor={{ fill: "rgba(30,60,114,0.08)" }}
                  formatter={(v) => [`₹${v}`, "Amount"]}
                />

                <Bar
                  dataKey="amount"
                  fill="#1e3c72"
                  radius={[8, 8, 0, 0]}
                >
                  <LabelList
                    dataKey="amount"
                    position="top"
                    formatter={(v) => `₹${v}`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
