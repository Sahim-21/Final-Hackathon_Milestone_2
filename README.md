# Army Welfare Application

A full-stack application for Army Welfare management built with Next.js frontend and Node.js backend.

## Project Structure

This project consists of two main parts:
- `/army-welfare-app` - Next.js frontend application
- `/backend` - Node.js/Express backend API

## Prerequisites

### Frontend
- Node.js 18.x or higher
- PNPM package manager

### Backend
- Node.js 18.x or higher
- NPM package manager
- MongoDB (Make sure MongoDB is installed and running)

## Getting Started

### Setting up the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend API will be available at `http://localhost:5000`

### Setting up the Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
pnpm dev
```

The frontend application will be available at `http://localhost:3000`

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- PNPM package manager

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)

## Project Structure

### Frontend
- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/lib` - Utility functions and shared logic
- `/hooks` - Custom React hooks
- `/styles` - Global styles and Tailwind CSS configuration
- `/public` - Static assets

### Backend
- `/controllers` - Request handlers and business logic
- `/models` - MongoDB/Mongoose models
- `/routes` - API route definitions
- `/config` - Configuration files
- `server.js` - Main application entry point
- `seedSchemes.js` - Database seeding utility

## Development Workflow

1. Start the backend server first
2. Then start the frontend development server
3. Make sure both servers are running simultaneously for full functionality

## API Documentation

The backend API provides the following main endpoints:
- `POST /api/auth/login` - User authentication
- `GET /api/schemes` - Get available schemes
- Additional endpoints documentation coming soon...

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request