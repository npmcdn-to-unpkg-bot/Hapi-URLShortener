const Joi         = require('joi');
const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;
const createHash  = require('./createhash');
const hashLen     = 8; /* 8 chars long */

// Local machine? Set baseUrl to 'http://localhost:3000'
// It's important that you don't add the slash at the end
// or else it will conflict with one of the routes.
const baseUrl     = process.env.BASE_URL || 'http://localhost:3000';

// CREATING MONGOOSE SCHEMAS

const redirSchema = new Schema({
  shortUrl: String,
  url: String,
  createdAt: Date
});

const Redir = mongoose.model('Redir', redirSchema);
