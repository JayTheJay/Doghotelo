

const { array } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;



const ImageSchema = new Schema({
    url: String, 
    filename: String
});

// virtual for not storing in databse or model, because it is just derived from already stored url
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
})

ImageSchema.virtual('cardImage').get(function() {   return this.url.replace('/upload', '/upload/ar_4:3,c_crop'); })

const opts = {toJSON: { virtuals: true}};

const DoghotelScheema = new Schema ({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    // list cuase of multiple review entries?
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
],
author: {
    type: Schema.Types.ObjectId,
    ref: "User"
}
},opts);


DoghotelScheema.virtual('properties.popUpMarkup').get(function () {
    return `<link rel="stylesheet" href="/stylesheets/app.css"><div class= "container-popup"><strong><a href="doghotels/${this._id}" >${this.title}</a></strong>
    <p>${this.description.substring(0,30)}...</p>
    <img src=${this.images[0].url.replace('/upload', '/upload/w_400/h_100')}></div>`
});

// query vs document middleware
DoghotelScheema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        console.log(doc)
        await Review.deleteMany({
            _id: {
                // id for each review is somewhere in document doc.reviews
                $in: doc.reviews
            }
        })
    }
    console.log(doc)
})

module.exports = mongoose.model('Doghotels', DoghotelScheema);

