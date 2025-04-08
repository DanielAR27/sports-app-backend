const express = require('express');
const router = express.Router();
const axios = require('axios');

// TheSportsDB API Base URL
const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// Helper function to make API requests
const fetchFromSportsDB = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching from TheSportsDB: ${error.message}`);
    throw error;
  }
};

// @route   GET /api/sports/players/search/:name
// @desc    Search for players by name
// @access  Public
router.get('/players/search/:name', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/searchplayers.php?p=${encodeURIComponent(req.params.name)}`);
    res.json(data.player || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/players/:id
// @desc    Get player details by ID
// @access  Public
router.get('/players/:id', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/lookupplayer.php?id=${req.params.id}`);
    
    if (!data.players || data.players.length === 0) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    res.json(data.players[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/teams/search/:name
// @desc    Search for teams by name
// @access  Public
router.get('/teams/search/:name', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/searchteams.php?t=${encodeURIComponent(req.params.name)}`);
    res.json(data.teams || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/teams/:id
// @desc    Get team details by ID
// @access  Public
router.get('/teams/:id', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/lookupteam.php?id=${req.params.id}`);
    
    if (!data.teams || data.teams.length === 0) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    res.json(data.teams[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/teams/:id/players
// @desc    Get all players in a team
// @access  Public
router.get('/teams/:id/players', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/lookup_all_players.php?id=${req.params.id}`);
    res.json(data.player || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/teams/:id/events/next
// @desc    Get upcoming events for a team
// @access  Public
router.get('/teams/:id/events/next', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/eventsnext.php?id=${req.params.id}`);
    res.json(data.events || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/teams/:id/events/last
// @desc    Get past events for a team
// @access  Public
router.get('/teams/:id/events/last', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/eventslast.php?id=${req.params.id}`);
    res.json(data.results || data.events || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/leagues/:sport
// @desc    Get leagues by sport
// @access  Public
router.get('/leagues/:sport', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/all_leagues.php?s=${encodeURIComponent(req.params.sport)}`);
    res.json(data.leagues || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/leagues/:league/teams
// @desc    Get all teams in a league
// @access  Public
router.get('/leagues/:league/teams', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/search_all_teams.php?l=${encodeURIComponent(req.params.league)}`);
    res.json(data.teams || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/sports/all
// @desc    Get all sports
// @access  Public
router.get('/all', async (req, res) => {
  try {
    const data = await fetchFromSportsDB(`/all_sports.php`);
    res.json(data.sports || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;