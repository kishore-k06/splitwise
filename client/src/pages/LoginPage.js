import React from 'react';
import LoginForm from '../components/AuthForm/LoginForm';

const LoginPage = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card bg-dark text-light p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="text-center mb-4 text-success">Login to Splitwise</h2>
                <LoginForm />
            </div>
        </div>
    )
};

export default LoginPage;