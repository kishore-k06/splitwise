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
        <div>
            <h2>Your Groups</h2>
            {loading ? (
                <p>Loading...</p>
            ) : groups.length === 0 ? (
                <p>No Groups Found.</p>
            ) : (
                <ul>
                    {groups.map(group => (
                        <div key={group._id}>
                            <Link to={`/groups/${group._id}`}>{group.name} - View Group</Link>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default GroupListPage;