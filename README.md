# Sports App Backend

This is the backend API for the Sports App, providing endpoints for user management and sports data retrieval.

## Features

- User Authentication via Google OAuth
- Saving and retrieving user favorite players and teams
- Integration with TheSportsDB API for sports data

## API Endpoints

### User Routes

- `GET /api/users/:googleId` - Get user data by Google ID
- `POST /api/users` - Create or update user
- `PUT /api/users/:googleId/players` - Add a player to user's favorites
- `PUT /api/users/:googleId/teams` - Add a team to user's favorites
- `DELETE /api/users/:googleId/players/:playerId` - Remove a player from user's favorites
- `DELETE /api/users/:googleId/teams/:teamId` - Remove a team from user's favorites

## Setup & Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/sports-app-backend.git
   cd sports-app-backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the server
   ```
   npm start
   ```

## Deployment

### Deploying to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the Build Command to `npm install`
4. Set the Start Command to `npm start`
5. Add the environment variables (PORT, MONGODB_URI)
6. Deploy the service

## Technologies Used

- Node.js & Express.js
- MongoDB & Mongoose
- Axios for HTTP requests
- TheSportsDB API for sports data