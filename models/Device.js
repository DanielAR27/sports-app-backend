const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: String,  // googleId del usuario
    required: true,
    index: true    // Añadir índice para búsquedas más rápidas
  },
  token: {
    type: String,  // Token de Expo Push
    required: true,
    unique: true   // Evitar duplicados
  },
  platform: {
    type: String,
    enum: ['ios', 'android', 'web'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Device', deviceSchema);