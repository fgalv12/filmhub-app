# FilmHub Web App

## Overview

**FilmHub** is a web application designed for movie and TV show fans. It allows users to search for films and series based on various criteria such as name, genre, release year, and rating. Users can also save their favorite titles to a personal watchlist. The application's purpose is to provide a simple and efficient interface that delivers quick and accurate search results.

## Features

- **User Authentication**: Secure login functionality with credential retrieval from MongoDB.
- **Movie and TV Show Search**: Search by name, genre, release year, and rating using TMDb API.
- **Watchlist Management**: Add, delete, and edit items in a personal watchlist.
- **Responsive Design**: Consistent layout and style across all pages, optimized for various devices.
- **Navigation**: Intuitive navigation between pages like Landing, Login, Home, and Watchlist.

## Technologies Used

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **API Integration**: The Movie Database (TMDb) API
- **Styling**: CSS, Flexbox
- **Version Control**: Git and GitHub

## Security Measures

- **User Authentication**: Secure login with JWT tokens.
- **Password Encryption**: Passwords are hashed using bcrypt before storing in the database.
- **Input Validation**: All user inputs are validated to prevent SQL injection and XSS attacks.
- **Secure Communication**: HTTPS should be used in production to encrypt data transmission.
- **Password Requirements**: Enforced strong password policies including minimum length and character complexity.

**Note**: This application is currently in development. Features like user registration, search functionality, and watchlist management are planned for future releases.
