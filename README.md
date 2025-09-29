# Spotify Music Search API# Spotify Music Search API# MusicSearchAPI

A full-stack application with React frontend and Node.js backend for music discovery using Spotify's API.A full-stack application with React frontend and Node.js backend for music discovery using Spotify's API.## Project Overview

## Features## FeaturesMusicSearchAPI is a complete full-stack application featuring a Node.js/Express backend API with Spotify OAuth authentication and a modern frontend web application. The system provides comprehensive music discovery, user data analysis, and personalized recommendations.

- **Spotify OAuth Login** - Secure authentication with Spotify- **Spotify OAuth Login** - Secure authentication with Spotify### Backend Features:

- **Music Search** - Search tracks, artists, and albums

- **Personal Music** - View your playlists, top tracks, and recommendations- **Music Search** - Search tracks, artists, and albums

- **Audio Previews** - Play 30-second track previews

- **Responsive Design** - Works on desktop and mobile- **Personal Music** - View your playlists, top tracks, and recommendations- **Spotify OAuth Authentication** - Complete OAuth 2.0 flow with callback handling

## Tech Stack- **Audio Previews** - Play 30-second track previews- **JWT Token Management** - Secure token-based authentication with expiration handling

- **Backend:** Node.js, Express, SQLite, JWT- **Responsive Design** - Works on desktop and mobile- **SQLite Database** - User data persistence with automatic token refresh

- **Frontend:** React, Vite, CSS3

- **API:** Spotify Web API- **Music Search** - Search for tracks, artists, and albums using Spotify Web API

## Quick Setup## Tech Stack- **Protected Routes** - Middleware-based route protection

1. **Clone and install:**- **Token Refresh** - Automatic access token renewal using refresh tokens

   ```bash

   # Install backend dependencies- **Backend:** Node.js, Express, SQLite, JWT- **RESTful API** - Comprehensive endpoints for music discovery and user data

   cd Backend

   npm install- **Frontend:** React, Vite, CSS3



   # Install frontend dependencies- **API:** Spotify Web API### Frontend Features:

   cd ../Frontend/client

   npm install## Quick Setup- **Modern Web Application** - Responsive, mobile-first design with Spotify theming

   ```

- **Login Enforcement** - Automatic redirect to login for unauthenticated users

2. **Spotify App Setup:**

   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)1. **Clone and install:**- **Real-time Search** - Instant music search with debounced input

   - Create a new app

   - Add `http://localhost:3000/auth/spotify/callback` to Redirect URIs ````bash- **Audio Previews** - Built-in audio player for track previews

3. **Create `.env` file in project root:** npm install- **Dashboard** - Personalized overview with top tracks, recent activity, and stats

   `````env

   SPOTIFY_CLIENT_ID=your_client_id   cd client && npm install- **Music Discovery** - Playlists, top music, recently played, and recommendations

   SPOTIFY_CLIENT_SECRET=your_client_secret

   JWT_SECRET=your_jwt_secret   ```- **Error Handling** - Graceful error states with retry mechanisms

   PORT=3000

   SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback   ````

   `````

4. **Spotify App Setup:**## Prerequisites

5. **Run the app:**

   ````bash - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

   # Terminal 1 - Backend

   cd Backend   - Create a new app- Node.js (v18 or higher recommended)

   npm run dev

      - Add `http://localhost:3000/auth/spotify/callback` to Redirect URIs- npm (v9 or higher)

   # Terminal 2 - Frontend

   cd Frontend/client- Spotify Developer Account (for API credentials)

   npm run dev

   ```3. **Create `.env` file:**

   ````

6. **Open:** http://localhost:3001 ````env## Getting Started

## API Endpoints SPOTIFY_CLIENT_ID=your_client_id

### Authentication SPOTIFY_CLIENT_SECRET=your_client_secret1. Clone the repository:

- `GET /auth/spotify` - Start Spotify login

- `GET /auth/spotify/callback` - OAuth callback JWT_SECRET=your_jwt_secret

- `POST /logout` - Logout user

  PORT=3000 ```bash

### Music (requires authentication)

- `GET /search?q=query&type=track` - Search music SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback git clone https://github.com/GarzaJuan-FS/MusicSearchAPI.git

- `GET /user-playlists` - Get user playlists

- `GET /user-top?type=tracks` - Get top tracks/artists `   `

- `GET /recommendations` - Get recommendations

  ```

  ```

## Project Structure

4. **Run the app:**2. Install dependencies:

`````

├── Backend/                  # Express server   ````bash

│   ├── index.js             # Main server

│   ├── auth.js              # JWT authentication   # Terminal 1 - Backend   ```bash

│   ├── spotify.js           # Spotify API integration

│   ├── database.js          # SQLite database   npm run dev   npm install

│   └── package.json         # Backend dependencies

│   ````

├── Frontend/                # React application

│   └── client/   # Terminal 2 - Frontend

│       ├── src/

│       │   ├── pages/       # Login, Dashboard   cd client && npm run dev3. **Spotify App Setup:**

│       │   ├── components/  # Search, Music views

