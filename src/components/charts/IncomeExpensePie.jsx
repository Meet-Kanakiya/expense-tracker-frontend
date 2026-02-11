import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1e3c72", "#e74c3c"];

export default function IncomeVsExpenseChart({ expenses }) {
  const totalIncome = expenses
    .filter((e) => e.type === "income")
    .reduce((s, e) => s + Number(e.amount), 0);

  const totalExpense = expenses
    .filter((e) => e.type === "expense")
    .reduce((s, e) => s + Number(e.amount), 0);

  const data = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  return (
    <div style={{ height: 300 }}>
      <h3 style={{ textAlign: "center" }}>Income vs Expense</h3>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            paddingAngle={4}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `₹${v}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
