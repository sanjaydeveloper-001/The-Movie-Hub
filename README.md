# 🎬 Movie Hub (Version 2)

**Movie Hub v2** is an advanced movie discovery web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
This version enhances the original Movie Hub by adding **user authentication, favorites, bookmarks, profile management**, and **secure password handling**.

---

## 🚀 Features

- 🔐 **User Authentication** – Register, login, and manage sessions securely.  
- ❤️ **Favorites System** – Save and manage your favorite movies.  
- 🔖 **Watchlist Movies** – Keep track of movies to watch later.  
- 👤 **User Profile Page** – View and update your personal details.  
- 🔄 **Password Management** – Change or reset password via email verification.  
- 🎞️ **Dynamic Movie Data** – All movie details fetched using the **TMDB API**.  
- 🌗 **Responsive Design** – Fully optimized for desktop and mobile.  
- ⚡ **Smooth UI/UX** – Built with React hooks, context, and Framer Motion for animations.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js  
- React Router DOM  
- Axios  
- Framer Motion  
- React Toastify  
- Tailwind CSS  

**Backend:**
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JWT Authentication  
- Nodemailer (for verification and password reset)

**External API:**
- [TMDB (The Movie Database) API](https://developer.themoviedb.org/)

---

## 📦 Installation and Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/sanjaydeveloper-001/The-Movie-Hub/
```

### 2️⃣ Install dependencies
#### For backend:
```bash
cd backend
npm install
```

#### For frontend:
```bash
cd ../frontend
npm install
```

### 3️⃣ Create `.env` files
Create a `.env` file in both **backend** and **frontend** folders.

**Backend .env example:**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_client_id
```

**Frontend .env example:**
```
VITE_TMDB_API=your_tmdb_api_key
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_AUTH_CLIENT_ID=your_client_id
VITE_EMAIL_API_KEY=your_abstract_email_api_key
```

### 4️⃣ Run the app
In one terminal:
```bash
cd backend
npm start
```

In another terminal:
```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Folder Structure

```
movie-hub-v2/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

---

## 🌐 Live Demo

 
💻 **GitHub Repository:** [https://github.com/sanjaydeveloper-001/The-Movie-Hub/](https://github.com/sanjaydeveloper-001/The-Movie-Hub/)

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to improve this project:
1. Fork the repo  
2. Create a new branch (`feature/your-feature-name`)  
3. Commit your changes  
4. Submit a pull request  

---

## 🧠 Lessons Learned

While building this version, I learned how to:
- Manage full-stack authentication using JWT.
- Handle secure password resets with OTP/email codes.
- Integrate frontend and backend cleanly using context and API endpoints.
- Improve UI transitions and responsive layout with React and Tailwind.

---

## 📧 Contact

Created by **Soldra Machan** – feel free to connect with me!  
🔗 [LinkedIn](https://www.linkedin.com/in/josanweb)  
📩 Email: josephstudent001@gmail.com

---

⭐ *If you found this project helpful, please give it a star on GitHub!*
