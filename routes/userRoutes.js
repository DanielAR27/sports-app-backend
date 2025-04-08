const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/users/:googleId
// @desc    Get user data by Google ID
// @access  Public
router.get('/:googleId', async (req, res) => {
  try {
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/users
// @desc    Create or update user
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { google_id, name, email, picture } = req.body;
    
    // Check if required fields are provided
    if (!google_id || !name || !email) {
      return res.status(400).json({ message: 'Please provide google_id, name, and email' });
    }
    
    // Find user by Google ID
    let user = await User.findOne({ google_id });
    
    if (user) {
      // Update existing user
      user.name = name;
      user.email = email;
      user.picture = picture;
      user.last_login = Date.now();
      
      await user.save();
      return res.json(user);
    }
    
    // Create new user
    user = new User({
      google_id,
      name,
      email,
      picture,
      favorite_players: [],
      favorite_teams: []
    });
    
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/:googleId/players
// @desc    Add a player to user's favorites
// @access  Public
router.put('/:googleId/players', async (req, res) => {
  try {
    const { player_id, player_name, team_id, team_name } = req.body;
    
    // Check if required fields are provided
    if (!player_id || !player_name) {
      return res.status(400).json({ message: 'Please provide player_id and player_name' });
    }
    
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if player already exists in favorites
    const existingPlayer = user.favorite_players.find(p => p.player_id === player_id);
    
    if (existingPlayer) {
      return res.status(400).json({ message: 'Player already in favorites' });
    }
    
    // Add player to favorites
    user.favorite_players.push({
      player_id,
      player_name,
      team_id,
      team_name
    });
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error adding favorite player:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/users/:googleId/teams
// @desc    Add a team to user's favorites
// @access  Public
router.put('/:googleId/teams', async (req, res) => {
  try {
    const { team_id, team_name } = req.body;
    
    // Check if required fields are provided
    if (!team_id || !team_name) {
      return res.status(400).json({ message: 'Please provide team_id and team_name' });
    }
    
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if team already exists in favorites
    const existingTeam = user.favorite_teams.find(t => t.team_id === team_id);
    
    if (existingTeam) {
      return res.status(400).json({ message: 'Team already in favorites' });
    }
    
    // Add team to favorites
    user.favorite_teams.push({
      team_id,
      team_name
    });
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error adding favorite team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/users/:googleId/players/:playerId
// @desc    Remove a player from user's favorites
// @access  Public
router.delete('/:googleId/players/:playerId', async (req, res) => {
  try {
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Filter out the player to remove
    user.favorite_players = user.favorite_players.filter(
      player => player.player_id !== req.params.playerId
    );
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error removing favorite player:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/users/:googleId/teams/:teamId
// @desc    Remove a team from user's favorites
// @access  Public
router.delete('/:googleId/teams/:teamId', async (req, res) => {
  try {
    const user = await User.findOne({ google_id: req.params.googleId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Filter out the team to remove
    user.favorite_teams = user.favorite_teams.filter(
      team => team.team_id !== req.params.teamId
    );
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error removing favorite team:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;