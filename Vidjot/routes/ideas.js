const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated} = require('../helpers/auth');

 //Idea model
 require('../models/Idea');
 const Idea = mongoose.model('ideas');

  
  //GET ideas index
  router.get('/',ensureAuthenticated, (req, res) => {
    //leaving empty {} finds all
    Idea.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas =>{
      res.render('ideas/index', {
        ideas: ideas
      })
    })
    
  })
  
  //Add Idea route
  router.get('/add',ensureAuthenticated, (req, res) =>{
    res.render('ideas/add');
  })
  
  //EDIT Idea route
  router.get('/edit/:id', ensureAuthenticated, (req, res) =>{
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      if(idea.user != req.user.id){
        req.flash('error_msg', 'Not authorized')
        res.redirect('/ideas');
      }else{
      res.render( 'ideas/edit', {
        idea: idea
      })
    }
    })
  })
  
  
  //process form
  router.post('/', ensureAuthenticated,(req, res) =>{
    let errors = [];
    if(!req.body.title){
      errors.push({text: 'Please add a title'})
    }
    if(!req.body.details){
      errors.push({text: 'Please add a details'})
    }
  
    if(errors.length > 0){
      res.render('ideas/add', {
        errors: errors,
        title: req.body.title,
        details: req.body.details
      })
    }else{
      const newUser = {
        title: req.body.title,
        details: req.body.details,
        user: req.user.id
      }
      //Idea schema. saved items go in the parenthesis.
      new Idea(newUser)
        .save()
        .then(idea =>{
          req.flash('success_msg', 'Video Idea has been added')
          res.redirect('/ideas');
        })
    }
  })
  
  //Edit Form
  router.put('/:id',ensureAuthenticated, (req, res) =>{
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea =>{
      //new values
      idea.title = req.body.title;
      idea.details = req.body.details;
      idea.save()
        .then(idea =>{
          req.flash('success_msg', 'Video Idea has been updated')
          res.redirect('/ideas');
        })
    })
  })
  
  //Delete Idea
  router.delete('/:id',ensureAuthenticated, (req, res) =>{
    Idea.deleteOne({_id: req.params.id})
      .then(() => {
        req.flash('success_msg', 'Video Idea has been removed')
        res.redirect('/ideas')
      })
  })
  

module.exports = router;