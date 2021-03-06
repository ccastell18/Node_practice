const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load user model
const User = mongoose.model('users');

//export function with strategy within.  passed in instance of passport.
module.exports = function(passport){
passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    //Match user
    User.findOne({
        email:email
    }).then(user =>{
        if(!user){
            //done function (error, user, message)
            return done(null, false, {message: "No user found"});
        }
        //Match password
        //checks password from form and hashed password from user model
        bcrypt.compare(password, user.password, (err, isMatch) =>{
            if(err) throw err;
            if(isMatch){
                return done(null, user)
            }else{
                return done(null, false, {message: "Password incorrect"});
            }
        })
    })
}));

passport.serializeUser(function(user, done){
    done(null, user.id);
});
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    })
})

}