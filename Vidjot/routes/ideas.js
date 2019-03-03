const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

 //Idea model
 require('../models/Idea');
 const Idea = mongoose.model('ideas');

  
  //GET ideas index
  router.get('/', (req, res) => {
    //leaving empty {} finds all
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas =>{
      res.render('ideas/index', {
        ideas: ideas
      })
    })
    
  })
  
  //Add Idea route
  router.get('/add', (req, res) =>{
    res.render('ideas/add');
  })
  
  //EDIT Idea route
  router.get('/edit/:id', (req, res) =>{
    Idea.findOne({
      _id: req.params.id
    })
    .then(idea => {
      res.render( 'ideas/edit', {
        idea: idea
      })
    })
  })
  
  
  //process form
  router.post('/', (req, res) =>{
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
        details: req.body.details
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
  router.put('/:id', (req, res) =>{
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
  router.delete('/:id', (req, res) =>{
    Idea.deleteOne({_id: req.params.id})
      .then(() => {
        req.flash('success_msg', 'Video Idea has been removed')
        res.redirect('/ideas')
      })
  })
  

module.exports = router;