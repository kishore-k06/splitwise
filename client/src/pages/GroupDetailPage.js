import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const GroupDetailPage = () => {
    const { token } = useContext(AuthContext);
    const { groupId } = useParams();
    
    const [groupExpenses, setGroupExpenses] = useState([]);
    const [groupBalances, setGroupBalances] = useState([]);
    const [settlements, setGroupSettlements] = useState([]);

    const fetchGroupDetails = async () => {
        try {
            const res1 = await fetch(`http://localhost:5000/api/expenses/${groupId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data1 = await res1.json();
            setGroupExpenses(data1.expenses);

            const res2 = await fetch(`http://localhost:5000/api/groups/${groupId}/balance`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data2 = await res2.json();
            setGroupBalances(data2.balance);

            const res3 = await fetch(`http://localhost:5000/api/groups/${groupId}/settlements`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data3 = await res3.json();
            setGroupSettlements(data3.settlements);
        } catch (error) {
            console.error("Error fetching group details:", error);
        }
    };
    useEffect(() => {
        if (groupId) {
            fetchGroupDetails();
        }
    });

    const handleDelete = async (expenseId) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
            });

            const data = await res.json();
            if (res.ok) {
            alert("Expense deleted");
            // Re-fetch group expenses after delete
            await fetchGroupDetails();
            } else {
            alert(`Failed to delete: ${data.message}`);
            }
        } catch (err) {
            console.error("Delete error", err);
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
            <p className="text-muted">No Expenses yet</p>
          ) : (
            <ul className="list-group">
              {groupExpenses.map((exp) => (
                <li
                  key={exp._id}
                  className="list-group-item d-flex justify-content-between align-items-center bg-dark text-light border-secondary"
                >
                  <div>
                    <strong>{exp.description}</strong> - ₹{exp.amount} paid by{" "}
                    <span className="text-info">{exp.paidBy.name}</span>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(exp._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Group Balance */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-header text-success">Group Balances</div>
        <div className="card-body">
          {groupBalances.length === 0 ? (
            <p className="text-muted">No Balances yet</p>
          ) : (
            <ul className="list-group">
              {groupBalances.map((b) => (
                <li
                  key={b.user.id}
                  className="list-group-item bg-dark text-light border-secondary"
                >
                  {b.user.name}: ₹{b.balance.toFixed(2)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Settlements */}
      <div className="card bg-dark border-secondary mb-4">
        <div className="card-header text-success">Settlement Plan</div>
        <div className="card-body">
          {settlements.length === 0 ? (
            <p className="text-muted">No Settlements yet</p>
          ) : (
            <ul className="list-group">
              {settlements.map((s, index) => (
                <li
                  key={index}
                  className="list-group-item bg-dark text-light border-secondary"
                >
                  <span className="text-warning">{s.from}</span> pays ₹
                  {s.amount.toFixed(2)} to{" "}
                  <span className="text-success">{s.to}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupDetailPage;