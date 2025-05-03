# 📚 Book Search Engine

A full-stack MERN application refactored from a RESTful API to use **GraphQL** with **Apollo Server**. Users can search for books via the Google Books API, sign up or log in, and save their favorite reads to a personal library. Originally built as a challenge for the University of Denver Coding Bootcamp.
[Deployed Application](https://book-search-client.onrender.com)
[Screenshot](./client/src/assets/Screen%20Shot%202025-05-01%20at%2011.57.37%20PM.png)

---

## Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Usage Instructions](#-usage-instructions)
- [License](#-license)
- [Author](#-author)

---

## Tech Stack

- MongoDB + Mongoose ODM
- Express.js + Apollo Server
- React.js + Apollo Client
- GraphQL
- JSON Web Token (JWT) Auth
- Google Books API
- Deployed via Render + MongoDB Atlas

---

## Features

- 🔍 Search books via the Google Books API
- 📚 Save/unsave books to your user profile
- 🔐 Secure authentication with JWT
- 🧠 Uses GraphQL queries and mutations:
  - `me`, `login`, `addUser`, `saveBook`, `removeBook`
- 📦 Apollo Client manages state on the frontend
- 🚀 Deployed with Render and MongoDB Atlas

---

## Usage Instructions

1. Clone the repo  
   `git clone https://github.com/your-username/book-search-engine.git`
2. Navigate to the server and install dependencies  
   `cd server && npm install`
3. Navigate to the client and install dependencies  
   `cd ../client && npm install`
4. Set up environment variables in `.env`
5. Start the development server  
   From the root: `npm run develop`
6. Open the app in browser at `http://localhost:3000`
7. Use Apollo Sandbox or the frontend UI to interact

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Author

**Elli McKinley**  
Business Systems Specialist | Developer-in-Training | River Rat 🛶  
[GitHub](https://github.com/ellimckinley) | [LinkedIn](https://linkedin.com/in/ellimckinley)

---
