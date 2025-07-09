import React from "react";
import { useParams } from "react-router-dom";

const GroupDetailPage = () => {
    const { id } = useParams();

    return (
        <div>
            <h2>Group Details- {id}</h2>
            <p>Here you'll see expenses, balances, and people who owe each other</p>
        </div>
    )
}

export default GroupDetailPage;