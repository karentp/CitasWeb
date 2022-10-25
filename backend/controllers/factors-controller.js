const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Factor = require('../models/Factor');
const Record = require('../models/Record');

const HttpError = require('../models/http-error');
const Project = require('../models/Project');

const ObjectId = require('mongodb').ObjectId;

//Get a Factor by ID
const getFactorById = async (req, res, next) => {
  const factorId = req.params.fid;

  let factor;
  console.log(factorId);
  try {
    factor = await Factor.findById(factorId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Factor.',
      500
    );
    return next(error);
  }

  if (!factor) {
    const error = new HttpError(
      'Could not find Factor for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ factor: factor.toObject({ getters: true }) });
};

// Create a Factor
const createFactor = async (req, res, next) => {

  const { name, description, isDependent, projectID, type } = req.body;

  const createdFactor = new Factor({
    name,
    description,
    isDependent,
    projectID,
    type
  });

  let project;
  try {
    project = await Project.findById(req.body.projectID, { image: 0 });

  } catch (err) {
    const error = new HttpError(
      'Could not fetch project, please try again.',
      500
    );
    return next(error);
  }

  if (!project) {
    const error = new HttpError('Could not find project for provided id.', 404);
    return next(error);
  }

  let records;
  try {
    records = await Record.find({ "projectID": new ObjectId(project._id) });
  } catch (err) {
    const error = new HttpError(
      'Fetching records failed, please try again later.',
      500
    );
    return next(error);
  }

  for (let index = 0; index < records.length; index++) {
    records[index].values[0][createdFactor.name] = "";
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdFactor.save({ session: sess });
    project.factors.push(createdFactor._id);
    await project.save({ session: sess });
    for (let index = 0; index < records.length; index++) {
      records[index].values[0] = Object.assign({}, records[index].values[0]);
      await records[index].save({ session: sess });
    }
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Factor failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }

  res.status(201).json({ Factor: createdFactor });
};

const getFactors = async (req, res, next) => {

  let factors;
  try {
    factors = await Factor.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching factors failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    factors: factors.map(factor =>
      factor.toObject({ getters: true })
    )
  });
};


const deleteFactor = async (req, res, next) => {
  const factorId = req.params.fid;
  const projectId = req.params.bid;

  let factor;
  let project;
  try {
    factor = await Factor.findById(factorId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete factor.',
      500
    );
    return next(error);
  }

  try {
    project = await Project.findById(projectId, { image: 0 });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find project.',
      500
    );
    return next(error);
  }

  let records;
  try {
    records = await Record.find({ "projectID": new ObjectId(project._id) });
  } catch (err) {
    const error = new HttpError(
      'Fetching records failed, please try again later.',
      500
    );
    return next(error);
  }

  for (let index = 0; index < records.length; index++) {
    delete records[index].values[0][factor.name];
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const factorIndex = project.factors.indexOf(factorId);
    project.factors.splice(factorIndex, 1);
    await factor.remove({ session: sess });
    await project.save();
    for (let index = 0; index < records.length; index++) {
      records[index].values[0] = Object.assign({}, records[index].values[0]);
      await records[index].save({ session: sess });
    }
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete factor.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted factor.' });
}

const updateFactor = async (req, res, next) => {

  const { name, description, isDependent, projectID, type } = req.body;
  const factorId = req.params.fid;

  let factor;
  try {
    factor = await Factor.findById(factorId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update factor.',
      500
    );
    return next(error);
  }
  let oldName = factor.name;
  factor.name = name;
  factor.description = description;
  factor.isDependent = isDependent;
  factor.projectID = projectID;
  factor.type = type;

  let records;
  try {
    records = await Record.find({ "projectID": new ObjectId(projectID) });
  } catch (err) {
    const error = new HttpError(
      'Fetching records failed, please try again later.',
      500
    );
    return next(error);
  }

  let recordsdHasChange = false;
  if (records.length > 0) {
    if (!records[0].values[0].hasOwnProperty(factor.name)) {

      for (let index = 0; index < records.length; index++) {
        records[index].values[0][factor.name] = records[index].values[0][oldName];
        delete records[index].values[0][oldName];
      }

      recordsdHasChange = true;
    }
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await factor.save();
    if (recordsdHasChange) {
      for (let index = 0; index < records.length; index++) {
        records[index].values[0] = Object.assign({}, records[index].values[0]);
        await records[index].save({ session: sess });
      }
    }
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update factor.',
      500
    );
    return next(error);
  }

  res.status(200).json({ factor: factor.toObject({ getters: true }) });
};

const getFactorsFromBio = async (req, res, next) => {
  const projectId = req.params.bid;
  let factors = [];
  try {
    factors = await Factor.find();
  } catch (err) {
    const error = new HttpError(
      'Fetching factors failed, please try again later.',
      500
    );
    return next(error);
  }
  let project = [];
  try {
    project = await Project.findById(projectId, { image: 0 });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch project.',
      500
    );
    return next(error);
  }
  var factorIdArray = [];
  let factorsFromBio = [];

  factors.forEach(arrayitem => {
    if (arrayitem.projectID == projectId) {
      factorsFromBio.push(arrayitem);
    }

  });



  console.log(factorsFromBio);

  res.json({
    factors: factorsFromBio.map(factor =>
      factor.toObject({ getters: true })
    )
  });
};

exports.getFactorById = getFactorById;
exports.createFactor = createFactor;
exports.getFactors = getFactors;
exports.deleteFactor = deleteFactor;
exports.updateFactor = updateFactor;
exports.getFactorsFromBio = getFactorsFromBio;