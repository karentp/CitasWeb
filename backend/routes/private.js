const express = require('express');
const { getPrivateData } = require('../controllers/private'); //Aqui luego hay que cambiarlo por el home
const notesController = require('../controllers/notes-controller');
const projectsController = require('../controllers/projects-controller');
const reportsController = require('../controllers/reports-controller');
const tasksController = require('../controllers/tasks-controller');
const programsController = require('../controllers/programs-controller');
const organizationsController = require('../controllers/organizations-controller');
const resourcesController = require('../controllers/resources-controller');
const evidencesController = require('../controllers/evidences-controller');
const blogsController = require('../controllers/blogs-controller');
const noticesController = require('../controllers/notices-controller');
const usersController = require('../controllers/users-controller');
const factorsController = require('../controllers/factors-controller');
const recordsController = require('../controllers/records-controller');
const upload_fileController = require('../controllers/upload_file-controller');
const predictionController = require('../controllers/predictions-controller');
const {register } = require('../controllers/auth');
const upload = require("../middleware/upload");
const availabilityController = require('../controllers/availability-controller');
const checkAuth = require('../middleware/auth');

const router = express.Router();

router.use(checkAuth);

router.get("/", getPrivateData); //Esto solo se agrega para tener algo que mostrar en el path de / en el get

router.get('/notes/:nid', notesController.getNoteById);

router.get('/user/', notesController.getNotesByUserId);

router.route("/notes").post(notesController.createNote);


router.route("/notes/:nid").patch(notesController.updateNote);
  
router.delete('/notes/:nid', notesController.deleteNote);


router.route("/project").post(projectsController.createProject);
router.get('/project/', projectsController.getProjects);
router.get('/project/:bid', projectsController.getProjectById);
router.get('/filteredproject/:uid', projectsController.getFilteredProjects);
router.delete('/project/:bid', projectsController.deleteProject);
router.patch('/project/:bid', projectsController.updateProject);
router.patch('/project/availability/:bid', projectsController.updateAvailability);

router.patch('/updatePercentage/:bid', tasksController.updatePercentage);
router.route("/task/:tid").post(tasksController.createTask);
router.get('/task/', tasksController.getTasks);
router.get('/showtask/:id', tasksController.getTaskById);
router.get('/filteredtask/:tid', tasksController.getFilteredTasks);
router.delete('/task/:bid', tasksController.deleteTask);
router.patch('/task/:id/:tid', tasksController.updateTask);


router.route("/availability/:tid").post(availabilityController.createAvailability);
router.get('/filteredavailability/:tid', availabilityController.getFilteredAvailability);

router.get('/users/', usersController.getUsers);
router.get('/gestores', usersController.getGestores);
router.get('/allUsers/:uid', usersController.getAllUsers);
router.patch('/users/:uid', usersController.updateUser);
router.delete('/users/:uid', usersController.deleteUser);
router.get('/users/:uid', usersController.getUserById);
router.post('/userRole/:uid', usersController.updateRole);
router.get('/permissions/:uid/:bid', usersController.getPermissionsFromBio);

router.route("/register").post(register);


router.route("/program").post(programsController.createProgram);
router.get('/program/:pid', programsController.getProgramById);
router.get('/program/', programsController.getPrograms);
router.get('/filteredprogram/:bid', programsController.getFilteredPrograms);
router.get('/programproject/:bid', programsController.getProgramsFromBio);
router.patch('/program/:pid', programsController.updateProgram);
router.delete('/program/:pid', programsController.deleteProgram);
router.get('/programPicture/:pid', programsController.getProgramPicture);

router.route("/organization").post(organizationsController.createOrganization);
router.get('/organization/:pid', organizationsController.getOrganizationById);
router.get('/organization/', organizationsController.getOrganizations);
router.get('/filteredorganization/:bid', organizationsController.getFilteredOrganizations);
router.get('/organizationproject/:bid', organizationsController.getOrganizationsFromBio);
router.patch('/organization/:pid', organizationsController.updateOrganization);
router.delete('/organization/:pid', organizationsController.deleteOrganization);
router.get('/organizationPicture/:pid', organizationsController.getOrganizationPicture);

