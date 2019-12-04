const User = require('../models/user');

//render index
exports.home = (req, res, next) =>{
    User.find({}, (err) => {
        if(err) {return next(err);}
        else{
            res.render('index', {user:req.user});
        }
    });
}