# Smart To-Do

Smart To-Do is a full-stack productivity app that helps you manage your tasks efficiently. It features a modern UI, persistent storage with MongoDB, and a RESTful API for CRUD operations.

## Features

- Add, edit, complete, and delete tasks
- Responsive and modern design
- Persistent storage using MongoDB
- RESTful API built with Express and Mongoose

## Project Structure

```
smart-to-do/
  client/
    index.html
    script.js
    style.css
  server/
    .env
    package.json
    server.js
    config/
      db.js
    models/
      Task.js
    routes/
      taskRoutes.js
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB

### Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd smart-to-do/server
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   Edit `server/.env` if needed:
   ```
   MONGO_URI=mongodb://localhost:27017/smarttodo
   PORT=5500
   ```

4. **Start MongoDB** (if not already running):
   ```sh
   mongod
   ```

5. **Start the server:**
   ```sh
   npm start
   ```

6. **Open the app:**
   Visit [http://localhost:5500](http://localhost:5500) in your browser.

## API Endpoints

- `GET /api/tasks` — Get all tasks
- `POST /api/tasks` — Create a new task
- `PUT /api/tasks/:id` — Update a task
- `DELETE /api/tasks/:id` — Delete a task

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express, Mongoose
- Database: MongoDB

## License

MIT

---

Enjoy being productive with Smart To-Do!