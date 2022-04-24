const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Factor = require("../models/Factor");
const Record = require("../models/Record");

const HttpError = require("../models/http-error");
const Project = require("../models/Project");
const Program = require("../models/Program");

const ObjectId = require('mongodb').ObjectId;

// Create a Program
const createRecord = async (req, res, next) => {

    const { projectID, programID, values } = req.body;

    const createdRecord = new Record({
        projectID,
        programID,
        values
    });

    let recordsToCreate = [];

    values.forEach(arrayitem => {

        arrayitem.projectID = projectID;
        arrayitem.programID = programID;
        recordsToCreate.push(arrayitem);

    });

    console.log(recordsToCreate);


    let project;
    try {
        project = await Project.findById(projectID, { image: 0 });
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
        program = await Program.findById(programID, { image: 0 });
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

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        Record.insertMany(recordsToCreate);
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Creating Record failed, please try again.',
            500
        );
        console.log(err);
        return next(error);
    }

    res.status(201).json({ Records: createdRecord });

};

const getRecordsFromBioXProgram = async (req, res, next) => {
    const projectId = req.params.bid;
    const programId = req.params.pid;


    try {
        await Project.findById(projectId, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch project.',
            500
        );
        return next(error);
    }

    try {
        await Program.findById(programId, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch programs.',
            500
        );
        return next(error);
    }

    try {
        records = await Record.find({
            projectID: new ObjectId(projectId),
            programID: new ObjectId(programId)
        });
    } catch (err) {
        const error = new HttpError(
            'Fetching records failed, please try again later.',
            500
        );
        return next(error);
    }

    res.json({
        records: records.map(record =>
            record.toObject({ getters: true })
        )
    });
};

const deleteRecord = async (req, res, next) => {
    const recordId = req.params.rid;

    let record;
    try {
        record = await Record.findById(recordId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find program.',
            500
        );
        return next(error);
    }
    console.log(record);

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await record.remove({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete record.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Deleted record.' });
}

const updateRecord = async (req, res, next) => {

    const {timestamp, values} = req.body;
    const recordId = req.params.rid;

    let record;
    try {
        record = await Record.findById(recordId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update record.',
            500
        );
        return next(error);
    }

    record.timestamp = timestamp;
    record.values = values;

    try {
        await record.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update record.',
            500
        );
        return next(error);
    }

    res.status(200).json({ record: record.toObject({ getters: true }) });
};

const getNumRecordsFromBioXProgram = async (req, res, next) => {
    const projectId = req.params.bid;
    const programId = req.params.pid;


    try {
        await Project.findById(projectId, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch project.',
            500
        );
        return next(error);
    }

    try {
        await Program.findById(programId, { image: 0 });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch programs.',
            500
        );
        return next(error);
    }

    let factors;
    try {
        factors = await Factor.find({
            "projectID": new ObjectId(projectId),
            "type": "value"
        }, "name"); //"name" or {"name": 1}
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not fetch project.',
            500
        );
        return next(error);
    }

    let records;
    try {
        records = await Record.find({
            projectID: new ObjectId(projectId),
            programID: new ObjectId(programId)
        });
    } catch (err) {
        const error = new HttpError(
            'Fetching records failed, please try again later.',
            500
        );
        return next(error);
    }

    let data = {};
    const forEachLoop1 = async _ => {
        for (let index = 0; index < factors.length; index++) {
            data[factors[index].name] = [];
        }
    };

    await forEachLoop1();

    const forEachLoop2 = async _ => {
        for (let index = 0; index < records.length; index++) {
            for (let index2 = 0; index2 < factors.length; index2++) {
                let factor = factors[index2].name;
                let value = records[index].values[0][factor];
                if(value !== ""){
                    data[factor].push(parseFloat(value));
                }
            }
        }
    };

    await forEachLoop2();

    res.json(data);
};

exports.createRecord = createRecord;
exports.getRecordsFromBioXProgram = getRecordsFromBioXProgram;
exports.deleteRecord = deleteRecord;
exports.updateRecord = updateRecord;
exports.getNumRecordsFromBioXProgram = getNumRecordsFromBioXProgram;