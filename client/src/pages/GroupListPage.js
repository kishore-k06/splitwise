import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const GroupListPage = () => {
    const { token } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleGroupClick = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

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
                        <li key={group.id}>
                            <h3>{group.name}</h3>
                            <p>Members: {group.members.map(m => m.name).join(', ')}</p>
                            <button onClick={() => handleGroupClick(group.id)}>View Group</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default GroupListPage;