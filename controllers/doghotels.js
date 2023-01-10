const Doghotel = require('../models/doghotel');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOXTOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});  


    
    //add conditional statement: dont add mapbox to every page: optimize
    //validate amount and size of pictures needed!
    //validate if forbidden type is uploaded/ create a default if 0 images
    // normalizing height to make exact same size with transform api/ css- keep center of image
    //add default picture in show page
    // creating/updating doghotel- keep at least once picture!


module.exports.index = async(req, res) => {
    const doghotels =  await Doghotel.find({});   
    console.log(doghotels)
    res.render('hotels/index', {doghotels})
  }


  

  module.exports.renderNewForm = (req, res) => {
    res.render('hotels/new');
  }


  module.exports.createDoghotel = async(req,res, next) => {
   
   const geoData= await geoCoder.forwardGeocode({
      query: req.body.doghotel.location,
      limit: 1
    }).send()

    //if (!req.body.doghotel) throw new ExpressError("Invalid CG Data", 400);
    //OUR NEW MODEL INSIDE DB!
    const doghotel = new Doghotel (req.body.doghotel);
    doghotel.geometry = geoData.body.features[0].geometry;
    // if upload 2 file: makes us an array that contains url and filename - map over array which is added to req.files
    doghotel.images =  req.files.map(f => ({url: f.path, filename: f.filename}));
    // connect author id with current user signed in
    doghotel.author = req.user._id;
    await doghotel.save();
    console.log(doghotel);
    req.flash('success', "Successfully created a new dog hotel!")
    res.redirect(`hotels/${doghotel._id}`)
  
}


module.exports.showDoghotel = async(req, res, next) => {
  const doghotel = await Doghotel.findById(req.params.id)
  // in larger app remove number of reviews we get. or get new we new scroll. 
  // populate all the reviews from the reviews array on the 1 doghotel we are finding, then populate on each one of them the author
  .populate({path: "reviews",
  // , and then seperately, populate this one author on this doghotel 
  populate:{path:'author'
}
}).populate("author");
    if(!doghotel){
        req.flash('error', 'The searched dog hotel has been deleted!');
        return res.redirect("/hotels");
    }
  //return or else..: res.render wont run
//  if (!doghotel) {
   //   return next(new routerError("Doghotel not found", 404));
  //}
  console.log(doghotel);
  res.render('hotels/show', {doghotel});
}



module.exports.renderEditForm = async(req, res) => {
  const {id} = req.params;
 const doghotel = await Doghotel.findById(id)
 if(!doghotel){
   req.flash('error', 'The searched dog hotel has been deleted!');
   return res.redirect("/hotels");
};

 res.render('hotels/edit', {doghotel})
}
// OPTIMIZATION: SAVE  Doghotel ONLY ONCE VIA FINDBYID AND UPDATE and integrate img
module.exports.updateDoghotel = async(req, res) => {
  // ... spread object- so into title and location- components
  const {id} = req.params;
  console.log(req.body);
    /// dont do findByIdAndUpdate all at once:
  const doghotel = await Doghotel.findByIdAndUpdate(id, {...req.body.doghotel});
  // if want updated data, pass above in {new:true}
  //add new image   
  const img = req.files.map(f => ({url: f.path, filename: f.filename}))
  //spread array with ... - seperate arguments to push
  doghotel.images.push(...img);
  await doghotel.save();
  
  if(req.body.deleteImages){
      for (let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
      //pull from the images array all images where the filename is within the req.body.deleteImages array
      await doghotel.updateOne({$pull: {images:{filename: {$in: req.body.deleteImages}}}})
      console.log(doghotel)
} 
  req.flash('success', "Successfully updated dog hotel!")
  res.redirect(`/hotels/${doghotel._id}`)
}

module.exports.deleteDoghotel = async(req, res) => {
  const {id} = req.params;
  const doghotel = await Doghotel.findByIdAndDelete(id);
  req.flash('success', "Successfully deleted dog hotel!")
  res.redirect(`/hotels`)
}