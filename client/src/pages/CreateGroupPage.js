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
            setMemberEmails(prev => [...prev, emailInput]);
            setEmailInput("");
        }
    };

    const handleRemoveEmail = (email) => {
        setMemberEmails(prev => prev.filter(e => e !== email));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName || memberEmails.length === 0) {
            setError("Group name and at least one member email are required.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/groups/create", {
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
                navigate("/groups"); // redirect to group list
            }
        } catch (error) {
            setError("Something went wrong.");
        }
    };

    return (
        <div>
            <h2>Create Group</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Group Name:</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Add Member Email:</label>
                    <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <button type="button" onClick={handleAddEmail}>Add</button>
                </div>
                <ul>
                    {memberEmails.map(email => (
                        <li key={email}>
                            {email}
                            <button type="button" onClick={() => handleRemoveEmail(email)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <button type="submit">Create Group</button>
            </form>
        </div>
    );
};

export default CreateGroupPage;
