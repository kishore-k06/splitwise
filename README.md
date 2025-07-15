# 💸 Splitwise

A full-stack Splitwise application built with **MongoDB, Express, React, and Node.js**. This app allows users to create groups, add shared expenses, view balances, and settle them fairly.

🚀 **Live Demo**  
Frontend: [https://splitwise-chi-ten.vercel.app/] 
Backend: [https://splitwise-backend-hm02.onrender.com/]

---

## 📦 Features

### 👥 Groups
- Create new groups
- Add members using email
- View all groups a user is part of
- Delete groups (only by creator)

### 💰 Expenses
- Add expenses with amount, description, and payer
- Automatically split amounts among selected members
- See a list of expenses per group
- Delete an expense (only by the user who paid)

### 📊 Balances & Settlements
- Greedy algorithm to compute: 
    - Real-time group balances
    - Automated settlement plan to settle dues optimally

### 💬 Comments
- Members can comment under each expense
- Useful for notes like “Paid via GPay”
- Shows user name and timestamp

### 🧑‍💻 Auth
- JWT-based login and register
- Password validation on registration

### 🎨 UI/UX
- Bootstrap dark theme with modern responsive layout
- Clean forms with floating labels and placeholder hints
- Three-dots dropdown for deleting groups

---

## 🛠️ Tech Stack

- **Frontend**: React, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT, Bcrypt.js 
- **Tools**: Postman, Git, React-Toastify
- **Deployment**:  
  - Frontend: [Vercel](https://vercel.com)  
  - Backend: [Render](https://render.com)

---