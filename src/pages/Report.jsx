import { useEffect, useCallback, useState, useRef } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaFileImage, FaFilePdf, FaWallet, FaChartLine, FaArrowTrendUp } from "react-icons/fa6";
import "../css/Report.css";

// Professional Color Palette
const COLORS = ["#1e3c72", "#2a5298", "#74b9ff", "#a29bfe", "#ffeaa7", "#fab1a0"];

export default function Report() {
  const [expense, setExpense] = useState([]);
  const token = localStorage.getItem("token");
  const chartRef = useRef();

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpense(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [token]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  // Core Metrics
  const totalIncome = expense.filter(e => e.type === "income").reduce((s, e) => s + Number(e.amount), 0);
  const totalExpense = expense.filter(e => e.type === "expense").reduce((s, e) => s + Number(e.amount), 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  // Data for Category Pie Chart
  const categoryData = Object.values(
    expense.filter(e => e.type === "expense").reduce((acc, { category, amount }) => {
      acc[category] = { name: category, value: (acc[category]?.value || 0) + Number(amount) };
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  // Data for Comparison Bar Chart
  const comparisonData = [
    { name: "Income", amount: totalIncome, fill: "#52c41a" },
    { name: "Expense", amount: totalExpense, fill: "#ff4d4f" }
  ];

  const handleExport = async (type) => {
    const canvas = await html2canvas(chartRef.current, { scale: 2, backgroundColor: "#f8fafc" });
    if (type === 'png') {
      const link = document.createElement("a");
      link.download = "Financial-Analysis.png";
      link.href = canvas.toDataURL();
      link.click();
    } else {
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, width, height);
      pdf.save("Financial-Report.pdf");
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <div>
          <h1>Financial Analytics</h1>
          <p className="date-sub">Performance Overview & Insights</p>
        </div>
        <div className="btn-group">
          <button className="export-btn outline" onClick={() => handleExport('png')}><FaFileImage /> Save PNG</button>
          <button className="export-btn solid" onClick={() => handleExport('pdf')}><FaFilePdf /> Export PDF</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card main">
          <div className="metric-icon"><FaWallet /></div>
          <div className="metric-info">
            <span>Net Balance</span>
            <h2>₹{balance.toLocaleString()}</h2>
          </div>
        </div>
        <div className="metric-card">
          <span>Income</span>
          <h3 className="text-success">₹{totalIncome.toLocaleString()}</h3>
        </div>
        <div className="metric-card">
          <span>Expenses</span>
          <h3 className="text-danger">₹{totalExpense.toLocaleString()}</h3>
        </div>
        <div className="metric-card highlight">
          <span>Savings Rate</span>
          <h3><FaArrowTrendUp /> {savingsRate}%</h3>
        </div>
      </div>

      <div ref={chartRef} className="analytics-body">
        <div className="chart-layout">
          {/* CATEGORY ANALYSIS */}
          <div className="viz-card">
            <div className="card-head">
              <FaChartLine />
              <h3>Spending by Category</h3>
            </div>
            <div className="chart-holder">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryData} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip borderRadius={8} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BUDGET COMPARISON */}
          <div className="viz-card">
            <div className="card-head">
              <FaChartLine />
              <h3>Cash Flow Comparison</h3>
            </div>
            <div className="chart-holder">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                    <LabelList dataKey="amount" position="top" formatter={v => `₹${v}`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}