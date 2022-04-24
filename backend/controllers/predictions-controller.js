const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Program = require('../models/Program');
const Project = require('../models/Project');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const Prediction = require('../models/Prediction');

const createPrediction = async (req, res, next) => {

    const { projectID, programID, initialDate, finalDate } = req.body;

    const createdPrediction = new Prediction({
        projectID,
        programID,
        initialDate,
        finalDate
    });


    let project;
    try {
        project = await Project.findById(projectID, {image: 0});
    } catch (err) {
        const error = new HttpError(
            "Could not fetch project, please try again.",
            500
        );
        return next(error);
    }

    if (!project) {
        const error = new HttpError(
            "Could not find project for provided id.",
            404
        );
        return next(error);
    }

    let program;
    try {
        program = await Program.findById(programID, {image: 0});
    } catch (err) {
        const error = new HttpError(
            "Could not fetch program, please try again.",
            500
        );
        return next(error);
    }

    if (!program) {
        const error = new HttpError("Could not find program for provided id.", 404);
        return next(error);
    }

    let user;
    try {
      user = await User.findById(req.userData.userId, {image: 0});
     
    } catch (err) {
      const error = new HttpError(
        'Creating Program failed, please try again.',
        500
      );
      return next(error);
    }
 
    if (!user) {
      const error = new HttpError('Could not find user for provided id.', 404);
      return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPrediction.save({ session: sess });
        await user.save({ session: sess });
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Creating Prediction failed, please try again.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(201).json({ Prediction: createdPrediction });

};

const getPredictions = async (req, res, next) => {
  
    let predictions;
    try {
      predictions = await Project.find({}, {image: 0});
      console.log(predictions);
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        'Fetching predictions failed, please try again later.',
        500
      );
      return next(error);
    }
  
    res.json({
        predictions: predictions.map(prediction =>
        prediction.toObject({ getters: true })
      )
    });
  };

exports.createPrediction = createPrediction;
exports.getPredictions = getPredictions;