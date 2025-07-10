import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AddExpensePage = () => {
  const { token } = useContext(AuthContext);

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState([]);
  const [paidBy, setPaidBy] = useState("");

  // Fetch all groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/groups", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setGroups(data.groups || []);
      } catch (error) {
        console.error("Failed to fetch groups", error);
      }
    };

    fetchGroups();
  }, [token]);

  // Fetch group members when group changes
  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedGroupId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/groups/${selectedGroupId}/members`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log("Fetched Members:", data.members);
        setMembers(data.members || []);
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };

    fetchMembers();
  }, [selectedGroupId, token]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/expenses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupId: selectedGroupId,
          description,
          amount: parseFloat(amount),
          paidBy,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Expense added successfully!");
        setDescription("");
        setAmount("");
        setPaidBy("");
        setSelectedGroupId("");
      } else {
        alert(`Failed to add expense: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group:</label>
          <select value={selectedGroupId} onChange={(e) => setSelectedGroupId(e.target.value)} required>
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Paid By:</label>
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)} required>
            <option value="">Select User</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpensePage;
