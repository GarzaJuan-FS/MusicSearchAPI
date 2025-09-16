# MusicSearchAPI

## Project Overview

MusicSearchAPI is a backend API that provides Spotify OAuth authentication and music search functionality. Features include:

- **Spotify OAuth Authentication** - Complete OAuth 2.0 flow with callback handling
- **JWT Token Management** - Secure token-based authentication with expiration handling
- **SQLite Database** - User data persistence with automatic token refresh
- **Music Search** - Search for tracks, artists, and albums using Spotify Web API
- **Protected Routes** - Middleware-based route protection
- **Token Refresh** - Automatic access token renewal using refresh tokens

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)
- Spotify Developer Account (for API credentials)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/GarzaJuan-FS/MusicSearchAPI.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. **Spotify App Setup:**

   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Add `http://localhost:3000/auth/spotify/callback` to Redirect URIs
   - Copy your Client ID and Client Secret

4. Create a `.env` file in the root directory:

   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   PORT=3000
   SPOTIFY_REDIRECT_URI=http://localhost:3000/auth/spotify/callback
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Test the API:
   - Open `test.html` in your browser
   - Click "Login with Spotify" to authenticate
   - Search for music once authenticated

## API Endpoints

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

```
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

## Links

- Local: [http://localhost:3000](http://localhost:3000)
- Test Page: [http://localhost:3000/test.html](http://localhost:3000/test.html)
- Spotify Developer Dashboard: [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
- Spotify Web API Documentation: [https://developer.spotify.com/documentation/web-api](https://developer.spotify.com/documentation/web-api)
