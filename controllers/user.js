const User = require('../models/user');

module.exports.signUp = async(req, res) => {
    try {
        let {username, email, password } = req.body;
        const newUser=new User({email,username});
        const regiuser =await User.register(newUser,password);
        // console.log(regiuser);
        req.login(regiuser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success',"Welcome to Wanderlust!");
            res.redirect('/listings')
        })
       
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/signup');
    } 
};

module.exports.login = async(req,res)=>{

    req.flash('success',"Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl ||'/listings'
    res.redirect(redirectUrl);
};


module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err) {
            return next(err);
        }
        req.flash('success',"Logged out successfully!");
        res.redirect('/listings');
    });
    
}