const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a project by ID
const getProjectById = async (req, res, next) => {
  const projectId = req.params.bid;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a project.',
      500
    );
    return next(error);
  }

  if (!project) {
    const error = new HttpError(
      'Could not find project for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ project: project.toObject({ getters: true }) });
};

// Create a project
const createProject = async (req, res, next) => {

  const { name, description, objetives, justification, country, department, district, isTimeSeries, image, percentage, totalDays, nowDays, programs, factors, laboratorio, availability } = req.body;

  const createdProject = new Project({
    name,
    description,
    objetives,
    justification,
    country,
    department,
    district,
    isTimeSeries,
    image,
    percentage,
    totalDays,
    nowDays,
    programs,
    factors,
    laboratorio,
    availability
  });

  let user;
  try {
    user = await User.findById(req.userData.userId, { image: 0 });

  } catch (err) {
    const error = new HttpError(
      console.log(err),
      'Creating project failed, please try again.',
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
    await createdProject.save({ session: sess });
    // user.projects.push(createdProject);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating project failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }
  createdProject.image = "";
  res.status(201).json({ project: createdProject });
};

const getProjects = async (req, res, next) => {

  let user;
  try {
    user = await User.findById(req.userData.userId, { image: 0 });

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

  let projects;
  try {
    projects = await Project.find({}, { image: 0 });
    console.log(projects);
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Fetching projects failed, please try again later.',
      500
    );
    return next(error);
  }
  projects.forEach(function (item, index, array) {
    if (user.roles[0]) {
      if (item.laboratorio !== user.roles[0].projectName)
        projects.splice(index, 1)
    }
  })
  res.json({
    projects: projects.map(project =>
      project.toObject({ getters: true })
    )
  });
};

const getFilteredProjects = async (req, res, next) => {
  const userId = req.params.uid;
  let projects;
  try {
    projects = await Project.find({}, { image: 0 });
  } catch (err) {
    const error = new HttpError(
      'Fetching projects failed, please try again later.',
      500
    );
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userId, { image: 0 });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch user.',
      500
    );
    return next(error);
  }
  var bioIdArray = [];
  projects.forEach(function (arrayitem) {
    bioIdArray.push(arrayitem.id);
  });

  console.log(user);
  if (user && projects && user.roles.length > 0) {
    var roles = Object.values(user.roles);
    roles.forEach(function (arrayitem) {
      if (bioIdArray.includes(arrayitem.projectId)) {
        projects.splice(bioIdArray.indexOf(arrayitem.projectId), 1);
        bioIdArray.splice(bioIdArray.indexOf(arrayitem.projectId), 1);
      }
    });
  }




  res.json({
    projects: projects.map(user =>
      user.toObject({ getters: true })
    )
  });
};

const deleteProject = async (req, res, next) => {
  const projectId = req.params.bid;

  let project;
  try {
    project = await Project.findById(projectId, { image: 0 });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find project.',
      500
    );
    return next(error);
  }
  if (project.factors.length > 0) {
    const error = new HttpError(
      'El proyecto contiene datos. No se puede eliminar.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await project.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete project.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted project.' });
}

const updateProject = async (req, res, next) => {

  const { name, description, objetives, justification, country, department, district, isTimeSeries, image, percentage, totalDays, nowDays, programs, factors} = req.body;
  const projectId = req.params.bid;

  let project;
  try {
    project = await Project.findById(projectId, { image: 0 });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update project.',
      500
    );
    return next(error);
  }

  project.name = name;
  project.description = description;
  project.objetives = objetives;
  project.justification = justification;
  project.country = country;
  project.department = department;
  project.district = district;
  project.isTimeSeries = isTimeSeries;
  project.image = image;
  project.percentage = percentage;
  project.totalDays = totalDays;
  project.nowDays = nowDays;
  project.programs = programs;
  project.factors = factors;

  try {
    await project.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update project.',
      500
    );
    return next(error);
  }
  project.image = "";
  res.status(200).json({ project: project.toObject({ getters: true }) });
};

const updateAvailability = async (req, res, next) => {
  console.log("REQUEST")
  console.log(req.body)
  const { availability } = req.body;
  const projectId = req.params.bid;
  console.log("PROJECT ID")
  console.log(projectId)
  console.log(availability)
  let project;
  try {
    project = await Project.findById(projectId, { image: 0 });
    console.log(project)
    console.log('PROYECTO');
  } catch (err) {
    console.log("ERROR");
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not update project.',
      500
    );
    return next(error);
  }
  console.log("HOLA111")
  console.log(project.availability)
  console.log(availability)
  project.availability = availability;
  console.log("HOLA");
  console.log(project.availability);
  try {
    await project.save();
  } catch (err) {
    console.log("ERROR2");
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update project.',
      500
    );
    return next(error);
  }

  res.status(200).json({ project: project.toObject({ getters: true }) });
};

exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.getProjects = getProjects;
exports.getFilteredProjects = getFilteredProjects;
exports.deleteProject = deleteProject;
exports.updateProject = updateProject;
exports.updateAvailability = updateAvailability;