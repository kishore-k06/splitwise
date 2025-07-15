import React, { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const GroupDetailPage = () => {
  const { token } = useContext(AuthContext);
  const { groupId } = useParams();

  const [groupExpenses, setGroupExpenses] = useState([]);
  const [groupBalances, setGroupBalances] = useState([]);
  const [settlements, setGroupSettlements] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedExpenseId, setSelectedExpenseId] = useState("");


  const fetchGroupDetails = useCallback(async () => {
    try {
      const res1 = await fetch(`http://localhost:5000/api/expenses/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data1 = await res1.json();
      setGroupExpenses(data1.expenses);

      const res2 = await fetch(`http://localhost:5000/api/groups/${groupId}/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data2 = await res2.json();
      setGroupBalances(data2.balance);

      const res3 = await fetch(`http://localhost:5000/api/groups/${groupId}/settlements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data3 = await res3.json();
      setGroupSettlements(data3.settlements);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  }, [groupId, token]);

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId, fetchGroupDetails]);

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        toast.error("Expense deleted");
        fetchGroupDetails();
      } else {
        toast.error(`Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleCommentChange = (expenseId, value) => {
    setCommentInputs((prev) => ({ ...prev, [expenseId]: value }));
  };

  const handleAddComment = async (e, expenseId) => {
    e.preventDefault();
    const commentText = commentInputs[expenseId];
    if (!commentText?.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${expenseId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });

      const data = await res.json();
      if (res.ok) {
        // update just that one expense's comments
        setGroupExpenses((prev) =>
          prev.map((exp) =>
            exp._id === expenseId ? { ...exp, comments: data.comments } : exp
          )
        );
        setCommentInputs((prev) => ({ ...prev, [expenseId]: "" }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <div className="container mt-5 text-light">
      <h2 className="text-success mb-4">Group Details</h2>

      {/* Expenses */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-header text-success">Expenses</div>
        <div className="card-body">
          {groupExpenses.length === 0 ? (
            <p className="text-light">No Expenses yet</p>
          ) : (
            <ul className="list-group">
              {groupExpenses.map((exp) => (
                <li key={exp._id} className="list-group-item bg-dark text-light border-secondary mb-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{exp.description}</strong> - ₹{exp.amount} paid by{" "}
                      <span className="text-info">{exp.paidBy.name}</span>
                    </div>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(exp._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Balances */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-header text-success">Group Balances</div>
        <div className="card-body">
          {groupBalances.length === 0 ? (
            <p className="text-light">No Balances yet</p>
          ) : (
            <ul className="list-group">
              {groupBalances.map((b) => (
                <li key={b.user.id} className="list-group-item bg-dark text-light border-secondary">
                  {b.user.name}: ₹{b.balance.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Settlements */}
      <div className="card bg-dark border-secondary mb-5">
        <div className="card-header text-success">Settlement Plan</div>
        <div className="card-body">
          {settlements.length === 0 ? (
            <p className="text-light">No Settlements yet</p>
          ) : (
            <ul className="list-group">
              {settlements.map((s, idx) => (
                <li key={idx} className="list-group-item bg-dark text-light border-secondary">
                  <span className="text-warning">{s.from}</span> pays ₹{s.amount.toFixed(2)} to{" "}
                  <span className="text-success">{s.to}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Group Comments Section */}
      <div className="card bg-dark border-secondary mb-5">
        <div className="card-header text-success">Group Comments</div>
        <div className="card-body">

          <div className="mb-3">
            <label className="form-label text-light">Select Expense:</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={selectedExpenseId}
              onChange={(e) => setSelectedExpenseId(e.target.value)}
            >
              <option value="">-- Choose an expense to comment --</option>
              {groupExpenses.map((exp) => (
                <option key={exp._id} value={exp._id}>
                  {exp.description} - ₹{exp.amount}
                </option>
              ))}
            </select>
          </div>

          {selectedExpenseId && (
            <>
              <ul className="list-group mb-3 text-light">
                {(groupExpenses.find(e => e._id === selectedExpenseId)?.comments || []).map((c, idx) => (
                  <li key={idx} className="list-group-item bg-dark text-light border-secondary">
                    <strong className="text-info">{c.user?.name}:</strong> {c.text}
                    <div className="text-light small">{new Date(c.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>

              <form className="d-flex" onSubmit={(e) => handleAddComment(e, selectedExpenseId)}>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary me-2"
                  placeholder="Write a comment (e.g., Paid via GPay)"
                  value={commentInputs[selectedExpenseId] || ""}
                  onChange={(e) => handleCommentChange(selectedExpenseId, e.target.value)}
                />
                <button type="submit" className="btn btn-success">Post</button>
              </form>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default GroupDetailPage;