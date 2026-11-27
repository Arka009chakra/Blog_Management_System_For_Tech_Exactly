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

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## 1. Start the backend

Open Terminal:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set these values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/blog_management
CLIENT_URL=http://localhost:3000
API_URL=http://localhost:5001
JWT_ACCESS_SECRET=your_long_random_access_secret
JWT_REFRESH_SECRET=your_different_long_random_refresh_secret
ADMIN_NAME=Site Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourStrongAdminPassword123!
```

Then run:

```bash
npm install
npm run dev
```

The backend starts at `http://localhost:5001`.

**Admin is created automatically.** You do not need to run a separate seed command. Sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` values you entered in `.env`.

## 2. Start the frontend

Open a second Terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

The frontend starts at `http://localhost:3000`.

If you already have `frontend/.env`, make sure it contains:

```env
REACT_APP_API_URL=http://localhost:5001/api/v1
```

## 3. Test the backend

Open this URL in your browser:

`http://localhost:5001/api/v1/health`

Expected response:

```json
{
  "status": "ok",
  "message": "Blog API is running"
}
```

## OAuth login (optional)

Email/password login works without OAuth setup.

To enable Google and Facebook login, create OAuth applications and add the credentials to `backend/.env`.

Callback URLs:

- Google: `http://localhost:5001/api/v1/auth/google/callback`
- Facebook: `http://localhost:5001/api/v1/auth/facebook/callback`

Set the matching `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` values in `.env`.

## Backend folder structure

```text
backend/
  server.js
  .env.example
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

Do not upload your real `.env` file or share your JWT secrets. The `.env` file is intentionally not included in this project archive; create it from `.env.example`.
