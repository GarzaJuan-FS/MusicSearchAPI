# MusicSearchAPI

## Project Overview

MusicSearchAPI is a backend API that allows users to search for music using the Spotify API. It loads environment variables from a `.env` file for secure configuration. Features include:

- Search for tracks, artists, and albums
- Spotify API integration
- Environment variable support
- RESTful endpoints

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
3. Create a `.env` file in the root directory and add your Spotify credentials:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the API at [http://localhost:3000](http://localhost:3000)

## Links

- Local: [http://localhost:3000](http://localhost:3000)
- Spotify Developer Dashboard: [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
