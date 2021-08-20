// Request Express
const express = require('express');

// require mongoose
const mongoose = require('mongoose');

// Store express in app variable 
const app  = express();

//get the short url shcema from models
const  ShortUrl = require('./models/ShortUrl');

// connect to the mongo db database

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})


// se the ejs views
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false}));

// get the home page
app.get('/', async (req, res) => {
    // render the home.ejs on the browser
    const shortUrls = await ShortUrl.find()
    res.render('home', {shortUrls: shortUrls});

})

// post the short url in the form
app.post('/shortUrls', async (req, res) => {
    // create new shortUrl 
    await ShortUrl.create({full: req.body.longUrl})
    res.redirect('/')
})

// make the short url generated work

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})

    if (shortUrl == null) return res.status("Error, that link does not exist")

    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
})

// Call the app and set port to listen to 
app.listen(process.env.PORT || 7000);