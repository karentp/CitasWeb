const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  name: { type: String, required: true, unique: true },
  url: { type: String, required: true },
  image: { type: String}
});

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;