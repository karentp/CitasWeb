
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const Project = require('../models/Project');
const HttpError = require('../models/http-error');
const User = require('../models/User');
const moment= require('moment')
//Get a Blog by ID
const getBlogById = async (req, res, next) => {
  const blogId = req.params.pid;

  let blog;
  console.log(blogId);
  try {
    blog = await Blog.findById(blogId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Blog.',
      500
    );
    return next(error);
  }

  if (!blog) {
    const error = new HttpError(
      'Could not find Blog for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ blog: blog.toObject({ getters: true }) });
};

const getBlogPicture = async (req, res, next) => {
  const blogId = req.params.pid;

  let blog;
  console.log(blogId);
  try {
    blog = await Blog.findById(blogId, {image: 1, _id: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a Blog.',
      500
    );
    return next(error);
  }

  if (!blog) {
    const error = new HttpError(
      'Could not find Blog for the provided id.',
      404
    );
    return next(error);
  }

  res.json({ blog: blog.toObject({ getters: true }) });
};

// Create a Blog
const createBlog = async (req, res, next) => {

  const { name, entrada, image, projects,date } = req.body;

  const createdBlog = new Blog({
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
       'Creating Blog failed, please try again.',
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
    await createdBlog.save({ session: sess });
    // user.Bloges.push(createdBlog);
    await user.save({ session: sess });
    await sess.commitTransaction();

  } catch (err) {
    const error = new HttpError(
      'Creating Blog failed, please try again.',
      500
    );
    console.log(err);
    return next(error);
  }
  createdBlog.image = "";
  res.status(201).json({ Blog: createdBlog });
};

const getBlogs = async (req, res, next) => {
  
  let blogs;
  try {
    blogs = await Blog.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching blogs failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    blogs: blogs.map(blogs =>
      blogs.toObject({ getters: true })
    )
  });
};

const getFilteredBlogs = async (req, res, next) => {
  const projectId = req.params.bid;
  let blogs;
  try {
    blogs = await Blog.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching blogs failed, please try again later.',
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
  var blogIdArray = [];
  blogs.forEach(function (arrayitem){
    blogIdArray.push(arrayitem.id);
  });

  if(project && blogs){
    project.blogs.forEach(function (arrayitem){
      if(blogIdArray.includes(arrayitem)){ 
        console.log("lo encontró");
        blogs.splice(blogIdArray.indexOf(arrayitem),1);
        blogIdArray.splice(blogIdArray.indexOf(arrayitem),1);
      }
    });
  }

  res.json({
    blogs: blogs.map(blog =>
      blog.toObject({ getters: true })
    )
  });
};

const getBlogsFromBio = async (req, res, next) => {
  const projectId = req.params.bid;
  let blogs = [];
  try {
    blogs = await Blog.find({}, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Fetching blogs failed, please try again later.',
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
  var blogIdArray = [];
  blogs.forEach(function (arrayitem){
    blogIdArray.push(arrayitem.id);
  });

  console.log(project);
  let blogsFromBio = [];
  if(project && blogs){
    project.blogs.forEach(function (arrayitem){
      if(blogIdArray.includes(arrayitem)){ 
        console.log("lo encontró");
        blogsFromBio.push(blogs[blogIdArray.indexOf(arrayitem)]);
      }
    });
  }

    
  console.log(blogsFromBio);

  res.json({
    blogs: blogsFromBio.map(blog =>
      blog.toObject({ getters: true })
    )
  });
};

const updateBlog = async (req, res, next) => {

  const { name, entrada, image, projects} = req.body;
  const blogId = req.params.pid;

  let blog;
  try {
    blog = await Blog.findById(blogId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update blog.',
      500
    );
    return next(error);
  }

  blog.name = name;
  blog.entrada = entrada;
  blog.image = image;
  blog.projects = projects;

  try {
    await blog.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update blog.',
      500
    );
    return next(error);
  }
  blog.image = "";
  res.status(200).json({ blog: blog.toObject({ getters: true }) });
};

const deleteBlog = async (req, res, next) => {
  const blogId = req.params.pid;

  let blog;
  try {
    blog = await Blog.findById(blogId, {image: 0});
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find blog.',
      500
    );
    return next(error);
  }
  console.log(blog);
  if (blog.projects.length > 0){
    const error = new HttpError(
      'El blog contiene proyectos. No se puede eliminar.',
      500
    );
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await blog.remove({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete blog.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted blog.' });
}

exports.getBlogById = getBlogById;
exports.createBlog = createBlog;
exports.getBlogs = getBlogs;
exports.getFilteredBlogs = getFilteredBlogs;
exports.getBlogsFromBio = getBlogsFromBio;
exports.updateBlog = updateBlog;
exports.deleteBlog = deleteBlog;
exports.getBlogPicture = getBlogPicture;