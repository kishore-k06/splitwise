const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

//Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/groups', groupRoutes);  
app.use('/api/expenses', expenseRoutes); 

app.get('/',(req,res)=>{
    res.send('Splitwise API is running');
})

// MongoDB connection and server start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});