const mongoose = require('mongoose');
const Doghotel = require('../models/doghotel')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/doghotels', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  //useCreateIndex: true not needed anymore
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

picList = [
pic1 = 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347447/Doghotels/dog2_c7no97.jpg',
pic2 = 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347445/Doghotels/dog3_rkzi7m.jpg',
pic3= 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347445/Doghotels/dog10_klkymz.jpg',
pic4 = "https://res.cloudinary.com/ddrhjppie/image/upload/v1673347445/Doghotels/dog5_wyhbnk.jpg",
pic5 = 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347443/Doghotels/dog6_ijajmr.jpg',
pic6= 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347441/Doghotels/dog1_di50ne.jpg',
pic7= 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347437/Doghotels/dog7_e12mnv.jpg',
pic8= 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347436/Doghotels/dog8_qfglet.jpg',
pic9= 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347435/Doghotels/dog9_rzh5za.jpg',
pic10= 'https://res.cloudinary.com/ddrhjppie/image/upload/v1673347432/Doghotels/dog4_uo3vec.jpg',
];

const seedDB = async () => {
  await Doghotel.deleteMany({});
  for (let i = 0; i < 300; i++) {

    const picPicker = Math.floor( Math.random() * picList.length)
    var picPicker2 = Math.floor( Math.random() * picList.length)

    if (picPicker === picPicker2) {

      while (picPicker === picPicker2) {
        picPicker2 = Math.floor( Math.random() * picList.length);
      }
      console.log(picPicker, picPicker2)
      console.log("DOGO")
    }; 

    url1 = picList[picPicker];
    url2 = picList[picPicker2];

 
    const random16478 = Math.floor(Math.random() * 16478);
    const price = Math.floor(Math.random() * 30) + 10;
 
    const c = new Doghotel({
      
      // MY USER ID
      author: '63bd49c1a325fa63e16aa48b',
      location: `${cities[random16478].city},  ${cities[random16478].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,

      
      images: [
        {
          url: url1,
          filename: 'Doghotels/1',
        },
        {
          url: url2,
          filename: 'Doghotels/2',
        }
      ],
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus doloribus alias et perferendis molestiae quibusdam, sed a repudiandae vitae minima doloremque cupiditate ad quia veritatis! Voluptates impedit iusto itaque quia.",
      price,
      geometry: { type: 'Point', coordinates: [cities[random16478].longitude,cities[random16478].latitude] },

    })
    await c.save();
  }
}


//seedDB();

// directly close Database after connected and seeded the file names
seedDB().then(() => {
  mongoose.connection.close();
})


//update Seeds file: 
//node seeds/index.js
