import React from 'react';

const HomePage = () => {
    return (
         <div className="container-fluid min-vh-100 bg-dark text-light d-flex align-items-center justify-content-center">
            <div className="text-center p-5 rounded-4 shadow" style={{ backgroundColor: '#1e1e2f' }}>
                <h1 className="mb-4" style={{ color: '#00d8a7' }}>Welcome to Splitwise</h1>
                <p className="lead" style={{ color: '#cfcfcf' }}>
                    Track shared expenses with your friends and groups easily
                </p>
            </div>
        </div>
    )
}

export default HomePage;