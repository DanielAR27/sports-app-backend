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

### Sports Routes

- `GET /api/sports/players/search/:name` - Search for players by name
- `GET /api/sports/players/:id` - Get player details by ID
- `GET /api/sports/teams/search/:name` - Search for teams by name
- `GET /api/sports/teams/:id` - Get team details by ID
- `GET /api/sports/teams/:id/players` - Get all players in a team
- `GET /api/sports/teams/:id/events/next` - Get upcoming events for a team
- `GET /api/sports/teams/:id/events/last` - Get past events for a team
- `GET /api/sports/leagues/:sport` - Get leagues by sport
- `GET /api/sports/leagues/:league/teams` - Get all teams in a league
- `GET /api/sports/all` - Get all sports

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