const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EvidenceSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String}
});

const Evidence = mongoose.model('Evidence', EvidenceSchema);

module.exports = Evidence;