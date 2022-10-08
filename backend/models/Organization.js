const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  objetivesOrganization: { type: String, required: true },
  definitionOrganization: { type: String, required: true },
  image: { type: String},
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;
