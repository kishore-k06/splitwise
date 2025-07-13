import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GroupListPage = () => {
    const { token } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/groups', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if(response.ok) {
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
                        <div key={group._id} className="col-md-6 mb-4">
                            <div className="card bg-dark border-secondary shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title text-success">{group.name}</h5>
                                    <p className="card-text text-light">
                                        Created on: {new Date(group.createdAt).toLocaleDateString()}
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
}

export default GroupListPage;