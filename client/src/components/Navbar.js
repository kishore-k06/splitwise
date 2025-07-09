import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <Link to='/'>Home</Link>
            <Link to='/groups'>Groups</Link>
            <Link to='/add-expense'>Add Expense</Link>
        </nav>
    )
}

export default Navbar;