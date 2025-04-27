const mongoose = require('mongoose');

const notificationTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // ID del usuario
  token: { type: String, required: true }, // Token de notificación
});

module.exports = mongoose.model('NotificationToken', notificationTokenSchema);