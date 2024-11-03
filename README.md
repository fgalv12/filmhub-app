# FilmHub Web App

## Overview

**FilmHub** is a web application designed for movie fans. It allows users to search for films based on various criteria such as name, genre, release year, and rating. Users can also save their favorite titles to a personal watchlist. The application's goal is to provide a simple and efficient interface that delivers quick and accurate search results.

## Features

- **User Authentication**: Secure login functionality with credential retrieval from MongoDB.
- **Movie Search**: Search by name, genre, release year, and rating using TMDb API.
- **Watchlist Management**: Add, delete, and edit items in a personal watchlist.
- **Responsive Design**: Consistent layout and style across all pages, optimized for various devices.
- **Navigation**: Intuitive navigation between pages Landing, Login, Home, Watchlist, and Profile.

## Technologies Used

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **API Integration**: The Movie Database (TMDb) API
- **Security**: JWT, bcrypt, Helmet.js, express-rate-limit
- **Styling**: CSS, Flexbox, React-Toastify
- **Version Control**: Git and GitHub

## Security Measures

- **User Authentication**: Secure login with JWT tokens to manage user sessions.
- **Password Encryption**: Passwords are hashed using bcrypt before storing in the database.
- **Input Validation**: All user inputs are validated to prevent SQL injection and XSS attacks.
- **Secure Communication**: HTTPS is used in production to encrypt data transmission.
- **Rate Limiting**: Implemented rate limiting using express-rate-limit to prevent brute-force attacks and abuse of API endpoints.
- **HTTP Headers Security**: Utilized Helmet.js to set secure HTTP headers, protecting against well-known web vulnerabilities.
- **CORS Configuration**: Configured CORS to restrict resource access to trusted domains, enhancing security against cross-origin attacks.
- **Password Requirements**: Enforced strong password policies including minimum length and character complexity.

## Project Tasks

- **Task 1: Set up the development environment**
  - Install necessary software and tools (MERN)
  - Configure Git and GitHub repository
- **Task 2: Design the application**
  - Create wireframes and mockups
  - Plan the user interface and user experience
- **Task 3: Develop the frontend**
  - Implement the UI using HTML, CSS, and JavaScript
  - Ensure responsiveness with CSS tools
- **Task 4: Develop the backend**
  - Set up the server using Node.js and Express.js
  - Implement RESTful APIs for CRUD operations
- **Task 5: Implement authentication**
  - Set up user authentication and authorization
  - Use JSON Web Tokens (JWT) for secure sessions
- **Task 6: Connect to a database**
  - Use MongoDB for storing user data and tasks
  - Implement data models and schemas
- **Task 7: Test the application**
  - Perform testing
  - Debug and fix issues
- **Task 8: Deploy the application**
  - Deploy the web application
- **Task 9: Document the project**
  - Create a complete README file
  - Write documentation

## Project Skills Learned

- **Frontend Development**: Building responsive and dynamic user interfaces with React.js and React Router.
- **Backend Development**: Creating robust server-side applications using Node.js and Express.js.
- **User Authentication and Authorization**: Implementing secure login systems with JWT and password hashing.
- **Database Management**: Designing and managing MongoDB databases using Mongoose ODM.
- **API Integration**: Integrating external APIs (TMDb) to fetch and display data.
- **Version Control**: Managing codebase effectively with Git and GitHub.
- **Security Best Practices**: Applying security measures to protect the application from common vulnerabilities.
- **Deployment**: Deploying web applications to cloud platforms and setting up CI/CD pipelines.
- **Documentation**: Creating documentation for users and developers.

## Development Process Used

- **Agile Methodology**: Emphasizing iterative development, continuous feedback, and collaboration.
- **Version Control Practices**: Utilizing Git branches, commits, and pull requests for organized and trackable development.

## Getting Started

### Prerequisites

- **Node.js** (v12 or higher)
- **npm** (v6 or higher)
- **MongoDB** instance (local or hosted)

### Installation

1. **Clone the Repository**

   ```
   bash
   git clone https://github.com/username/filmhub.git

   ```

2. **Navigate to the Project Directory**

   ```
   bash
   cd filmhub

   ```

3. **Install Backend Dependencies**

   ```
   bash
   cd backend
   npm install

   ```

4. **Install Frontend Dependencies**

   ```
   bash
   cd ../frontend
   npm install

   ```

5. **Configure Environment Variables**

- Create a .env file in the backend directory with the following variables:
  ```
  env
  MONGODB_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  TMDB_API_KEY=your_tmdb_api_key
  PORT=5000
  ```

6. **Start the Application**

- **Backend Sever**

  ```
  bash
  cd backend
  npm run server

  ```

- **Frontend Sever**
  ```
  bash
  cd ../frontend
  npm start
  ```

7. **Access the Application**

- Open your browser and navigate to http://localhost:3000 to view the FilmHub application.

## Acknowledgements

- [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api) for movie data and images
- [React.js Documentation](https://reactjs.org/docs/getting-started.html)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Helmet.js](https://helmetjs.github.io/) for securing HTTP headers
- [Express-Rate-Limit](https://github.com/nfriedly/express-rate-limit) for rate limiting middleware
