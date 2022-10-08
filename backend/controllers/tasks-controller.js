const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const { getProjectById } = require('./projects-controller');

//Get a task by ID
const getTaskById = async (req, res, next) => {
  const taskId = req.params.id;

  let task;
  try {
    task = await Task.findById(taskId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a task.',
      500
    );
    return next(error);
  }

  if (!task) {
    const error = new HttpError(
      'Could not find task for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ task: task.toObject({ getters: true }) });
};

// Create a task
const createTask = async (req, res, next) => {
  const projectId = req.params.tid;
  const { name, description,diasNecesarios,isTimeSeries,projects} = req.body;

  const createdTask = new Task({
    name,
    description,
    diasNecesarios,
    isTimeSeries,
    projects
  });
  
  createdTask.projects = projectId
  const project = await Project.findById(projectId, {image: 0});
  let countTask = await Task.countDocuments({projects:projectId}, {image: 0});
  let val = project.totalDays + createdTask.diasNecesarios
  await Project.findOneAndUpdate({_id:projectId},{totalDays:val,totalTasks:(countTask+1)})
   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
   } catch (err) {
     const error = new HttpError(
       'Creating task failed, please try again.',
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
    await createdTask.save({ session: sess });
    // user.tasks.push(createdtask);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating task failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }
  createdTask.image = "";

  res.status(201).json({ task: createdTask });
};

const getTasks = async (req, res, next) => {
  
  let tasks;
  try {
    tasks = await Task.find({}, {image: 0});
    
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Fetching tasks failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    tasks: tasks.map(task =>
      task.toObject({ getters: true })
    )
  });
};


const getFilteredTasks = async (req, res, next) => {
  const projectId = req.params.tid;
  let tasks;
  try {
    tasks = await Task.find({projects:projectId}, {image: 0});
    console.log(tasks);
  } catch (err) {
    const error = new HttpError(
      'Fetching tasks failed, please try again later.',
      500
    );
    return next(error);
  }
  var bioIdArray = [];
  tasks.forEach(function (arrayitem){
    bioIdArray.push(arrayitem.id);
  });
  res.json({
    tasks: tasks.map(user =>
      user.toObject({ getters: true })
    )
  });
};




const updatePercentage = async (req, res, next) => {
  const projectId = req.params.bid;

  let tasks = await Task.countDocuments({projects:projectId}, {image: 0});
  let completetasks = await Task.countDocuments({isTimeSeries: true,projects:projectId}, {image: 0});
  const percentage = ((100/tasks)*completetasks).toFixed(2);

  let project
  try {
    project = await Project.findOneAndUpdate({_id:projectId},{percentage:percentage});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update project.',
      500
    );
    return next(error);
  }
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
}


const deleteTask = async (req, res, next) => {
  const taskId = req.params.bid;
  let task;
  let projectId;
  try {
    task = await Task.findById(taskId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find task.',
      500
    );
    return next(error);
  }

  // actualiza las estadísticas del proyecto con cada Delete.
  projectId = task.projects;
  const project = await Project.findById(projectId, {image: 0});
  let countTask = await Task.countDocuments({projects:projectId}, {image: 0});
  if(project.totalDays){
  let total = project.totalDays - task.diasNecesarios
  let now = project.nowDays - task.diasCompletados
  await Project.findOneAndUpdate(
    {_id:projectId},
    {totalDays:total,
    nowDays:now,
    totalTasks:(countTask-1)} 
    )
    }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await task.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete task.',
      500
    );
    return next(error);
  }

 // actualiza el % de tareas del proyecto con cada Delete.

  
  let tasks = await Task.countDocuments({projects:projectId}, {image: 0});
  if(tasks){let completetasks = await Task.countDocuments({isTimeSeries: true,projects:projectId}, {image: 0});
  const percentage = ((100/tasks)*completetasks).toFixed(2);
  await Project.findOneAndUpdate({_id:projectId},{percentage:percentage});}
  else{
    await Project.findOneAndUpdate({_id:projectId},{percentage:0});
  }

  res.status(200).json({ message: 'Deleted task.' });
}




const updateTask = async (req, res, next) => {

  const { name, description,diasCompletados, isTimeSeries} = req.body;
  const taskId = req.params.id;
  const projectId = req.params.tid;
  let task;
  try {
    task = await Task.findById(taskId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update task.',
      500
    );
    return next(error);
  }
  const project = await Project.findById(projectId, {image: 0});
  

  let result = diasCompletados - task.diasCompletados
  await Project.findOneAndUpdate({_id:projectId},{nowDays:(project.nowDays+result)});

  task.name = name;
  task.description = description;
  task.diasCompletados = diasCompletados;
  task.isTimeSeries = isTimeSeries;
  task.projects = projectId;

  
  try {
    await task.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update task.',
      500
    );
    return next(error);
  }
  task.image = "";
  res.status(200).json({ task: task.toObject({ getters: true }) });
};

exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.getTasks = getTasks;
exports.getFilteredTasks = getFilteredTasks;
exports.deleteTask = deleteTask;
exports.updateTask = updateTask;
exports.updatePercentage = updatePercentage;