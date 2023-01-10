const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema ({
    body: String,
    rating: Number,
    author: {
    type: Schema.Types.ObjectId,
    ref:'User'
}
});

module.exports = mongoose.model('Review', reviewSchema);

// breaking out in own model not in doghotel, as can be 1000 of reviews, store only object ids in doghotel