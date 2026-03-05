import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaPiggyBank, FaEdit, FaTrash, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { GiTwoCoins } from "react-icons/gi";
import "../css/Expense.css";

export default function Expense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [expense, setExpense] = useState([]);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState("expense");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  const token = localStorage.getItem("token");

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "" }), 3000);
  };

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpense(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

  const addExpense = async (e) => {
    e.preventDefault();
    setAnimationType(type);
    setIsAnimating(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/add-expense`,
        { title, amount: Number(amount), category, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTimeout(() => {
        setIsAnimating(false);
        resetForm();
        fetchExpenses();
        showToast("Transaction Added!");
      }, 1500);
    } catch (err) {
      setIsAnimating(false);
      showToast("Error adding data", "error");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
      showToast("Record Deleted", "success");
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

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
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/expense/${editId}`,
        { title, amount: Number(amount), category, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditOpen(false);
      resetForm();
      fetchExpenses();
      showToast("Updated Successfully!");
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const resetForm = () => {
    setTitle(""); setAmount(""); setCategory(""); setType("expense"); setEditId(null);
  };

  return (
    <div className="expense-page">
      <div className="expense-form-card">
        <form onSubmit={addExpense}>
          <input className="custom-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="custom-input" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <input className="custom-input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
          <select className="custom-input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <button type="submit" className="add-btn-blue">Add Transaction</button>
        </form>
      </div>

      {/* HORIZONTAL SCROLL WRAPPER */}
      <div className="table-container-mobile">
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
            {expense.map((item) => (
              <tr key={item._id}>
                <td>{item.title}</td>
                <td className={item.type === 'income' ? 'text-green' : 'text-red'}>₹{item.amount}</td>
                <td>{item.category}</td>
                <td><span className={`badge ${item.type}`}>{item.type}</span></td>
                <td>
                  <div className="action-btns">
                    <button className="edit-link-btn" onClick={() => openEdit(item)}><FaEdit /></button>
                    <button className="delete-red-btn" onClick={() => deleteExpense(item._id)}><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PIGGY BANK ANIMATION */}
      {isAnimating && (
        <div className="animation-overlay">
          <div className="animation-stage">
            <FaPiggyBank className="main-pig" />
            <GiTwoCoins className={`pure-coin ${animationType === 'income' ? 'saving-in' : 'keeping-out'}`} />
            <p className="status-label">{animationType === 'income' ? 'SAVING...' : 'KEEPING OUT...'}</p>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="custom-toast-container">
          <div className={`custom-toast ${toast.type}`}>
            {toast.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Update Transaction</h3>
            <form onSubmit={updateExpense}>
              <input className="custom-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <input className="custom-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              <input className="custom-input" value={category} onChange={(e) => setCategory(e.target.value)} required />
              <select className="custom-input" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <div className="modal-actions">
                <button type="submit" className="update-btn">Update</button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}