import React from 'react';
import { Link } from 'react-router-dom';

const dummyGroups = [
    { _id1: "1", name: "Trip to Goa" },
    { _id1: "2", name: "Flatmates" },
];

const GroupListPage = () => {
    return (
        <div>
            <h2>Your Groups</h2>
            <ul>
                {dummyGroups.map((group) => (
                <li key={group._id1}>
                    <Link to={`/groups/${group._id1}`}>{group.name}</Link>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default GroupListPage;