router.route("/resource").post(resourcesController.createResource);
router.get('/resource/:pid', resourcesController.getResourceById);
router.get('/resource/', resourcesController.getResources);
router.get('/filteredresource/:bid', resourcesController.getFilteredResources);
router.get('/resourceproject/:bid', resourcesController.getResourcesFromBio);
router.patch('/resource/:pid', resourcesController.updateResource);
router.delete('/resource/:pid', resourcesController.deleteResource);
router.get('/resourcePicture/:pid', resourcesController.getResourcePicture);

router.route("/evidence").post(evidencesController.createEvidence);
router.get('/evidence/:pid', evidencesController.getEvidenceById);
router.get('/evidence/', evidencesController.getEvidences);
router.get('/filteredevidence/:bid', evidencesController.getFilteredEvidences);
router.get('/evidenceproject/:bid', evidencesController.getEvidencesFromBio);
router.patch('/evidence/:pid', evidencesController.updateEvidence);
router.delete('/evidence/:pid', evidencesController.deleteEvidence);
router.get('/evidencePicture/:pid', evidencesController.getEvidencePicture);

router.route("/blog").post(blogsController.createBlog);
router.get('/blog/:pid', blogsController.getBlogById);
router.get('/blog/', blogsController.getBlogs);
router.get('/filteredblog/:bid', blogsController.getFilteredBlogs);
router.get('/blogproject/:bid', blogsController.getBlogsFromBio);
router.patch('/blog/:pid', blogsController.updateBlog);
router.delete('/blog/:pid', blogsController.deleteBlog);
router.get('/blogPicture/:pid', blogsController.getBlogPicture);

router.patch('/updatePercentage/:bid', reportsController.updatePercentage);
router.route("/report/:tid").post(reportsController.createReport);
router.get('/report/', reportsController.getReports);
router.get('/showreport/:id', reportsController.getReportById);
router.get('/filteredreport/:tid', reportsController.getFilteredReports);
router.delete('/report/:bid', reportsController.deleteReport);
router.patch('/report/:id/:tid', reportsController.updateReport);


router.route("/factor").post(factorsController.createFactor);
router.get('/factor/', factorsController.getFactors);
router.get('/factor/:fid', factorsController.getFactorById);
router.delete('/factor/:fid/:bid', factorsController.deleteFactor);
router.patch('/factor/:fid', factorsController.updateFactor);
router.get('/factorproject/:bid', factorsController.getFactorsFromBio);

router.route("/record").post(recordsController.createRecord);
router.get('/record/:bid/:pid', recordsController.getRecordsFromBioXProgram);
router.get('/record/num/:bid/:pid', recordsController.getNumRecordsFromBioXProgram);
router.delete('/record/:rid', recordsController.deleteRecord);
router.patch('/record/:rid', recordsController.updateRecord);

router.post("/upload_file", upload.single("file"), upload_fileController.saveImage);
router.get('/fetchImage/:file(*)', upload_fileController.getImage);

router.route("/prediction").post(predictionController.createPrediction);
router.get('/prediction/', predictionController.getPredictions);

router.route("/notice").post(noticesController.createNotice);
router.get('/notice/:pid', noticesController.getNoticeById);
router.get('/notice/', noticesController.getNotices);
router.get('/filterednoticeg/:bid', noticesController.getFilteredNotices);
router.get('/noticeproject/:bid', noticesController.getNoticesFromBio);
router.patch('/notice/:pid', noticesController.updateNotice);
router.delete('/notice/:pid', noticesController.deleteNotice);
router.get('/noticePicture/:pid', noticesController.getNoticePicture);



module.exports = router;
