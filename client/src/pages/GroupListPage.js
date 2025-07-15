import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const GroupListPage = () => {
    const { token } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menuOpenId, setMenuOpenId] = useState(null); // Track which menu is open

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/groups`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setGroups(data.groups);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching groups:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [token]);

    const handleDeleteGroup = async (groupId) => {
        if (!window.confirm("Are you sure you want to delete this group?")) return;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/groups/${groupId}/delete`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (res.ok) {
                setGroups(prev => prev.filter(group => group._id !== groupId));
                toast.success("Group deleted successfully");
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error("Failed to delete group", err);
        }
    };

    return (
        <div className="container mt-5 text-light">
            <h2 className="text-success mb-4">Your Groups</h2>

            {loading ? (
                <div className="text-secondary">Loading...</div>
            ) : groups.length === 0 ? (
                <div className="alert alert-warning">No groups found. Create one to get started!</div>
            ) : (
                <div className="row">
                    {groups.map(group => (
                        <div key={group._id} className="col-md-6 mb-4 position-relative">
                            <div className="card bg-dark border-secondary shadow-sm h-100">
                                <div className="card-body position-relative">
                                    {/* Three Dots Menu */}
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <button
                                            className="btn btn-sm btn-outline-light rounded-circle"
                                            onClick={() =>
                                                setMenuOpenId(prev =>
                                                    prev === group._id ? null : group._id
                                                )
                                            }
                                        >
                                            <strong>&#8942;</strong>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {menuOpenId === group._id && (
                                            <div className="dropdown-menu show bg-dark border border-secondary mt-2 p-2">
                                                <button
                                                    className="dropdown-item text-danger bg-dark"
                                                    onClick={() => handleDeleteGroup(group._id)}
                                                    onMouseEnter={(e) => {
                                                        e.target.classList.remove("text-danger");
                                                        e.target.classList.add("bg-danger", "text-light");
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.classList.add("text-danger");
                                                        e.target.classList.remove("bg-danger", "text-light");
                                                    }}
                                                >
                                                    Delete Group
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <h5 className="card-title text-success">{group.name}</h5>
                                    <p className="card-text text-light">
                                        Created on:{" "}
                                        {new Date(group.createdAt).toLocaleDateString()}
                                    </p>
                                    <Link to={`/groups/${group._id}`} className="btn btn-outline-success">
                                        View Group
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GroupListPage;
