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
        <div>
            <h2>Group Details</h2>
            <h3>Expenses</h3>
            {!groupExpenses || groupExpenses.length === 0 ? (
                <p>No Expenses yet</p>
            ) : (
                <ul>
                    {groupExpenses.map(exp => (
                        <li key={exp._id}>
                            <strong>{exp.description}</strong> - ₹{exp.amount} paid by {exp.paidBy.name}
                            <button onClick={() => handleDelete(exp._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            <h3>Group Balance</h3>
            {!groupBalances || groupBalances.length === 0 ? (
                <p>No Balances yet</p>
            ) : (
                <ul>
                    {groupBalances.map(b => (
                        <li key={b.user.id}>
                            {b.user.name}: ₹{b.balance.toFixed(2)}
                        </li>
                    ))}
                </ul>
            )}

            <h3>Settlement Plan</h3>
            {!settlements || settlements.length === 0 ? (
                <p>No Settlements yet</p>
            ) : (
                <ul>
                    {settlements.map((s, index) => (
                        <li key={index}>
                            {s.from} pays ₹{s.amount.toFixed(2)} to {s.to}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}

export default GroupDetailPage;