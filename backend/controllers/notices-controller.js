
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const Project = require('../models/Project');
const HttpError = require('../models/http-error');
const User = require('../models/User');
const moment= require('moment')
//Get a Notice by ID
const getNoticeById = async (req, res, next) => {
  const noticeId = req.params.pid;

  let notice;
  console.log(noticeId);
  try {
    notice = await Notice.findById(noticeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Notice.',
      500
    );
    return next(error);
  }

  if (!notice) {
    const error = new HttpError(
      'Could not find Notice for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ notice: notice.toObject({ getters: true }) });
};

const getNoticePicture = async (req, res, next) => {
  const noticeId = req.params.pid;

  let notice;
  console.log(noticeId);
  try {
    notice = await Notice.findById(noticeId, {image: 1, _id: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Notice.',
      500
    );
    return next(error);
  }

  if (!notice) {
    const error = new HttpError(
      'Could not find Notice for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ notice: notice.toObject({ getters: true }) });
};

// Create a Notice
const createNotice = async (req, res, next) => {

  const { name, entrada, image, projects,date } = req.body;

  const createdNotice = new Notice({
    name,
    entrada,
    image,
    projects,
    date: moment().format("DD-MM-YYYY hh:mm:ss")
  });

   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
   } catch (err) {
     const error = new HttpError(
       'Creating Notice failed, please try again.',
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
    await createdNotice.save({ session: sess });
    // user.Noticees.push(createdNotice);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Notice failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }
  createdNotice.image = "";
  res.status(201).json({ Notice: createdNotice });
};

const getNotices = async (req, res, next) => {
  
  let notices;
  try {
    notices = await Notice.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching notices failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    notices: notices.map(notices =>
      notices.toObject({ getters: true })
    )
  });
};

const getFilteredNotices = async (req, res, next) => {
  const projectId = req.params.bid;
  let notices;
  try {
    notices = await Notice.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching notices failed, please try again later.',
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
  var noticeIdArray = [];
  notices.forEach(function (arrayitem){
    noticeIdArray.push(arrayitem.id);
  });

  if(project && notices){
    project.notices.forEach(function (arrayitem){
      if(noticeIdArray.includes(arrayitem)){ 
        console.log("lo encontró");
        notices.splice(noticeIdArray.indexOf(arrayitem),1);
        noticeIdArray.splice(noticeIdArray.indexOf(arrayitem),1);
      }
    });
  }

  res.json({
    notices: notices.map(notice =>
      notice.toObject({ getters: true })
    )
  });
};

const getNoticesFromBio = async (req, res, next) => {
  const projectId = req.params.bid;
  let notices = [];
  try {
    notices = await Notice.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching notices failed, please try again later.',
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
  var noticeIdArray = [];
  notices.forEach(function (arrayitem){
    noticeIdArray.push(arrayitem.id);
  });

  console.log(project);
  let noticesFromBio = [];
  if(project && notices){
    project.notices.forEach(function (arrayitem){
      if(noticeIdArray.includes(arrayitem)){ 
        console.log("lo encontró");
        noticesFromBio.push(notices[noticeIdArray.indexOf(arrayitem)]);
      }
    });
  }

    
  console.log(noticesFromBio);

  res.json({
    notices: noticesFromBio.map(notice =>
      notice.toObject({ getters: true })
    )
  });
};

const updateNotice = async (req, res, next) => {

  const { name, entrada, image, projects} = req.body;
  const noticeId = req.params.pid;

  let notice;
  try {
    notice = await Notice.findById(noticeId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update notice.',
      500
    );
    return next(error);
  }

  notice.name = name;
  notice.entrada = entrada;
  notice.image = image;
  notice.projects = projects;

  try {
    await notice.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update notice.',
      500
    );
    return next(error);
  }
  notice.image = "";
  res.status(200).json({ notice: notice.toObject({ getters: true }) });
};

const deleteNotice = async (req, res, next) => {
  const noticeId = req.params.pid;

  let notice;
  try {
    notice = await Notice.findById(noticeId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find notice.',
      500
    );
    return next(error);
  }
  console.log(notice);
  if (notice.projects.length > 0){
    const error = new HttpError(
      'La noticia no se puede eliminar.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await notice.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete notice.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted notice.' });
}

exports.getNoticeById = getNoticeById;
exports.createNotice = createNotice;
exports.getNotices = getNotices;
exports.getFilteredNotices = getFilteredNotices;
exports.getNoticesFromBio = getNoticesFromBio;
exports.updateNotice = updateNotice;
exports.deleteNotice = deleteNotice;
exports.getNoticePicture = getNoticePicture;