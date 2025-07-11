import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { token, setToken} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav>
            <Link to='/'>Home</Link>
            { token ? (
                <>
                    <Link to='/groups/create'>Create Group</Link>
                    <Link to='/groups'>Groups</Link>
                    <Link to='/add-expense'>Add Expense</Link>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                </>
            )}
        </nav>
    )
}

export default Navbar;