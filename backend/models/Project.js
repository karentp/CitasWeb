const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String},
  description: { type: String},
  objetives: { type: String},
  justification: { type: String},
  country: { type: String},
  department: { type: String},
  district: { type: String},
  isTimeSeries: { type: Boolean},
  percentage: { type: Number, required: false, default: 0},
  totalDays:{ type: Number, required: false, default: 0},
  nowDays:{ type: Number, required: false, default: 0},
  totalTasks:{ type: Number, required: false, default: 0},
  image: { type: String },
  programs: [{ type: Object, ref: 'Program'}],
  factors: [{ type: Object, ref: 'Factor'}],
  laboratorio: { type: String},
  availability: []
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;