# URL Shortener

A full-stack URL shortening application built with Node.js, Express, Sequelize, PostgreSQL, Next.js, and TypeScript.

## Features

- ✅ URL shortening with custom short codes
- ✅ User authentication (register, login, logout)
- ✅ JWT-based authentication with refresh tokens
- ✅ Click tracking and analytics
- ✅ Responsive UI built with Next.js and Shadcn/UI
- ✅ TypeScript for type safety
- ✅ Docker setup for easy development and deployment

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Using Docker (Recommended)](#using-docker-recommended)
  - [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)

## Project Structure

The project is divided into two main parts:

- `url_shortener_be`: Backend API built with Node.js, Express, and Sequelize
- `url_shortener_fe`: Frontend application built with Next.js and TypeScript

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v13 or later)
- Docker and Docker Compose (for Docker setup)

## Installation

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd url_shortener
   ```

2. Create environment files:
   
   For the backend (url_shortener_be/.env):
   ```
   NODE_ENV=development
   PORT=3001
   
   # Database
   DEV_DATABASE_NAME=url_shortener
   DEV_DATABASE_USER=postgres
   DEV_DATABASE_PASSWORD=postgres
   DEV_DATABASE_HOST=postgres
   DEV_DATABASE_PORT=5432
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=1d
   JWT_COOKIE_EXPIRES_IN=1
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```
   
   For the frontend (url_shortener_fe/.env):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   NEXT_PUBLIC_DOMAIN=http://localhost:3001/api/v1/urls
   ```

3. Start the application:
   ```bash
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/v1/docs

### Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd url_shortener_be
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a PostgreSQL database:
   ```bash
   createdb url_shortener
   ```

4. Set up environment variables (see [Environment Variables](#environment-variables))

5. Run migrations:
   ```bash
   npm run migrate
   ```

6. Start the server:
   ```bash
   npm run start:dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd url_shortener_fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Port number for the server | 3001 |
| `DEV_DATABASE_NAME` | Development database name | url_shortener |
| `DEV_DATABASE_USER` | Development database user | postgres |
| `DEV_DATABASE_PASSWORD` | Development database password | postgres |
| `DEV_DATABASE_HOST` | Development database host | localhost |
| `DEV_DATABASE_PORT` | Development database port | 5432 |
| `PRO_DATABASE_NAME` | Production database name | - |
| `PRO_DATABASE_USER` | Production database user | - |
| `PRO_DATABASE_PASSWORD` | Production database password | - |
| `PRO_DATABASE_HOST` | Production database host | - |
| `PRO_DATABASE_PORT` | Production database port | - |
| `JWT_SECRET` | Secret key for JWT token generation | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | 1d |
| `JWT_COOKIE_EXPIRES_IN` | JWT cookie expiration time (days) | 1 |
| `FRONTEND_URL` | URL of the frontend application | http://localhost:3000 |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:3001/api/v1 |
| `NEXT_PUBLIC_DOMAIN` | Domain for shortened URLs | http://localhost:3001/api/v1/urls |

## API Documentation

The API documentation is available at http://localhost:3001/api/v1/docs when the server is running. 

### Authentication Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/v1/auth/register` | Register a new user | No |
| POST | `/api/v1/auth/login` | Login a user | No |
| POST | `/api/v1/auth/refresh-token` | Refresh access token | No |
| POST | `/api/v1/auth/logout` | Logout user | No |

### URL Endpoints

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/v1/urls` | Create a short URL | Yes |
| GET | `/api/v1/urls/statistics` | Get URL statistics | Yes |
| GET | `/api/v1/urls/:short_code` | Redirect to original URL | No |

### API Request & Response Examples

#### Register User

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "status": "success",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "status": "success",
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

#### Create Short URL

```http
POST /api/v1/urls
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "long_url": "https://example.com/very/long/url/that/needs/shortening"
}
```

Response:

```json
{
  "status": "success",
  "message": "URL created successfully",
  "url": {
    "id": 1,
    "user_id": 1,
    "short_code": "ab1c2d",
    "long_url": "https://example.com/very/long/url/that/needs/shortening",
    "clicks": 0,
    "createdAt": "2023-12-01T12:00:00.000Z",
    "updatedAt": "2023-12-01T12:00:00.000Z"
  }
}
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. When a user registers or logs in, they receive an access token and a refresh token.
2. The access token is short-lived (default: 15 minutes) and is used to authenticate API requests.
3. The refresh token is long-lived (default: 7 days) and is stored as an HTTP-only cookie.
4. When the access token expires, the client can request a new one using the refresh token.
5. To authenticate API requests, include the access token in the Authorization header:
   ```
   Authorization: Bearer <access-token>
   ```

## License

MIT 