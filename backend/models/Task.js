const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  diasNecesarios: { type: Number, required: true },
  diasCompletados: { type: Number, required: false, default: 0 },
  isTimeSeries: { type: Boolean, required: true },
  projects: [{ type: Object, ref: 'Project'}]
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;