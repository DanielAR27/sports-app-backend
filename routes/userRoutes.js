const express = require('express');
const User = require('../models/User');
const router = express.Router();
const mongoose = require('mongoose');

// Helper function to check database connection
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected. Current state:', mongoose.connection.readyState);
    return res.status(503).json({ 
      message: 'Database service unavailable', 
      details: 'The application is currently unable to connect to the database. Please try again later.' 
    });
  }
  next();
};

// Apply database connection check to all routes
router.use(checkDbConnection);

// @route   GET /api/users/:googleId
// @desc    Get user data by Google ID
// @access  Public
router.get('/:googleId', async (req, res) => {
  try {
    console.log(`Fetching user with Google ID: ${req.params.googleId}`);
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      console.log(`User not found with Google ID: ${req.params.googleId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log(`User found: ${user.name}`);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
});

// @route   POST /api/users
// @desc    Create or update user
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log('Create/update user request received:', req.body);
    const { google_id, name, email, picture } = req.body;
    
    // Check if required fields are provided
    if (!google_id || !name || !email) {
      console.log('Missing required fields:', { google_id, name, email });
      return res.status(400).json({ message: 'Please provide google_id, name, and email' });
    }
    
    // Find user by Google ID
    console.log(`Looking for existing user with Google ID: ${google_id}`);
    let user = await User.findOne({ google_id });
    
    if (user) {
      // Update existing user
      console.log(`Updating existing user: ${user.name}`);
      user.name = name;
      user.email = email;
      user.picture = picture;
      user.last_login = Date.now();
      
      await user.save();
      console.log('User updated successfully');
      return res.json(user);
    }
    
    // Create new user
    console.log('Creating new user');
    user = new User({
      google_id,
      name,
      email,
      picture,
      favorite_players: [],
      favorite_teams: []
    });
    
    await user.save();
    console.log('New user created successfully');
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
});

// @route   PUT /api/users/:googleId/players
// @desc    Add a player to user's favorites
// @access  Public
router.put('/:googleId/players', async (req, res) => {
  try {
    console.log(`Adding player to favorites for user with Google ID: ${req.params.googleId}`);
    const { player_id, player_name, team_id, team_name } = req.body;
    
    // Check if required fields are provided
    if (!player_id || !player_name) {
      console.log('Missing required player fields');
      return res.status(400).json({ message: 'Please provide player_id and player_name' });
    }
    
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      console.log(`User not found with Google ID: ${req.params.googleId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if player already exists in favorites
    const existingPlayer = user.favorite_players.find(p => p.player_id === player_id);
    
    if (existingPlayer) {
      console.log(`Player ${player_id} already in favorites`);
      return res.status(400).json({ message: 'Player already in favorites' });
    }
    
    // Add player to favorites
    console.log(`Adding player ${player_name} to favorites`);
    user.favorite_players.push({
      player_id,
      player_name,
      team_id,
      team_name
    });
    
    await user.save();
    console.log('Player added to favorites successfully');
    res.json(user);
  } catch (error) {
    console.error('Error adding favorite player:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
});

// @route   PUT /api/users/:googleId/teams
// @desc    Add a team to user's favorites
// @access  Public
router.put('/:googleId/teams', async (req, res) => {
  try {
    console.log(`Adding team to favorites for user with Google ID: ${req.params.googleId}`);
    const { team_id, team_name } = req.body;
    
    // Check if required fields are provided
    if (!team_id || !team_name) {
      console.log('Missing required team fields');
      return res.status(400).json({ message: 'Please provide team_id and team_name' });
    }
    
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      console.log(`User not found with Google ID: ${req.params.googleId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if team already exists in favorites
    const existingTeam = user.favorite_teams.find(t => t.team_id === team_id);
    
    if (existingTeam) {
      console.log(`Team ${team_id} already in favorites`);
      return res.status(400).json({ message: 'Team already in favorites' });
    }
    
    // Add team to favorites
    console.log(`Adding team ${team_name} to favorites`);
    user.favorite_teams.push({
      team_id,
      team_name
    });
    
    await user.save();
    console.log('Team added to favorites successfully');
    res.json(user);
  } catch (error) {
    console.error('Error adding favorite team:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
});

// @route   DELETE /api/users/:googleId/players/:playerId
// @desc    Remove a player from user's favorites
// @access  Public
router.delete('/:googleId/players/:playerId', async (req, res) => {
  try {
    console.log(`Removing player ${req.params.playerId} from favorites for user ${req.params.googleId}`);
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      console.log(`User not found with Google ID: ${req.params.googleId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Filter out the player to remove
    const initialLength = user.favorite_players.length;
    user.favorite_players = user.favorite_players.filter(
      player => player.player_id !== req.params.playerId
    );
    
    if (user.favorite_players.length === initialLength) {
      console.log(`Player ${req.params.playerId} not found in favorites`);
    } else {
      console.log(`Player ${req.params.playerId} removed from favorites`);
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error removing favorite player:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
});

// @route   DELETE /api/users/:googleId/teams/:teamId
// @desc    Remove a team from user's favorites
// @access  Public
router.delete('/:googleId/teams/:teamId', async (req, res) => {
  try {
    console.log(`Removing team ${req.params.teamId} from favorites for user ${req.params.googleId}`);
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      console.log(`User not found with Google ID: ${req.params.googleId}`);
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Filter out the team to remove
    const initialLength = user.favorite_teams.length;
    user.favorite_teams = user.favorite_teams.filter(
      team => team.team_id !== req.params.teamId
    );
    
    if (user.favorite_teams.length === initialLength) {
      console.log(`Team ${req.params.teamId} not found in favorites`);
    } else {
      console.log(`Team ${req.params.teamId} removed from favorites`);
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error removing favorite team:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
});

module.exports = router;