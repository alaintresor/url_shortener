# URL Shortener

A full-stack URL shortening application built with Node.js, Express, Sequelize, PostgreSQL, Next.js, and TypeScript. This application allows users to create shortened URLs, track click statistics, and manage their shortened URLs through a modern web interface.

## Features

- ✅ URL shortening with custom short codes
- ✅ User authentication (register, login, logout)
- ✅ JWT-based authentication with refresh tokens
- ✅ Click tracking and analytics
- ✅ URL management (create, update, delete)
- ✅ Pagination for URL listing
- ✅ Statistics dashboard
- ✅ Responsive UI built with Next.js and Shadcn/UI
- ✅ TypeScript for type safety
- ✅ Docker setup for easy development and deployment
- ✅ Swagger API documentation
- ✅ Redis caching for improved performance

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Using Docker (Recommended)](#using-docker-recommended)
  - [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Development](#development)
- [Deployment](#deployment)

## Project Structure

The project is divided into two main parts:

### Backend (`url_shortener_be`)
- Node.js and Express.js server
- PostgreSQL database with Sequelize ORM
- Redis for caching
- JWT authentication
- Swagger API documentation
- TypeScript support

### Frontend (`url_shortener_fe`)
- Next.js application
- TypeScript
- Shadcn/UI components
- Responsive design
- JWT token management
- URL management interface

## Prerequisites

- Node.js (v16 or later)
- PostgreSQL (v13 or later)
- Redis (v6 or later)
- Docker and Docker Compose (for Docker setup)

## Installation

### Using Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd url_shortener
   ```

2. Create environment files:
   
   For the backend (`url_shortener_be/.env`):
   ```
   NODE_ENV=development
   PORT=3001
   
   # Database
   DEV_DATABASE_NAME=url_shortener
   DEV_DATABASE_USER=postgres
   DEV_DATABASE_PASSWORD=postgres
   DEV_DATABASE_HOST=postgres
   DEV_DATABASE_PORT=5432
   
   # Redis
   REDIS_HOST=redis
   REDIS_PORT=6379
   
   # JWT
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=15m
   JWT_COOKIE_EXPIRES_IN=7
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```
   
   For the frontend (`url_shortener_fe/.env`):
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
   - Redis Commander: http://localhost:8081

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
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | Secret key for JWT token generation | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | 15m |
| `JWT_COOKIE_EXPIRES_IN` | JWT cookie expiration time (days) | 7 |
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
| GET | `/api/v1/urls` | Get user's URLs (paginated) | Yes |
| GET | `/api/v1/urls/statistics` | Get URL statistics | Yes |
| GET | `/api/v1/urls/:short_code` | Redirect to original URL | No |
| PUT | `/api/v1/urls/:id` | Update a URL | Yes |
| DELETE | `/api/v1/urls/:id` | Delete a URL | Yes |

## Development

### Running Tests

```bash
# Backend tests
cd url_shortener_be
npm test

# Frontend tests
cd url_shortener_fe
npm test
```

### Code Style

The project uses ESLint and Prettier for code formatting. To format your code:

```bash
# Backend
cd url_shortener_be
npm run lint
npm run format

# Frontend
cd url_shortener_fe
npm run lint
npm run format
```

## Deployment

### Production Deployment

1. Set up environment variables for production
2. Build the frontend:
   ```bash
   cd url_shortener_fe
   npm run build
   ```
3. Start the production servers:
   ```bash
   # Backend
   cd url_shortener_be
   npm run start:prod

   # Frontend
   cd url_shortener_fe
   npm start
   ```

### Docker Deployment

1. Build and push Docker images:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml push
   ```

2. Deploy using Docker Compose:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.