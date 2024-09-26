# Newspaper Platform Backend

This project is a backend for a newspaper platform where reporters can publish news articles, reply to comments, and users can read news and make comments. The platform supports user authentication, news management, comment handling, and file uploads.

## Features

- User registration and authentication (JWT-based)
- Reporters can publish, update, and delete news articles
- Users can read news articles and post comments
- Reporters can reply to user comments on news articles
- File uploads (e.g., images for news) using **express-fileupload**
- Email notifications for account-related actions using **Nodemailer**

## Technologies

- **Node.js**: Backend runtime
- **Express.js**: Web framework
- **Prisma**: ORM for database management
- **@vinejs/vine**: Request validation
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT-based authentication
- **express-fileupload**: Handling file uploads (e.g., news images)
- **Nodemailer**: Email service for notifications
- **UUID**: Unique ID generation for resources
- **dotenv**: Environment variables management

## How to contribute

Feel free to submit issues or pull requests if you find any bugs or want to enhance the project.

Update the environment variables to match your setup. You can do this by creating a .env file in the root of your project.
