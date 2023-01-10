const Doghotel = require('../models/doghotel');
const Review = require('../models/review');



module.exports.createReview = async(req, res) => {
    const doghotel = await Doghotel.findById(req.params.id);
    // review[rating] and review[body] out under the key of review
    const review = new Review(req.body.review);
    
    review.author = req.user._id;

    doghotel.reviews.push(review);
    console.log(review);
    await review.save()
    await doghotel.save()
    req.flash('success', "Thanks for your review!")
    res.redirect(`/doghotels/${doghotel._id}`)
  }


  module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    //remove from array mongo- this is the recommended solution: pull
    await Doghotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully deleted review!")
    // why not do .save() ? 
    res.redirect(`/doghotels/${id}`);
}