const express = require('express');

const app = express();

//how middleware works
app.use(function(req,res,next){
    // console.log(Date.now());
    req.name="Chris";
    next();
})

//Index route
app.get('/',(req,res) =>{
    console.log(req.name)
    res.send("index");
})

//About
app.get('/about', (req, res) =>{
    res.send('About');
})

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
})