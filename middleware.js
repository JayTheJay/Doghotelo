const { doghotelSchema,reviewSchema } = require('./scheemas.js');
const Doghotel = require('./models/doghotel');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        ///store url redirect to login, then if submitted send back to url
        //req.path, req.originalUrl - we wnat to store the original path
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    //if you are authenticated: 
    next();
}



module.exports.validateDoghotel = (req, res, next) => {
    //destructure from result--- error
    const { error } = doghotelSchema.validate(req.body);
    if (error){
       // details is array of object return single new array joined with new comma 
       const msg = error.details.map(el => el.message).join(',')
       throw new ExpressError(msg, 400)
   } else {
       next();
   }
   }

module.exports.isAuthor =   async(req, res, next) => {
    const {id} = req.params;
    const doghotel = await Doghotel.findById(id);
    if(!doghotel.author.equals(req.user._id)){
      req.flash('error', 'You do not have permission to update the dog hotel');
      return res.redirect(`/doghotels/${id}`);
  };
  next();
  }


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error){
        // details is array of object return single new array joined with new comma 
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    }
    

// we have review id and doghotelo id, cause: /doghotelo/id/reviews/reviewId
    module.exports.isReviewAuthor =   async(req, res, next) => {
        const {id, reviewId} = req.params;
        const review = await Review.findById(reviewId);
        if(!review.author.equals(req.user._id)){
          req.flash('error', 'You do not have permission to update the dog hotel');
          return res.redirect(`/doghotels/${id}`);
      };
      next();
      }
    