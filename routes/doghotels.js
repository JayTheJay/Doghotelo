const express = require("express");
const router = express.Router();
const doghotels = require ('../controllers/doghotels')
const  catchAsync = require("../utils/catchAsync");
const {isLoggedIn, isAuthor, validateDoghotel} = require('../middleware');
const multer = require('multer');
// it automatically finds the index file 
const {storage} = require('../cloudinary'); 
//const upload = multer({dest: 'uploads/'});
const upload = multer({storage});


router.route('/')
  .get(catchAsync(doghotels.index))
  // in production we want first to validate and then to upload the image!
  .post(isLoggedIn, upload.array('image'), validateDoghotel, catchAsync(doghotels.createDoghotel));
 

router.get('/new', isLoggedIn, doghotels.renderNewForm);


router.route('/:id')
.get(catchAsync(doghotels.showDoghotel))
.put(isLoggedIn, isAuthor, upload.array('image'),validateDoghotel, catchAsync(doghotels.updateDoghotel))
.delete(isLoggedIn, isAuthor, catchAsync(doghotels.deleteDoghotel));
  

  
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(doghotels.renderEditForm));
  


  //async not needed here --- new needs to be before ID- otherwise treated as ID!!    
  // first run validateDoghotel then - async

  
//   const handleValdiationErr = err  => {
//       console.log(err);
//       return err;
//   }
  // .populate add model reference to doghotel mode--- reviews and author model
  
  
  

  

  module.exports = router;