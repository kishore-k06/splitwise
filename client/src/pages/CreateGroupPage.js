import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateGroupPage = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [memberEmails, setMemberEmails] = useState([]);
  const [error, setError] = useState("");

  const handleAddEmail = () => {
    if (emailInput && !memberEmails.includes(emailInput)) {
      setMemberEmails((prev) => [...prev, emailInput]);
      setEmailInput("");
    }
  };

  const handleRemoveEmail = (email) => {
    setMemberEmails((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName || memberEmails.length === 0) {
      setError("Group name and at least one member email are required.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/groups/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: groupName, members: memberEmails }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create group");
      } else {
        navigate("/groups");
      }
    } catch (error) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="container mt-5 text-light">
      <div className="card bg-dark border-light shadow-lg p-4">
        <h2 className="text-success mb-4">Create a New Expense Group</h2>
        <p className="text-secondary mb-4">
          Enter a group name and add the email addresses of your friends to create a shared group.
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label text-light">Enter Group Name:</label>
          <div className="form-floating mb-4">
            <input
              type="text"
              className="form-control bg-dark text-light border-secondary"
              id="groupName"
              placeholder="Trip to Goa"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
            <label htmlFor="groupName">Group Name (e.g., Goa Trip, Hostel Room)</label>
          </div>
        </div>

          <div className="mb-3">
            <label className="form-label text-light">Enter each member's email:</label>
            <div className="input-group">
              <input
                type="email"
                className="form-control bg-dark text-light border-secondary"
                placeholder="Enter member's email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleAddEmail}
              >
                Add
              </button>
            </div>
          </div>

          {memberEmails.length > 0 && (
            <div className="mb-4">
              <label className="form-label">Added Members:</label>
              <ul className="list-group">
                {memberEmails.map((email) => (
                  <li
                    key={email}
                    className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center border-secondary"
                  >
                    {email}
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit" className="btn btn-success w-100">
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;