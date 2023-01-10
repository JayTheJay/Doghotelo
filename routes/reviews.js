const express = require("express");
const  catchAsync = require("../utils/catchAsync");
//now all params from app will also be merged alongside reviews.js
// we will have access to this ID- wihtout option below: Cannot read properties of null (reading 'reviews') 
// because here ID comes also from doghotel: doghotel id
const router = express.Router({mergeParams: true});

const reviews = require ('../controllers/reviews')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');








// reviews
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//we hide the buttom, but in case someone would send a delete requets we need to use middleware: 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;
