const express = require('express')
const router = express.Router() 
const catchAsync = require('../utilities/catchAsync')
const Campground = require('../models/campground')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

const Joi = require('joi');
const{ isLoggedIn , isAuthor , validateCampground} = require('../middleware')
const campground = require('../models/campground')

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn ,  upload.array('image') , validateCampground  ,catchAsync(campgrounds.createCampground))
    


router.get('/new' , isLoggedIn , campgrounds.renderNewForm)    

router.route('/:id') 
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn , isAuthor , upload.array('image')   , validateCampground , catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn , isAuthor , catchAsync(campgrounds.deleteCampground))   



router.get('/:id/edit' , isLoggedIn , isAuthor  , catchAsync(campgrounds.renderEditForm))

// app.put('/campgrounds/:id' , async(req , res) =>{
//     const {id} = req.params
//  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground} )
//    res.redirect(`/campgrounds/${campground._id}`)
// })



// app.delete('/campground/:id' , async (req, res) =>{
//     const {id} = req.params
//     await Campground.findById

// })


module.exports = router
