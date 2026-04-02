# 📚 Blog API - Full Stack Application

A modern, full-stack blog application built with **Node.js + React** featuring user authentication, post management, commenting system, and admin controls.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Node Version](https://img.shields.io/badge/node-18%2B-brightgreen)
![React Version](https://img.shields.io/badge/react-19-blue)

---

## 🎯 Features

### 🔐 Authentication & Authorization
- User registration and login with JWT tokens
- Role-based access control (USER, ADMIN, EDITOR)
- Protected routes and endpoints
- Token-based session management

### 📝 Blog Features
- Create, read, update, delete posts
- Rich post content with text formatting
- Comment system on posts
- User profiles with post history
- Published/unpublished post status

### 👥 User Management
- User registration and profile management
- Admin dashboard to manage users
- User profile viewing with all their posts
- Role-based permissions (Admin, Editor, User)

### 🛡️ Security
- Password hashing with bcryptjs
- JWT authentication
- Input validation and sanitization
- Error handling and logging

---

## 📋 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Prisma ORM** - Database abstraction
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest + SuperTest** - Testing

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **React Router v7** - Client-side routing

---

## 📁 Project Structure

```
blog-api/
├── back-end/                    ← Node.js API
│   ├── __tests__/              ← Test files
│   ├── controllers/            ← Business logic
│   ├── routes/                 ← API endpoints
│   ├── middleware/             ← Express middleware
│   ├── db/                     ← Database queries
│   ├── lib/                    ← Utilities
│   ├── prisma/                 ← Database schema
│   ├── app.js                  ← Express app
│   ├── package.json
│   ├── .env                    ← Environment variables
│   ├── jest.config.js
│   └── README.md              ← Backend setup guide (not done yet)
│
├── front-end/                  ← React application
│   ├── src/
│   │   ├── components/        ← React components
│   │   ├── pages/             ← Page components
│   │   ├── services/          ← API calls
│   │   ├── hooks/             ← Custom hooks
│   │   ├── utils/             ← Helper functions
│   │   ├── router/            ← Route configuration
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.local             ← Environment variables
│   └── README.md              ← Frontend setup guide (not done yet)
│
├── .gitignore
└── README.md                  ← This file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**
- **PostgreSQL** database
- **Git** for version control

### Installation & Running

#### 1️⃣ Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd back-end

# Install dependencies
npm install

# Create .env file with database credentials
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
# Server runs on http://localhost:3000
```

#### 2️⃣ Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd front-end

# Install dependencies
npm install

# Create .env.local file with API URLs
cp .env.example .env.local

# Start development server
npm run dev
# App runs on http://localhost:5173
```

#### 3️⃣ Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```
---

## 🔑 Default Environment Variables

### Backend (.env)
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/blog
SECRET_KEY=your-secret-key-here
NODE_ENV=development
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_POSTS_URL=http://localhost:3000/posts
VITE_LOGIN_URL=http://localhost:3000/login
VITE_USERS_URL=http://localhost:3000/users
VITE_COMMENTS_URL=http://localhost:3000/comments
```

---

## 🧪 Testing

### Backend Tests

```bash
cd back-end

# Run all tests
npm test

# Run tests in watch mode (rerun on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**
- ✅ Authentication (login, registration)
- ✅ Posts (CRUD operations)
- ✅ Users (list, details, update)
- ✅ Comments (create, validation)
- ✅ Protected routes
- ✅ Error handling

---

## 🔍 API Endpoints

### Authentication
```
POST   /login                    → User login
POST   /users/create             → User registration
GET    /users                    → Get all users (paginated)
GET    /users/:userId            → Get user details
PUT    /users/:userId            → Update user
DELETE /users/:userId            → Delete user
```

### Posts
```
GET    /posts                    → Get all posts
GET    /posts/:postId            → Get single post
POST   /posts                    → Create post
PUT    /posts/:postId            → Update post
DELETE /posts/:postId            → Delete post
```

### Comments
```
GET    /comments                 → Get all comments
POST   /comments                 → Create comment
PUT    /comments/:commentId      → Update comment
DELETE /comments/:commentId      → Delete comment
```

For detailed documentation, see [API.md](./docs/API.md)

---

## 👥 User Roles & Permissions

### USER (Default)
- ✅ Read all posts
- ✅ Create own posts
- ✅ Edit own posts
- ✅ Delete own posts
- ✅ Comment on posts
- ✅ View user profiles

### EDITOR
- ✅ All USER permissions
- ✅ Edit any post
- ✅ Moderate comments

### ADMIN
- ✅ All EDITOR permissions
- ✅ Delete any post
- ✅ Manage all users
- ✅ Access admin dashboard
- ✅ View usage statistics

---

## 🐛 Common Issues & Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Reset database
npx prisma migrate reset

# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Frontend won't connect to backend
```
❌ CORS error?
→ Check backend is running on port 3000
→ Check .env.local has correct API_BASE_URL

❌ Token not persisting?
→ Check localStorage is enabled in browser
→ Check token is being saved after login

❌ API calls failing?
→ Check Authorization header format: "Bearer TOKEN"
→ Check token hasn't expired
```

### Database connection issues
```bash
# Test PostgreSQL connection
psql -U your_user -h localhost -d blog

# Check DATABASE_URL in .env
# Format: postgresql://user:password@host:port/database

# Run migrations again
npx prisma migrate dev
```

---

## 📚 Project Statistics

- **Backend Files:** ~40 files
- **Frontend Files:** ~20 files
- **Test Coverage:** 70%+ for critical paths
- **API Endpoints:** 13+ endpoints
- **Database Tables:** 3 (users, posts, comments)
- **Response Time:** <200ms for most endpoints

---

## 🤝 Contributing

This is a learning project. To contribute:

1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Create a Pull Request

---

## 📝 Git Workflow

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd blog-api

# Create .env files (don't commit these!)
cp back-end/.env.example back-end/.env
cp front-end/.env.example front-end/.env.local

# Install and run
cd back-end && npm install
cd ../front-end && npm install
```

### Standard Development
```bash
# Create feature branch
git checkout -b feature/feature-name

# After changes
git add .
git commit -m "Descriptive commit message"
git push origin feature/feature-name

# Create Pull Request on GitHub/GitLab
```

### Files to Never Commit
```
.env files
node_modules/
dist/
.DS_Store
.env.local (frontend)
.env (backend)
```

See `.gitignore` for complete list.

---

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change `SECRET_KEY` to a strong random string
- [ ] Use HTTPS for all API calls
- [ ] Enable CORS only for your domain
- [ ] Set strong database password
- [ ] Enable environment-specific configuration
- [ ] Run security tests: `npm audit`
- [ ] Set up rate limiting on API
- [ ] Enable logging and monitoring
- [ ] Use environment variables for all secrets
- [ ] Test all authentication flows

---

## 🎓 Learning Resources

This project covers:
- Full-stack JavaScript development
- REST API design
- JWT authentication
- Database design with Prisma
- React component architecture
- Responsive UI with Material-UI
- Testing with Jest
- Git workflow and version control

---

## 🗺️ Roadmap

### Phase 1 (Current) ✅
- ✅ User authentication
- ✅ CRUD operations
- ✅ Role-based access
- ✅ API testing

### Phase 2 (Planned)
- 📌 Post publishing workflow
- 📌 Comment moderation
- 📌 User notifications
- 📌 Search functionality

### Phase 3 (Future)
- 🔮 Real-time comments (WebSocket)
- 🔮 Post categories/tags
- 🔮 User followers
- 🔮 Analytics dashboard

---

## ✨ Key Features Showcase

### Authentication System
Users can register and login securely with JWT tokens stored in localStorage. Tokens include user role for authorization on protected routes.

### Blog Management
Create rich blog posts with title and content. Posts are auto-linked to the creator. Only authors can edit/delete their own posts (or admins).

### Comment System
Users can comment on published posts. Comments are validated and stored with user references for accountability.

### Admin Dashboard
Admins have access to a dashboard showing all users. They can manage permissions and view user details.

### User Profiles
Each user has a profile page showing their information and all their published posts in one convenient location.

---

### Last Updated
April 2026
