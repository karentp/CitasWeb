const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Resource = require('../models/Resource');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a Resource by ID
const getResourceById = async (req, res, next) => {
  const resourceId = req.params.pid;

  let resource;
  console.log(resourceId);
  try {
    resource = await Resource.findById(resourceId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Resource.',
      500
    );
    return next(error);
  }

  if (!resource) {
    const error = new HttpError(
      'Could not find Resource for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ resource: resource.toObject({ getters: true }) });
};

const getResourcePicture = async (req, res, next) => {
  const resourceId = req.params.pid;

  let resource;
  console.log(resourceId);
  try {
    resource = await Resource.findById(resourceId, {image: 1, _id: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Resource.',
      500
    );
    return next(error);
  }

  if (!resource) {
    const error = new HttpError(
      'Could not find Resource for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ resource: resource.toObject({ getters: true }) });
};

// Create a Resource
const createResource = async (req, res, next) => {

  const { name, url, image } = req.body;

  const createdResource = new Resource({
    name,
    url,
    image
  });

   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
   } catch (err) {
     const error = new HttpError(
       'Creating Resource failed, please try again.',
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
    await createdResource.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Resource failed, please try again.' + err,
      500
    );
    console.log(err);
    return next(error);
  }
  createdResource.image = "";
  res.status(201).json({ Resource: createdResource });
};

const getResources = async (req, res, next) => {
  
  let resources;
  try {
    resources = await Resource.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching resources failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    resources: resources.map(resources =>
      resources.toObject({ getters: true })
    )
  });
};

const getFilteredResources = async (req, res, next) => {
  let resources;
  try {
    resources = await Resource.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching resources failed, please try again later.',
      500
    );
    return next(error);
  }
  var resourceIdArray = [];
  resources.forEach(function (arrayitem){
    resourceIdArray.push(arrayitem.id);
  });

  res.json({
    resources: resources.map(resource =>
      resource.toObject({ getters: true })
    )
  });
};

const getResourcesFromBio = async (req, res, next) => {
  let resources = [];
  try {
    resources = await Resource.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching resources failed, please try again later.',
      500
    );
    return next(error);
  }
  var resourceIdArray = [];
  resources.forEach(function (arrayitem){
    resourceIdArray.push(arrayitem.id);
  });
  let resourcesFromBio = [];

  res.json({
    resources: resourcesFromBio.map(resource =>
      resource.toObject({ getters: true })
    )
  });
};

const updateResource = async (req, res, next) => {

  const { name, url, image} = req.body;
  const resourceId = req.params.pid;

  let resource;
  try {
    resource = await Resource.findById(resourceId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update resource.',
      500
    );
    return next(error);
  }

  resource.name = name;
  resource.url = url;
  resource.image = image;

  try {
    await resource.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update resource.',
      500
    );
    return next(error);
  }
  resource.image = "";
  res.status(200).json({ resource: resource.toObject({ getters: true }) });
};

const deleteResource = async (req, res, next) => {
  const resourceId = req.params.pid;

  let resource;
  try {
    resource = await Resource.findById(resourceId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find resource.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await resource.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete resource.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Resourcea eliminado' });
}

exports.getResourceById = getResourceById;
exports.createResource = createResource;
exports.getResources = getResources;
exports.getFilteredResources = getFilteredResources;
exports.getResourcesFromBio = getResourcesFromBio;
exports.updateResource = updateResource;
exports.deleteResource = deleteResource;
exports.getResourcePicture = getResourcePicture;