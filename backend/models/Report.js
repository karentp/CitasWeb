const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReportSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isTimeSeries: { type: Boolean, required: true },
  projects: [{ type: Object, ref: 'Project'}],
  projectName: { type: String, required: false },
  date: { type: String},
  notesReport : { type: String},
  cost: { type: String},
  valuesReport: { type: String},
  data: { type: String},

});

const Report = mongoose.model('Report', ReportSchema);

module.exports = Report;