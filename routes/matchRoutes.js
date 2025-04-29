const express = require('express');
const router = express.Router();
const axios = require('axios');

// Base URL de la API de deportes
const SPORTS_API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/1';
const API_KEY = '680723'; // Reemplaza con tu clave de API

// Obtener los próximos partidos de todos los equipos
router.get('/upcoming', async (req, res) => {
  try {
    const response = await axios.get(`${SPORTS_API_BASE_URL}/eventsnextleague.php?id=4328&apikey=${API_KEY}`);
    const matches = response.data.events;
    res.json(matches);
  } catch (error) {
    console.error('Error al obtener los partidos:', error.message);
    res.status(500).json({ error: 'Error al obtener los partidos' });
  }
});

// Obtener los próximos partidos de un equipo específico
router.get('/upcoming/:team', async (req, res) => {
  const { team } = req.params;
  try {
    const response = await axios.get(`${SPORTS_API_BASE_URL}/eventsnext.php?id=${team}&apikey=${API_KEY}`);
    const matches = response.data.events;
    res.json(matches);
  } catch (error) {
    console.error('Error al obtener los partidos del equipo:', error.message);
    res.status(500).json({ error: 'Error al obtener los partidos del equipo' });
  }
});

module.exports = router;