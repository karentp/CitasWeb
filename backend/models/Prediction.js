const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PredictionSchema = new Schema({
  projectID: { type: mongoose.Types.ObjectId, required: true, ref: 'Project' },
  programID: { type: mongoose.Types.ObjectId, required: true, ref: 'Program' },
  initialDate: { type: String, required: true, ref: 'initialDate'  },
  finalDate: { type: String, required: true, ref: 'finalDate'  },
});

const Prediction = mongoose.model('Prediction', PredictionSchema);

module.exports = Prediction;