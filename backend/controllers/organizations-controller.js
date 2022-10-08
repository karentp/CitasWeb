const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Organization = require('../models/Organization');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a Organization by ID
const getOrganizationById = async (req, res, next) => {
  const organizationId = req.params.pid;

  let organization;
  console.log(organizationId);
  try {
    organization = await Organization.findById(organizationId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Laboratory.',
      500
    );
    return next(error);
  }

  if (!organization) {
    const error = new HttpError(
      'Could not find Laboratory for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ organization: organization.toObject({ getters: true }) });
};

const getOrganizationPicture = async (req, res, next) => {
  const organizationId = req.params.pid;

  let organization;
  console.log(organizationId);
  try {
    organization = await Organization.findById(organizationId, {image: 1, _id: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Laboratory.',
      500
    );
    return next(error);
  }

  if (!organization) {
    const error = new HttpError(
      'Could not find Laboratory for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ organization: organization.toObject({ getters: true }) });
};

// Create a Organization
const createOrganization = async (req, res, next) => {

  const { name, description, objetivesOrganization, definitionOrganization, image } = req.body;

  const createdOrganization = new Organization({
    name,
    description,
    objetivesOrganization,
    definitionOrganization,
    image
  });

   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
   } catch (err) {
     const error = new HttpError(
       'Creating Laboratory failed, please try again.',
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
    await createdOrganization.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Laboratory failed, please try again.' + err,
      500
    );
    console.log(err);
    return next(error);
  }
  createdOrganization.image = "";
  res.status(201).json({ Organization: createdOrganization });
};

const getOrganizations = async (req, res, next) => {
  
  let organizations;
  try {
    organizations = await Organization.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching Laboratorys failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    organizations: organizations.map(organizations =>
      organizations.toObject({ getters: true })
    )
  });
};

const getFilteredOrganizations = async (req, res, next) => {
  let organizations;
  try {
    organizations = await Organization.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching Laboratorys failed, please try again later.',
      500
    );
    return next(error);
  }
  var organizationIdArray = [];
  organizations.forEach(function (arrayitem){
    organizationIdArray.push(arrayitem.id);
  });

  res.json({
    organizations: organizations.map(organization =>
      organization.toObject({ getters: true })
    )
  });
};

const getOrganizationsFromBio = async (req, res, next) => {
  let organizations = [];
  try {
    organizations = await Organization.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching Laboratorys failed, please try again later.',
      500
    );
    return next(error);
  }
  var organizationIdArray = [];
  organizations.forEach(function (arrayitem){
    organizationIdArray.push(arrayitem.id);
  });
  let organizationsFromBio = [];

  res.json({
    organizations: organizationsFromBio.map(organization =>
      organization.toObject({ getters: true })
    )
  });
};

const updateOrganization = async (req, res, next) => {

  const { name, description, objetivesOrganization, definitionOrganization, image} = req.body;
  const organizationId = req.params.pid;

  let organization;
  try {
    organization = await Organization.findById(organizationId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update Laboratory.',
      500
    );
    return next(error);
  }

  organization.name = name;
  organization.description = description;
  organization.objetivesOrganization = objetivesOrganization;
  organization.definitionOrganization = definitionOrganization;
  organization.image = image;

  try {
    await organization.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update Laboratory.',
      500
    );
    return next(error);
  }
  organization.image = "";
  res.status(200).json({ organization: organization.toObject({ getters: true }) });
};

const deleteOrganization = async (req, res, next) => {
  const organizationId = req.params.pid;

  let organization;
  try {
    organization = await Organization.findById(organizationId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find Laboratory.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await organization.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete Laboratory.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Laboratorio eliminado' });
}

exports.getOrganizationById = getOrganizationById;
exports.createOrganization = createOrganization;
exports.getOrganizations = getOrganizations;
exports.getFilteredOrganizations = getFilteredOrganizations;
exports.getOrganizationsFromBio = getOrganizationsFromBio;
exports.updateOrganization = updateOrganization;
exports.deleteOrganization = deleteOrganization;
exports.getOrganizationPicture = getOrganizationPicture;