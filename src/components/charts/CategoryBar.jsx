import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ExpenseByTitleChart({ expenses }) {
  // Only EXPENSE & group by title
  const expenseMap = {};

  expenses
    .filter((e) => e.type === "expense")
    .forEach((e) => {
      expenseMap[e.title] =
        (expenseMap[e.title] || 0) + Number(e.amount);
    });

  const data = Object.keys(expenseMap).map((title) => ({
    title,
    amount: expenseMap[title],
  }));

  return (
    <div style={{ height: 350, marginTop: 40 }}>
      <h3 style={{ textAlign: "center" }}>Expense Breakdown</h3>

      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" />
          <YAxis />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Bar dataKey="amount" fill="#1e3c72" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
