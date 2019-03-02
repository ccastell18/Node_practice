const express = require('express');

const app = express();

//Index route
app.get('/',(req,res) =>{
    res.send("Index");
})

//About
app.get('/about', (req, res) =>{
    res.send('About');
})

const port = 5000;

app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
})