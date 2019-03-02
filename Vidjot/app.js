const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

//how middleware works
// app.use(function(req,res,next){
//     // console.log(Date.now());
//     req.name="Chris";
//     next();
// })

//handlebars middleware
app.engine('handlebars',exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//Index route
app.get('/',(req,res) =>{
    const title = 'Hello World';
    res.render("index",{
        title: title
    });
})

//About
app.get('/about', (req, res) =>{
    res.render('About');
})

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
})