const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Availability = require('../models/Availability');
const Project = require('../models/Project');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const { getProjectById } = require('./projects-controller');

// Create a project
const createAvailability = async (req, res, next) => {
    const projectId = req.params.tid;

    const { service, start, end, timeSlot } = req.body;

    const createdAvailability = new Availability({
        service,
        start,
        end,
        timeSlot
    });
    createdAvailability.service = projectId;
    let project;
    try {
        project = await Project.findById(projectId, { image: 0 });

    } catch (err) {
        const error = new HttpError(
            console.log(err),
            'Creating service availability failed, please try again.',
            500
        );
        return next(error);
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdAvailability.save({ session: sess });
        // user.projects.push(createdProject);
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Creating project failed, please try again.',
            500
        );
        console.log(err);
        return next(error);
    }
    res.status(201).json({ project: createdAvailability });
};

const getFilteredAvailability = async (req, res, next) => {
    const projectId = req.params.tid;
    let availability;
    try {
      availability = await Availability.find({projects:projectId}, {image: 0});
      console.log(availability);
    } catch (err) {
      const error = new HttpError(
        'Fetching tasks failed, please try again later.',
        500
      );
      return next(error);
    }
    var bioIdArray = [];
    availability.forEach(function (arrayitem){
      bioIdArray.push(arrayitem.id);
    });
    res.json({
      availability: availability.map(service =>
        service.toObject({ getters: true })
      )
    });
  };
  
exports.createAvailability = createAvailability;
exports.getFilteredAvailability = getFilteredAvailability;