# MERN Stack Blog Application

A full-stack blog application built with MongoDB, Express.js, React.js, and Node.js.

## Features

- ✅ User authentication (register, login, JWT)
- ✅ Create, read, update, delete blog posts
- ✅ Category management
- ✅ Image uploads for featured images
- ✅ Comments on posts
- ✅ Search and filter functionality
- ✅ Pagination
- ✅ Protected routes
- ✅ Responsive design

## Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Axios
- Vite

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- Express Validator
- Bcryptjs

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone 
cd mern-blog
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables

Create `server/.env`:
```env
PORT=
MONGODB_URI=
JWT_SECRET=
```

Create `client/.env`:
```env
VITE_API_URL=
```

5. Start MongoDB (if running locally)
```bash
mongod
```

6. Start the server
```bash
cd server
npm run dev
```

7. Start the client (in a new terminal)
```bash
cd client
npm run dev
```

8. Open http://localhost:3000 in your browser

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts

- `GET /api/posts` - Get all posts (with pagination, search, filter)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/comments` - Add comment (protected)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (protected)


## Advanced Features Implemented

1. **User Authentication**: Complete JWT-based authentication system
2. **Image Uploads**: Featured images for blog posts using Multer
3. **Pagination**: Server-side pagination for post lists
4. **Search & Filter**: Search by title/content and filter by category
5. **Comments System**: Users can comment on posts

## Future Enhancements

- Rich text editor for post content
- User profiles and avatars
- Like/favorite posts
- Social media sharing
- Email notifications
- Admin dashboard

## License

MIT
```

---

## Quick Start Commands

### Terminal 1 (Server):
```bash
cd server
npm install
npm start
```

### Terminal 2 (Client):
```bash
cd client
npm install
npm run dev
```
