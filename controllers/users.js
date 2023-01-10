const User = require('../models/user');


module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}


module.exports.register = async(req, res, next) => {
    try{
    const {email, username, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);  
    req.login(registeredUser, err => {
        //error calback needed for this function
        if(err) return next(err);
        req.flash('success', "Welcome to Doghotelo");
        res.redirect('/doghotels');  
    });
} catch(error) {
    // flash relevnant error message
    req.flash('error', error.message);
    res.redirect('register');
} 

}


module.exports.renderLogin = (req, res) => {
    res.render("users/login");
    }

module.exports.login = (req, res) => {
    req.flash('success', "welcome back!");
    const redirectUrl = req.session.returnTo || '/doghotels';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
    }


    module.exports.logout = (req, res, next) => {
        req.logout(function(err) {
            if (err) { return next(err); }});
         req.flash("success", "Successfully logged out");
         res.redirect('/doghotels');
    }