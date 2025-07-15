import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const AddExpensePage = () => {
  const { token } = useContext(AuthContext);

  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [members, setMembers] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);

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
        // console.log("Fetched Members:", data.members);
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
          splitBetween,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Expense added successfully!");
        setDescription("");
        setAmount("");
        setPaidBy("");
        setSelectedGroupId("");
        setSplitBetween([]);
      } else {
        toast.error(`Failed to add expense: ${data.message}`);
      }
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  return (
    <div className="container mt-5 text-light">
      <div className="card bg-dark border-secondary shadow-lg p-4">
        <h2 className="text-success mb-3">Add New Expense</h2>
        <form onSubmit={handleSubmit}>

          {/* Group Selection */}
          <div className="mb-3">
            <label className="form-label">Select Group:</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              required
            >
              <option value="">-- Select Group --</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              id="description"
              placeholder="Expense Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <label htmlFor="description">Description</label>
          </div>

          {/* Amount */}
          <div className="form-floating mb-3">
            <input
              type="number"
              className="form-control bg-dark text-light border-secondary"
              id="amount"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <label htmlFor="amount">Amount</label>
          </div>

          {/* Paid By */}
          <div className="mb-3">
            <label className="form-label text-light">Paid By:</label>
            <select
              className="form-select bg-dark text-light border-secondary"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              required
            >
              <option value="">-- Select Member --</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Split Between */}
          <div className="mb-4">
            <label className="form-label text-light">Split Between:</label>
            <div className="row">
              {members.map((member) => (
                <div className="form-check col-md-4" key={member._id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`member-${member._id}`}
                    value={member._id}
                    checked={splitBetween.includes(member._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSplitBetween((prev) => [...prev, member._id]);
                      } else {
                        setSplitBetween((prev) => prev.filter((id) => id !== member._id));
                      }
                    }}
                  />
                  <label className="form-check-label text-light" htmlFor={`member-${member._id}`}>
                    {member.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-success w-100">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpensePage;
