const express = require('express');
const exphbs  = require('express-handlebars');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev',
{ useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

  //Idea model
  require('./models/Idea');
  const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));


// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// About Route
app.get('/about', (req, res) => {
  res.render('about');
});

//GET ideas index
app.get('/ideas', (req, res) => {
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
app.get('/ideas/add', (req, res) =>{
  res.render('ideas/add');
})

//EDIT Idea route
app.get('/ideas/edit/:id', (req, res) =>{
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
app.post('/ideas', (req, res) =>{
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
        res.redirect('/ideas');
      })
  }
})

//Edit Form
app.put('/ideas/:id', (req, res) =>{
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea =>{
    //new values
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
      .then(idea =>{
        res.redirect('/ideas');
      })
  })
})

//Delete Idea
app.delete('/ideas/:id', (req, res) =>{
  Idea.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/ideas')
    })
})




const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});