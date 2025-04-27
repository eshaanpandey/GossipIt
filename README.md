# Real-Time Chat Application

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO. This app allows users to join chat rooms, send messages, and see real-time updates.

## 🚀 Live Demo

Visit the application live:

👉 [GossipIt](https://gossipit.netlify.app/)

## 🛠️ Setup Instructions

To run this project locally:

### 1. Clone the repository

```bash
git clone https://github.com/eshaanpandey/GossipIt.git
cd GossipIt
```

### 2. Install dependencies for the backend

```bash
cd server
npm install
```

### 3. Install dependencies for the frontend

```bash
cd ../client
npm install
```

### 4. Set up environment variables

Create a .env file in the server directory and add the following:

```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 5. Start the backend server

```bash
cd ../server
npm start
```

### 6. Start the frontend development server

```bash
cd ../client
npm start
```

The application will be running at http://localhost:5173.

### 📌 Notes

Ensure you have Node.js and npm installed.

Replace your_mongodb_connection_string with your actual MongoDB URI.

The frontend and backend should be run concurrently for full functionality.

## ✨ Features

- **Real-Time Messaging**: Instant message delivery using Socket.IO.

- **Persistent Chat History**: Messages are stored in MongoDB and persist across sessions.

- **Responsive Design**: Built with React and styled using TailwindCSS for a mobile-friendly interface.

- **User-Friendly Interface**: Smooth animations and transitions powered by Framer Motion.

## Technologies Used

- **Socket.IO**: For enabling real-time bidirectional event-based communication.

- **MongoDB**: For providing a NoSQL database solution.

- **React**: For building the user interface.

- **TailwindCSS**: For utility-first CSS styling.

- **Framer Motion**: For animations and transitions.

## Screenshots

Home Page:

![Home](/client/public/assets/Home.png)
