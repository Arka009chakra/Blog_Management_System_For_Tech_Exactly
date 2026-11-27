# Blog Management System

The original React design is kept. The backend has been simplified into basic Express, MongoDB, controller, route, model and middleware files.

## Features

- Register, login and logout
- JWT access token and refresh token
- Password hashing with bcrypt
- Google and Facebook OAuth (optional)
- User and admin roles
- Create, read, update and delete blog posts
- Unique slug for every post (same title can have different slugs)
- Draft and published posts
- Search, category, tag and pagination
- Add, edit and delete comments
- Admin dashboard, user management, post management and comment management
- Activity history
- Authentication rate limiting
- Admin account created automatically when the backend starts

# Required Setup

PORT=5001
NODE_ENV=development
MONGO_URI=Your_MongoDB_Connection_String
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5001

# JWT Configuration

JWT_ACCESS_SECRET=Your_Access_Token_Secret
JWT_REFRESH_SECRET=Your_Refresh_Token_Secret
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

# OAuth Credentials

GOOGLE_CLIENT_ID=Your_Google_Client_ID
GOOGLE_CLIENT_SECRET=Your_Google_Client_Secret
FACEBOOK_APP_ID=Your_Facebook_App_ID
FACEBOOK_APP_SECRET=Your_Facebook_App_Secret

# Backend

cd backend
npm install
npm start

# Frontend

cd frontend
npm install
npm start

## Backend folder structure

```text
backend/
  server.js
  .env
  package.json
  src/
    app.js
    config/
      db.js
      passport.js
    models/
      User.js
      Post.js
      Comment.js
      Activity.js
    controllers/
      authController.js
      postController.js
      commentController.js
      adminController.js
    routes/
      authRoutes.js
      postRoutes.js
      commentRoutes.js
      adminRoutes.js
    middleware/
      authMiddleware.js
      validate.js
      errorMiddleware.js
```
