import { useEffect, useState ,useCallback } from "react";
import axios from "axios";
import "../css/Expense.css";


export default function Expense() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("expense");
    const [expense, setExpense] = useState([]);

    // EDIT STATE
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("token");

    // ================= FETCH =================
    const fetchExpenses = useCallback(async () => {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setExpense(res.data);
    },[]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    // ================= ADD =================
    const addExpense = async (e) => {
        e.preventDefault();
        await axios.post(
            `${import.meta.env.VITE_API_URL}/add-expense`,
            { title, amount: Number(amount), category, type },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        resetForm();
        fetchExpenses();
    };

    // ================= DELETE =================
    const deleteExpense = async (id) => {
        await axios.delete(`${import.meta.env.VITE_API_URL}/expense/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchExpenses();
    };

    // ================= EDIT =================
    const openEdit = (item) => {
        setEditId(item._id);
        setTitle(item.title);
        setAmount(item.amount);
        setCategory(item.category);
        setType(item.type);
        setIsEditOpen(true);
    };

    const updateExpense = async (e) => {
        e.preventDefault();
        await axios.put(
            `${import.meta.env.VITE_API_URL}/expense/${editId}`,
            { title, amount: Number(amount), category, type },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsEditOpen(false);
        resetForm();
        fetchExpenses();
    };

    const resetForm = () => {
        setTitle("");
        setAmount("");
        setCategory("");
        setType("expense");
        setEditId(null);
    };


    return (
        <div className="expense-page">
            <h2>Transactions</h2>
            <p style={{ color: "#777", marginBottom: "20px" }}>
                Manage your income and expenses easily.
            </p>

            {/* <h2>Expense Tracker</h2> */}

            {/* ========== ADD FORM ========== */}
            <form className="expense-form" onSubmit={addExpense}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
                <input
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>

                <button className="add-btn">Add Expense</button>
            </form>

            {/* ========== TABLE ========== */}
            <div className="expense-table-wrapper">
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Category</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    No expenses found
                                </td>
                            </tr>
                        ) : (
                            expense.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.title}</td>
                                    <td>₹{item.amount}</td>
                                    <td>{item.category}</td>
                                    <td>
                                        <span className={`badge ${item.type}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="action-btns">
                                        <button
                                            className="edit-btn"
                                            onClick={() => openEdit(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteExpense(item._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ========== EDIT MODAL ========== */}
            {isEditOpen && (
                <div className="modal-overlay">
                    <form className="modal-box" onSubmit={updateExpense}>
                        <h3>Edit Expense</h3>

                        <input value={title} onChange={(e) => setTitle(e.target.value)} />
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>

                        <div className="modal-actions">
                            <button className="update-btn">Update</button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
