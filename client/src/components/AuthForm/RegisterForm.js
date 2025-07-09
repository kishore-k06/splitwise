import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const RegisterForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                navigate('/login'); // Redirect to login page after registration
            }
            else {
                console.error('Registration failed:', data.message);
                alert(data.message); // Show error message to user
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type='text' name='name' placeholder='Name' value={formData.name} onChange={handleChange} required />
            <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} required />
            <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} required />
            <button type='submit'>Register</button>
        </form>
    )
}

export default RegisterForm;