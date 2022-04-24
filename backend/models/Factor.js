const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FactorSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isDependent: { type: Boolean, required: true },
  projectID: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
  type: { type: String, required: true },
  
});

const Factor = mongoose.model('Factor', FactorSchema);

module.exports = Factor;