│       │   ├── contexts/    # Auth context   ```

│       │   └── services/    # API service

│       └── package.json     # Frontend dependencies   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

│

├── .env                     # Environment variables   ```

└── README.md               # This file

```5. **Open:** http://localhost:3001 - Create a new app



## License   - Add `http://localhost:3000/auth/spotify/callback` to Redirect URIs



MIT## API Endpoints - Copy your Client ID and Client Secret

### Authentication4. Create a `.env` file in the root directory:

- `GET /auth/spotify` - Start Spotify login

- `GET /auth/spotify/callback` - OAuth callback ```env

- `POST /logout` - Logout user SPOTIFY_CLIENT_ID=your_client_id_here

  SPOTIFY_CLIENT_SECRET=your_client_secret_here

### Music (requires authentication) PORT=3000

- `GET /search?q=query&type=track` - Search music SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback

- `GET /user-playlists` - Get user playlists JWT_SECRET=your_super_secure_jwt_secret_key_here

- `GET /user-top?type=tracks` - Get top tracks/artists FRONTEND_URL=http://localhost:3000

- `GET /recommendations` - Get recommendations ```

## Project Structure5. **Start the development servers:**

````**Backend:**

├── Backend (Express)

│   ├── index.js          # Main server   ```bash

│   ├── auth.js           # JWT authentication   npm run dev

│   ├── spotify.js        # Spotify API integration   ```

│   └── database.js       # SQLite database

│   **React Frontend:**

└── Frontend (React)

    └── client/   ```bash

        ├── src/   cd client

        │   ├── pages/        # Login, Dashboard   npm install

        │   ├── components/   # Search, Music views   npm run dev

        │   ├── contexts/     # Auth context   ```

        │   └── services/     # API service

        └── package.json6. **Access the application:**

```   - **Development:** http://localhost:3001 (React app with hot reload)

   - **Production:** Build with `npm run build` in client folder, then visit http://localhost:3000

## License

## API Endpoints

MIT
### Authentication

- `GET /auth/spotify` - Initiate Spotify OAuth flow
- `GET /auth/spotify/callback` - OAuth callback handler
- `POST /logout` - Logout user (requires JWT)

### User

- `GET /me` - Get current user profile (requires JWT)

### Search

- `GET /search?q=query&type=track` - Search music (requires JWT)
  - Parameters: `q` (search query), `type` (track/artist/album)

### Headers for Protected Routes

`````

Authorization: Bearer <your_jwt_token>

```

## Database Schema

Users table:

- `id` - Auto-increment primary key
- `spotify_id` - Unique Spotify user ID
- `display_name` - User's display name
- `email` - User's email
- `access_token` - Spotify access token (encrypted)
- `refresh_token` - Spotify refresh token (encrypted)
- `token_expires_at` - Token expiration timestamp
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

## Security Features

- Environment variables for sensitive data
- JWT tokens with expiration
- Automatic token refresh
- SQLite database for local development
- CORS protection
- Input validation

## Frontend Application

The project includes a complete frontend application built with vanilla JavaScript, modern CSS, and a component-based architecture.

### Frontend Features

- **Authentication Flow:**

  - Login screen with Spotify OAuth integration
  - Automatic login enforcement for unauthenticated users
  - JWT token management with session validation
  - Secure logout functionality

- **Music Discovery:**

  - Real-time search with instant results
  - Browse user's top tracks and artists
  - Explore personal playlists
  - Get music recommendations based on listening history
  - Audio preview player with controls

- **User Interface:**

  - Spotify-themed design with dark mode
  - Fully responsive layout (mobile, tablet, desktop)
  - Modern CSS Grid and Flexbox layouts
  - Interactive components with smooth animations
  - Error handling with user-friendly messages

- **Technical Architecture:**
  - Modern React components with hooks
  - React Router for client-side navigation
  - Context API for state management
  - Axios for API communication
  - Mobile-first responsive design

### Accessing the Frontend

**Development Mode:**

1. Start backend: `npm run dev`
2. Start React frontend: `cd client && npm run dev`
3. Open your browser to: [http://localhost:3001](http://localhost:3001)

**Production Mode:**

1. Build React app: `cd client && npm run build`
2. Start server: `NODE_ENV=production npm start`
3. Open your browser to: [http://localhost:3000](http://localhost:3000)

### Frontend File Structure

```

client/
├── src/
│ ├── components/ # Reusable React components
│ ├── pages/ # Page components (Login, Dashboard)
│ ├── contexts/ # React Context (Auth)
│ ├── services/ # API communication
│ └── styles/ # CSS styling
├── package.json # React dependencies
└── vite.config.js # Vite configuration

```

The React frontend automatically handles OAuth callbacks, enforces authentication, and provides a complete music discovery experience with modern web standards.

## Links

- **Development:** [http://localhost:3001](http://localhost:3001) (React frontend)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Production:** [http://localhost:3000](http://localhost:3000) (after building React app)
- Spotify Developer Dashboard: [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
- Spotify Web API Documentation: [https://developer.spotify.com/documentation/web-api](https://developer.spotify.com/documentation/web-api)
```
