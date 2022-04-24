const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Evidence = require('../models/Evidence');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a Evidence by ID
const getEvidenceById = async (req, res, next) => {
  const evidenceId = req.params.pid;
  let evidence;
  try {
    evidence = await Evidence.findById(evidenceId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Evidence.',
      500
    );
    return next(error);
  }

  if (!evidence) {
    const error = new HttpError(
      'Could not find Evidence for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ evidence: evidence.toObject({ getters: true }) });
};

const getEvidencePicture = async (req, res, next) => {
  const evidenceId = req.params.pid;

  let evidence;
  try {
    evidence = await Evidence.findById(evidenceId, {image: 1, _id: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Evidence.',
      500
    );
    return next(error);
  }

  if (!evidence) {
    const error = new HttpError(
      'Could not find Evidence for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ evidence: evidence.toObject({ getters: true }) });
};

// Create a Evidence
const createEvidence = async (req, res, next) => {

  const { name, description, image } = req.body;

  const createdEvidence = new Evidence({
    name,
    description,
    image
  });

   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
   } catch (err) {
     const error = new HttpError(
       'Creating Evidence failed, please try again.',
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
    await createdEvidence.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Evidence failed, please try again.' + err,
      500
    );
    console.log(err);
    return next(error);
  }
  createdEvidence.image = "";
  res.status(201).json({ Evidence: createdEvidence });
};

const getEvidences = async (req, res, next) => {
  
  let evidences;
  try {
    evidences = await Evidence.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching evidences failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    evidences: evidences.map(evidences =>
      evidences.toObject({ getters: true })
    )
  });
};

const getFilteredEvidences = async (req, res, next) => {
  let evidences;
  try {
    evidences = await Evidence.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching evidences failed, please try again later.',
      500
    );
    return next(error);
  }
  var evidenceIdArray = [];
  evidences.forEach(function (arrayitem){
    evidenceIdArray.push(arrayitem.id);
  });

  res.json({
    evidences: evidences.map(evidence =>
      evidence.toObject({ getters: true })
    )
  });
};

const getEvidencesFromBio = async (req, res, next) => {
  let evidences = [];
  try {
    evidences = await Evidence.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching evidences failed, please try again later.',
      500
    );
    return next(error);
  }
  var evidenceIdArray = [];
  evidences.forEach(function (arrayitem){
    evidenceIdArray.push(arrayitem.id);
  });
  let evidencesFromBio = [];

  res.json({
    evidences: evidencesFromBio.map(evidence =>
      evidence.toObject({ getters: true })
    )
  });
};

const updateEvidence = async (req, res, next) => {

  const { name, description, image} = req.body;
  const evidenceId = req.params.pid;

  let evidence;
  try {
    evidence = await Evidence.findById(evidenceId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update evidence.',
      500
    );
    return next(error);
  }

  evidence.name = name;
  evidence.description = description;
  evidence.image = image;

  try {
    await evidence.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update evidence.',
      500
    );
    return next(error);
  }
  evidence.image = "";
  res.status(200).json({ evidence: evidence.toObject({ getters: true }) });
};

const deleteEvidence = async (req, res, next) => {
  const evidenceId = req.params.pid;

  let evidence;
  try {
    evidence = await Evidence.findById(evidenceId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find evidence.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await evidence.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete evidence.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Evidencea eliminado' });
}

exports.getEvidenceById = getEvidenceById;
exports.createEvidence = createEvidence;
exports.getEvidences = getEvidences;
exports.getFilteredEvidences = getFilteredEvidences;
exports.getEvidencesFromBio = getEvidencesFromBio;
exports.updateEvidence = updateEvidence;
exports.deleteEvidence = deleteEvidence;
exports.getEvidencePicture = getEvidencePicture;