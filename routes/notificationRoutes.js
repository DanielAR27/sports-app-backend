const express = require('express');
const router = express.Router();
const axios = require('axios');
const Device = require('../models/Device');

// Registrar o actualizar token de dispositivo
router.post('/register', async (req, res) => {
  try {
    const { token, userId, platform } = req.body;
    
    if (!token || !userId || !platform) {
      return res.status(400).json({ error: 'Faltan datos requeridos (token, userId, platform)' });
    }

    // Actualizar o crear nuevo registro
    const device = await Device.findOneAndUpdate(
      { token },
      { userId, token, platform, updatedAt: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, device });
  } catch (error) {
    console.error('Error al registrar token:', error);
    res.status(500).json({ error: 'Error al registrar dispositivo' });
  }
});

// Enviar notificación a un usuario específico
router.post('/send', async (req, res) => {
  try {
    const { userId, title, body, data } = req.body;
    
    if (!userId || !title || !body) {
      return res.status(400).json({ error: 'Faltan datos requeridos (userId, title, body)' });
    }
    
    // Buscar todos los dispositivos del usuario
    const devices = await Device.find({ userId });
    
    if (!devices.length) {
      return res.status(404).json({ error: `No hay dispositivos registrados para el usuario ${userId}` });
    }
    
    // Preparar mensajes para cada dispositivo
    const messages = devices.map(device => ({
      to: device.token,
      title,
      body,
      data: data || {},
      sound: 'default',
      badge: 1,
    }));
    
    // Enviar notificaciones a través de la API de Expo
    const response = await axios.post('https://exp.host/--/api/v2/push/send', 
      messages, 
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    res.status(200).json({ success: true, result: response.data });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({ error: 'Error al enviar notificación' });
  }
});

// Enviar notificación a todos los usuarios
router.post('/broadcast', async (req, res) => {
  try {
    const { title, body, data } = req.body;
    
    if (!title || !body) {
      return res.status(400).json({ error: 'Faltan datos requeridos (title, body)' });
    }
    
    // Obtener todos los dispositivos únicos
    const devices = await Device.find();
    
    if (!devices.length) {
      return res.status(404).json({ error: 'No hay dispositivos registrados' });
    }
    
    // Agrupar por lotes de 100 para respetar límites de la API de Expo
    const batchSize = 100;
    const results = [];
    
    for (let i = 0; i < devices.length; i += batchSize) {
      const batch = devices.slice(i, i + batchSize);
      const messages = batch.map(device => ({
        to: device.token,
        title,
        body,
        data: data || {},
        sound: 'default',
      }));
      
      const response = await axios.post('https://exp.host/--/api/v2/push/send', 
        messages, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      results.push(response.data);
    }
    
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error('Error al enviar notificaciones masivas:', error);
    res.status(500).json({ error: 'Error al enviar notificaciones' });
  }
});

module.exports = router;