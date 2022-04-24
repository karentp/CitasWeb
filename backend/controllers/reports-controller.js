const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Report = require('../models/Report');
const Project = require('../models/Project');

const HttpError = require('../models/http-error');
const User = require('../models/User');
const { getProjectById } = require('./projects-controller');
const moment= require('moment')
//Get a report by ID
const getReportById = async (req, res, next) => {
  const reportId = req.params.id;

  let report;
  try {
    report = await Report.findById(reportId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a report.',
      500
    );
    return next(error);
  }

  if (!report) {
    const error = new HttpError(
      'Could not find report for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ report: report.toObject({ getters: true }) });
};

// Create a report
const createReport = async (req, res, next) => {
  const projectId = req.params.tid;
  const { name, description,isTimeSeries, projects,projectName,date, notesReport, cost, valuesReport,data} = req.body;
  
  const createdReport = new Report({
    name,
    description,
    isTimeSeries,
    projects,
    projectName,
    date: moment().format("DD-MM-YYYY hh:mm:ss"),
    notesReport,
    cost,
    valuesReport,
    data,
  });
  let project = await Project.findById(projectId, {image: 0});
  createdReport.projects = projectId
  createdReport.projectName = project.name

   let user;
   try {
     user = await User.findById(req.userData.userId, {image: 0});
    
   } catch (err) {
     const error = new HttpError(
       'Creating report failed, please try again.',
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
    await createdReport.save({ session: sess });
    // user.reports.push(createdreport);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating report failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }
  createdReport.image = "";

  res.status(201).json({ report: createdReport });
};

const getReports = async (req, res, next) => {
  
  let reports;
  try {
    reports = await Report.find({}, {image: 0});
    
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Fetching reports failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    reports: reports.map(report =>
      report.toObject({ getters: true })
    )
  });
};


const getFilteredReports = async (req, res, next) => {
  const projectId = req.params.tid;
  let reports;
  try {
    reports = await Report.find({projects:projectId}, {image: 0});
    console.log(reports);
  } catch (err) {
    const error = new HttpError(
      'Fetching reports failed, please try again later.',
      500
    );
    return next(error);
  }
  var bioIdArray = [];
  reports.forEach(function (arrayitem){
    bioIdArray.push(arrayitem.id);
  });
  res.json({
    reports: reports.map(user =>
      user.toObject({ getters: true })
    )
  });
};

const updatePercentage = async (req, res, next) => {
  const projectId = req.params.bid;

  let reports = await Report.countDocuments({projects:projectId}, {image: 0});
  let completereports = await Report.countDocuments({isTimeSeries: true,projects:projectId}, {image: 0});
  const percentage = ((100/reports)*completereports).toFixed(2);

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


const deleteReport = async (req, res, next) => {
  const reportId = req.params.bid;
  let report;
  try {
    report = await Report.findById(reportId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find report.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await report.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete report.',
      500
    );
    return next(error);
  }
  res.status(200).json({ message: 'Deleted report.' });
}




const updateReport = async (req, res, next) => {

  const { name, description,isTimeSeries, notesReport, cost, valuesReport,data} = req.body;
  const reportId = req.params.id;
  const projectId = req.params.tid;

  let report;
  try {
    report = await Report.findById(reportId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update report.',
      500
    );
    return next(error);
  }

  report.name = name;
  report.description = description;
  report.isTimeSeries = isTimeSeries;
  report.projects = projectId;
  report.notesReport = notesReport;
  report.cost = cost;
  report.valuesReport = valuesReport;
  report.data = data;

  try {
    await report.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update report.',
      500
    );
    return next(error);
  }
  report.image = "";
  res.status(200).json({ report: report.toObject({ getters: true }) });
};

exports.getReportById = getReportById;
exports.createReport = createReport;
exports.getReports = getReports;
exports.getFilteredReports = getFilteredReports;
exports.deleteReport = deleteReport;
exports.updateReport = updateReport;
exports.updatePercentage = updatePercentage;