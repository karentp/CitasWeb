const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
  service: { type: Object, ref: 'Project'},
  start: {type: String},
  end: {type: String},
  timeSlot: {type: Number}
});

const Availability = mongoose.model('Availability', AvailabilitySchema);

module.exports = Availability;