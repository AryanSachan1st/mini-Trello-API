# 📋 Custom Trello API

A **Trello-inspired RESTful API** built with **Node.js**, **Express.js**, and **MongoDB**. Users can register, create personal **projects**, and manage **tasks** within those projects — with full JWT-based authentication protecting all write operations.

---

## 🛠 Tech Stack

- **Node.js** + **Express.js v5**
- **MongoDB** + **Mongoose**
- **JWT** (Access & Refresh Tokens via HTTP-only cookies)
- **bcrypt** (password hashing)

---

## ⚙️ Setup

1. **Clone & install dependencies:**

   ```bash
   git clone https://github.com/your-username/Custom-Trello-API.git
   cd Custom-Trello-API/backend
   npm install
   ```

2. **Create a `.env` file in `backend/`:**

   ```env
   PORT=3003
   MONGODB_URI=your_mongodb_uri
   ACCESSTOKEN_SECRET=your_access_token_secret
   ACCESSTOKEN_EXPIRY=1d
   REFRESHTOKEN_SECRET=your_refresh_token_secret
   REFRESHTOKEN_EXPIRY=10d
   ```

3. **Start the dev server:**
   ```bash
   npm run dev
   # Server running at http://localhost:3003
   ```

---

## 📡 API Endpoints

Base URL: `http://localhost:3003/api/v1`

> **Auth:** Protected routes require a JWT passed as a cookie (`accessToken`) or via header: `Authorization: Bearer <token>`

### 👤 Users — `/api/v1/users`

| Method   | Endpoint         | Auth | Description        |
| -------- | ---------------- | ---- | ------------------ |
| `POST`   | `/register-user` | ❌   | Register a user    |
| `POST`   | `/login`         | ❌   | Login              |
| `POST`   | `/logout`        | ✅   | Logout             |
| `DELETE` | `/delete-user`   | ✅   | Delete own account |

### 📁 Projects — `/api/v1/projects`

| Method   | Endpoint          | Auth | Description          |
| -------- | ----------------- | ---- | -------------------- |
| `GET`    | `/`               | ❌   | Get all projects     |
| `POST`   | `/create-project` | ✅   | Create a new project |
| `GET`    | `/:projectId`     | ❌   | Get a single project |
| `PATCH`  | `/:projectId`     | ✅   | Update a project     |
| `DELETE` | `/:projectId`     | ✅   | Delete a project     |

### ✅ Tasks — `/api/v1/projects/:projectId/tasks`

> All task routes require authentication.

| Method   | Endpoint       | Description              |
| -------- | -------------- | ------------------------ |
| `POST`   | `/create-task` | Create a task in project |
| `PATCH`  | `/:taskId`     | Update a task            |
| `DELETE` | `/:taskId`     | Delete a task            |

---

## 🗂 Data Models

**Project**

- `title` (String, required) — unique per owner
- `desc` (String, optional)
- `tasks` (array of Task references)
- `owner` (String — username of creator)
- `completed` (Boolean, default: `false`)

**Task**

- `title` (String, optional)
- `content` (String, required)
- `completed` (Boolean, default: `false`)
- `project` (Project reference)

---

## 📁 Project Structure

```
backend/src/
├── controllers/    # Business logic (user, project, task)
├── db/             # MongoDB connection
├── middlerwares/   # JWT auth middleware
├── models/         # Mongoose schemas (User, Project, Task)
├── routes/         # Express routers
└── utils/          # ApiError, ApiResponse, AsyncHandler
```

---

## 📄 License

ISC
