const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const shortUrl = require('./models/shortUrl');

require('dotenv').config();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const NODE_ENV = process.env.NODE_ENV;

const mongooseURI = `mongodb:${MONGODB_USERNAME}//:${MONGODB_PASSWORD}@ds143474.mlab.com:43474/heroku_g6frgrs2`;
//const mongooseURI = 'mongodb://localhost/urlShortenerDb';


mongoose.connect(
    mongooseURI,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req,res)=>{
    const shortUrls = await shortUrl.find();
    res.render("index", { shortUrls: shortUrls});
});

app.post('/shortUrls', async (req,res)=>{
    await ShortUrl.create({ full: req.body.fullUrl });
    
    res.redirect('/');
})

//needs to be at the very bottom!
app.get('*/:shortUrl', async (req,res)=> {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if(shortUrl == null) return res.sendStatus(404);
    
    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
})

app.listen(3000 || process.env.PORT, () => {
    console.log(`Server is listening on localhost to port 3000`);
});