const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Program = require('../models/Program');
const Project = require('../models/Project');

const HttpError = require('../models/http-error');
const User = require('../models/User');

//Get a Program by ID
const getProgramById = async (req, res, next) => {
  const programId = req.params.pid;

  let program;
  console.log(programId);
  try {
    program = await Program.findById(programId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Program.',
      500
    );
    return next(error);
  }

  if (!program) {
    const error = new HttpError(
      'Could not find Program for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ program: program.toObject({ getters: true }) });
};

const getProgramPicture = async (req, res, next) => {
  const programId = req.params.pid;

  let program;
  console.log(programId);
  try {
    program = await Program.findById(programId, {image: 1, _id: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Program.',
      500
    );
    return next(error);
  }

  if (!program) {
    const error = new HttpError(
      'Could not find Program for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ program: program.toObject({ getters: true }) });
};

// Create a Program
const createProgram = async (req, res, next) => {

  const { name, description, objetivesProgram, definitionProgram, image, projects } = req.body;

  const createdProgram = new Program({
    name,
    description,
    objetivesProgram,
    definitionProgram,
    image,
    projects
  });

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
    await createdProgram.save({ session: sess });
    // user.Programes.push(createdProgram);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Program failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }
  createdProgram.image = "";
  res.status(201).json({ Program: createdProgram });
};

const getPrograms = async (req, res, next) => {
  
  let programs;
  try {
    programs = await Program.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching programs failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    programs: programs.map(programs =>
      programs.toObject({ getters: true })
    )
  });
};

const getFilteredPrograms = async (req, res, next) => {
  const projectId = req.params.bid;
  const userId = req.params.bid;
  let programs;
  try {
    programs = await Program.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching programs failed, please try again later.',
      500
    );
    return next(error);
  }
  let project;
  try {
    project = await Project.findById(projectId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch project.',
      500
    );
    return next(error);
  }
  let user;
  try {
    user = await User.findById(userId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch user.',
      500
    );
    return next(error);
  }
  var programIdArray = [];
  programs.forEach(function (arrayitem){
    programIdArray.push(arrayitem.id);
  });

  if(project && programs){
    project.programs.forEach(function (arrayitem){
      if(programIdArray.includes(arrayitem)){ 
        programs.splice(programIdArray.indexOf(arrayitem),1);
        programIdArray.splice(programIdArray.indexOf(arrayitem),1);
      }
    });
  }
  if(user){
    if(user.roles !== undefined || user.roles !== null){
      if (user.roles.length > 0){
        programs.forEach(function (item, index, array){
          user.roles.forEach(function (role){
            if (item.name === role.projectName){
              programs.splice(index, 1)
            }
          });
        });
      }
    }
  }
  
  res.json({
    programs: programs.map(program =>
      program.toObject({ getters: true })
    )
  });
};

const getProgramsFromBio = async (req, res, next) => {
  const projectId = req.params.bid;
  let programs = [];
  try {
    programs = await Program.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching programs failed, please try again later.',
      500
    );
    return next(error);
  }
  let project =[];
  try {
    project = await Project.findById(projectId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not fetch project.',
      500
    );
    return next(error);
  }
  var programIdArray = [];
  programs.forEach(function (arrayitem){
    programIdArray.push(arrayitem.id);
  });

  console.log(project);
  let programsFromBio = [];
  if(project && programs){
    project.programs.forEach(function (arrayitem){
      if(programIdArray.includes(arrayitem)){ 
        console.log("lo encontró");
        programsFromBio.push(programs[programIdArray.indexOf(arrayitem)]);
      }
    });
  }

    
  console.log(programsFromBio);

  res.json({
    programs: programsFromBio.map(program =>
      program.toObject({ getters: true })
    )
  });
};

const updateProgram = async (req, res, next) => {

  const { name, description, objetivesProgram, definitionProgram, image, projects} = req.body;
  const programId = req.params.pid;

  let program;
  try {
    program = await Program.findById(programId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update program.',
      500
    );
    return next(error);
  }

  program.name = name;
  program.description = description;
  program.objetivesProgram = objetivesProgram;
  program.definitionProgram = definitionProgram;
  program.image = image;
  program.projects = projects;

  try {
    await program.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update program.',
      500
    );
    return next(error);
  }
  program.image = "";
  res.status(200).json({ program: program.toObject({ getters: true }) });
};

const deleteProgram = async (req, res, next) => {
  const programId = req.params.pid;

  let program;
  try {
    program = await Program.findById(programId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find program.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await program.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete program.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Programa eliminado' });
}

exports.getProgramById = getProgramById;
exports.createProgram = createProgram;
exports.getPrograms = getPrograms;
exports.getFilteredPrograms = getFilteredPrograms;
exports.getProgramsFromBio = getProgramsFromBio;
exports.updateProgram = updateProgram;
exports.deleteProgram = deleteProgram;
exports.getProgramPicture = getProgramPicture;