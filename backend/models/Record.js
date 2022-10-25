const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RecordSchema = new Schema({
  timestamp: { type: String, required: true },
  projectID: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
  programID: { type: mongoose.Types.ObjectId, required: true, ref: 'Program' },
  values: [{ type: Object, ref: 'Values'}],
});

const Record = mongoose.model('Record', RecordSchema);

module.exports = Record;