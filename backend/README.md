
# Backend Documentation

## 1. Introduction:
### Project Overview:
The backend of **`My Blog Space`** uses **`Hono`** for Cloudflare Workers and **`Prisma`** for database interactions. The project allows users to manage blog posts and user accounts, leveraging **Neon Accelerate** for optimized database connection pooling.
![backend_Architecture.png](images%2Fbackend_Architecture.png)
## 2. Getting Started:
### Installation:
Follow these steps to set up the project:
1. Clone the repository.
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. For deployment, use:
   ```bash
   npm run deploy
   ```

### Requirements:
- **Node.js**: Ensure that Node.js is installed.
- **Cloudflare Workers**: The project uses **Hono** optimized for Cloudflare Workers.
- **Prisma**: Used for database interaction with support for **Neon Accelerate** connection pooling.
- **Wrangler**: Used to manage Cloudflare Workers.
- **Neon Accelerate**: Database connection pooling for scalable and faster queries in serverless environments.

## 3. Database Schema:
### ER Diagrams:
The database schema includes two key models:
- **User**: For managing user accounts.
- **Post**: For managing blog posts.
![database_schema.png](images%2Fdatabase_schema.png)

### Table Definitions:
- **User**:
  - `id`: Primary key (UUID).
  - `email`: User's email (unique).
  - `salt`: For password hashing.
  - `name`: Optional user name.
  - `password`: Encrypted password.
  - `posts`: Relation to the Post table.

- **Post**:
  - `id`: Primary key (UUID).
  - `title`: Blog post title.
  - `content`: Blog post content.
  - `published`: Boolean flag for published status.
  - `authorId`: Foreign key referencing the **User** model.



### Neon Accelerate (Connection Pooling):
- **Neon Accelerate** is used in this project for efficient database connection pooling. It ensures optimal performance for serverless environments by maintaining persistent connections.
- The `DATABASE_URL` is set to a **Prisma connection pooling URL** in `wrangler.toml` for production:
  ```toml
  DATABASE_URL = "prisma://accelerate.prisma-data.net/?api_key=<api_key>"
  ```

## 4. API Definition:
### Endpoints:
- **Base Path**: `/api/v1`
- **Blog**:
  - **POST `/blog`**: Create a new blog post (Requires JWT Authentication).
  - **PUT `/blog`**: Update an existing blog post.
  - **GET `/blog/bulk`**: Fetch all blog posts.
  - **GET `/blog/:id`**: Fetch a specific blog post by ID.

- **User**:
  - **POST `/users/signup`**: Create a new user.
  - **POST `/users/signin`**: Sign in an existing user.

### Request/Response Formats:
- **User Signup Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```
- **User Signup Response**:
  ```json
  {
    "token": "Bearer <JWT token>"
  }
  ```

- **Blog Creation Request**:
  ```json
  {
    "title": "My First Blog",
    "content": "This is my first blog post.",
    "published": true
  }
  ```
- **Blog Creation Response**:
  ```json
  {
    "message": "Blog created",
    "id": "blogId"
  }
  ```

### Authentication:
The API uses **JWT** for authentication. To access protected routes like blog creation and updates, the JWT token must be included in the `Authorization` header.

## 5. Configuration Files:
### wrangler.toml:
The project uses **Wrangler** to deploy to Cloudflare Workers. Below is the configuration:
```toml
[vars]
DATABASE_URL = "prisma://accelerate.prisma-data.net/?api_key=<your_api_key>"
JWT_SECRET = "<your_jwt_secret>"
```
- The **DATABASE_URL** is set to use **Neon Accelerate** for connection pooling, which optimizes performance for serverless architectures.

### .env:
For local development, the environment variables in the `.env` file point to a PostgreSQL instance:
```bash
DATABASE_URL="postgresql://neondb_owner:5V4DdIFpKbYw@ep-frosty-band-a1diz3xr.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```
- The CLI uses this `DATABASE_URL` for migrations and local development.

---
