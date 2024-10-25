const express = require('express');
const router = express.Router();
const wrapAsync =require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const {isLoggedIn,isOwner,validateListing} = require('../middleware/middleware.js');
const listingController = require('../controllers/listings.js');
const multer  = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })




/* app.get('/testListing',async(req,res)=>{
    const sampleListing = new Listing({
        title: 'My new Villa',
        description: 'By the Beach',
        price: 1200,
        location: 'Calangute,Goa',
        country:'India',
    });

    await sampleListing.save();
    console.log('sample was save');
    res.send('Test Listing Created!'); 
}) */



// index Route
router.get('/', wrapAsync(listingController.index));

// create Route
router.post('/',isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))

/* router.post('/', upload.single('listing[image]'),(req,res)=>{
    res.send(req.file);
}); */


// new Route
router.get('/new',isLoggedIn, listingController.renderNewForm )

// show Route
router.get('/:id', wrapAsync(listingController.showListing));


// Edit Route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.editListing))

// Update Route
router.put('/:id',isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing));

// Delete Route
router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));


module.exports = router;