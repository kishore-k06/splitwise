import React from 'react';
import RegisterForm from '../components/AuthForm/RegisterForm';

const RegisterPage = () => {
    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card bg-dark text-light p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="text-center mb-4 text-success">Register for Splitwise</h2>
                <RegisterForm />
            </div>
        </div>
    );
}

export default RegisterPage;