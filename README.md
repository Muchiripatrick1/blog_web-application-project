# Blog Application 

Here's the updated `README.md` to reflect the use of **Redis** for session storage:

---

# **Blog Platform**

A feature-rich blogging platform built for content creators and readers. Users can create, edit, and share posts, while readers can interact through comments and replies.

---

## **Features**

### **User Functionality**
- **Account Management**:
  - Create an account.
  - Log in and log out securely using **Passport.js** with **Redis** for session storage.
- **Post Management**:
  - Create blog posts with the following fields:
    - **Title**
    - **Slug**
    - **Summary**
    - **Body**
    - **Featuring Image**
  - Edit and delete your posts.
- **Interactive Comments**:
  - Leave comments on blog posts.
  - Reply to existing comments.

### **Technology Stack**
- **Frontend**: JavaScript using **React.js** with **Next.js** framework written in **TypeScript**
- **Backend**: **Node.js** with **Express.js** framework written in **TypeScript**.
- **Authentication**: **Passport.js** with session-based authentication.
- **Session Storage**: **Redis** for storing session data.
- **Database**: **MongoDB** for data storage.
- **Image Uploads**: (Optional) Integration with a tool like **Cloudinary** for managing featuring images.

---

## **Installation**

Follow these steps to set up and run the project locally:

### **Prerequisites**
- Node.js (v14+)
- npm or yarn
- MongoDB installed locally or an Atlas cluster
- Redis installed locally or a hosted service (e.g., Redis Cloud)
- Git installed on your machine
- TypeScript globally installed (`npm install -g typescript`)

### **Steps**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd your-repo-name
   ```
3. **Install dependencies**:
   - For both frontend and backend:
     ```bash
     npm install
     ```
4. **Set up environment variables**:
   - Create a `.env` file in the backend directory.
   - Add the following variables:
     ```env
     MONGO_URI=your-mongodb-connection-string
     JWT_SECRET=your-jwt-secret
     SESSION_SECRET=your-session-secret
     REDIS_HOST=localhost
     REDIS_PORT=6379
     REDIS_PASSWORD=your-redis-password (if applicable)
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     ```
5. **Start Redis**:
   - If Redis is installed locally, start it using:
     ```bash
     redis-server
     ```
   - For a hosted service, ensure the connection details in `.env` are correct.

6. **Compile TypeScript**:
   - For the backend:
     ```bash
     npm run build
     ```
7. **Run the Backend**:
   - Navigate to the backend folder (if separated):
     ```bash
     cd backend
     ```
   - Start the backend server:
     ```bash
     npm start
     ```
   - Backend will run on `http://localhost:5000`.

8. **Run the Frontend**:
   - Navigate to the frontend folder (if separated):
     ```bash
     cd frontend
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```
   - Frontend will run on `http://localhost:3000`.

---

## **Usage**

1. **Register**: Create an account to get started.
2. **Authenticate**: Log in securely using **Passport.js** with **Redis** session storage.
3. **Create Posts**: Click "New Post" and fill in the required fields (title, slug, summary, body, featuring image).
4. **Manage Posts**: Edit or delete your posts from the dashboard.
5. **Engage**: Add comments or reply to existing ones under blog posts.

---

## **API Endpoints**

| Method | Endpoint                | Description                       |
|--------|-------------------------------- |---------------------------|
| POST   | `/signup`                       | Register a new user.      |
| POST   |`/login`                         | login                     |
| GET    |`/profile/:username`             | get user by username      |
| GET    |`/me`                            | get authenticated user    |
| GET    | `/slugs`                        | get all blogposts slug.   |
| GET    | `/`                             | get all blog posts.       |
| GET    | `/post/:slug`                   | get blogpost by slug      |
| POST   | `"/"`                           | fetch all blog posts.     |
| PATCH  | `/:blogPostId`                  | update blog post.         |
| GET    | `/:blogPostId/comments`         | get blog postcomments     |
| DELETE | `//:blogPostId`                 | delete a blog post.       |
| POST   | `/:blogPostId/comments`         | Add a comment to a post.  |
| Patch  | `/comments/:commentId`          | update a comment.         |
| GET    |`/comments/:commentId/replies`   | get comment replie        |
| DELETE |`/comments/:commentId`           | delete a comment          |



## **Contributing**

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## **License**

This project is licensed under the [MIT License](LICENSE).

---

## **Contact**

For any questions or feedback, feel free to reach out:

- **Email**: muchiripatrick86@gmail.com
- **GitHub**: [Muchiripatrick1]([(https://github.com/Muchiripatrick1)]

---

Let me know if you'd like additional details, such as how to configure **Redis** in your **Express.js** setup using TypeScript!
 
