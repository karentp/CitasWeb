const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  objetivesProgram: { type: String, required: true },
  definitionProgram: { type: String, required: true },
  image: { type: String},
  projects: [{ type: Object, ref: 'Project'}]
  
});

const Program = mongoose.model('Program', ProgramSchema);

module.exports = Program;