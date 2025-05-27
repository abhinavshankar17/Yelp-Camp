const cities = require('./cities')
const Campground = require('../models/campground')
const {places, descriptors} = require('./seedHelpers')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')



const db = mongoose.connection
db.on('error' , console.error.bind(console , 'connection error :'))
db.once('open' , () =>{
    console.log('Database Connected')
}) 

const sample = array => array[Math.floor(Math.random()*array.length)]

const seedDB = async () =>{
    await Campground.deleteMany({})
    for(let i = 0 ; i < 50 ; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 1
        const camp = new Campground({
            author: '6802211bb274b7f53bc24b74' ,
            location: `${cities[random1000].city} , ${cities[random1000].state}`,   
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias ullam impedit eum earum aspernatur ab, qui, unde facilis sed ipsam hic adipisci? Pariatur debitis quidem, id autem veniam ullam maiores!',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dg0jhfi4g/image/upload/v1746725087/YelpCamp/tzcuckktuv9tqo8km4gl.jpg',
                    filename: 'YelpCamp/tzcuckktuv9tqo8km4gl',
                  },
                  {
                    url: 'https://res.cloudinary.com/dg0jhfi4g/image/upload/v1746725080/YelpCamp/cpztzijzrdcllojb7hjs.jpg',
                    filename: 'YelpCamp/cpztzijzrdcllojb7hjs',
                  }
                  
            ]
        })
        await camp.save()
    }
    // const c = new Campground ({title: 'purple field' })
    // await c.save();
}

seedDB().then(() =>{
    mongoose.connection.close()
})