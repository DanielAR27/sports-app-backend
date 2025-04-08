const mongoose = require('mongoose');

const FavoritePlayerSchema = new mongoose.Schema({
  player_id: {
    type: String,
    required: true
  },
  player_name: {
    type: String,
    required: true
  },
  team_id: String,
  team_name: String
}, { _id: false });

const FavoriteTeamSchema = new mongoose.Schema({
  team_id: {
    type: String,
    required: true
  },
  team_name: {
    type: String,
    required: true
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  google_id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  favorite_players: [FavoritePlayerSchema],
  favorite_teams: [FavoriteTeamSchema],
  last_login: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);