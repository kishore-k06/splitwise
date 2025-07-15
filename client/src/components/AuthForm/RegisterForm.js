import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const checkRules = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  });

  const rules = checkRules(formData.password);

  const validatePassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return regex.test(password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if(!validatePassword(formData.password)) {
      window.alert('Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.');
      return;
    }

    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          className="form-control bg-secondary text-light border-0"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className="form-control bg-secondary text-light border-0"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Password</label>
        <input
          type="password"
          name="password"
          className="form-control bg-secondary text-light border-0"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br></br>
        <p className="mt-2 mb-1 fw-semibold text-light">Password must follow these rules:</p>
        <ul className="mt-2 list-unstyled">
          <li className={`text-${rules.length ? 'success' : 'danger'}`}>
            {rules.length ? '✔' : '✖'} At least 8 characters
          </li>
          <li className={`text-${rules.uppercase ? 'success' : 'danger'}`}>
            {rules.uppercase ? '✔' : '✖'} At least one uppercase letter
          </li>
          <li className={`text-${rules.digit ? 'success' : 'danger'}`}>
            {rules.digit ? '✔' : '✖'} At least one number
          </li>
          <li className={`text-${rules.special ? 'success' : 'danger'}`}>
            {rules.special ? '✔' : '✖'} At least one special character
          </li>
        </ul>
      </div>

      <button type="submit" className="btn btn-success w-100">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
