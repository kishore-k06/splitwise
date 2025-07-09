import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                navigate('/groups'); // Redirect to groups page after login
            }
            else {
                console.error('Login failed:', data.message);
                alert(data.message); // Show error message to user
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
            <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />
            <button type='submit'>Login</button>
        </form>
    )
}

export default LoginForm;