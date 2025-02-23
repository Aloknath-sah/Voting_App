const mongoose = require('mongoose');
require('dotenv').config();

//Define the mongodb connection url
const mongoURL = process.env.MONGODB_URL_LOCAL

//Setting up mongodb connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//Get the default connection
const db = mongoose.connection;

//Define event listners for database collection
db.on('connected', () => {
    console.log('Connected to MongoDB Server');
})

db.on('error', (err) => {
    console.log('MongoDb connection error', err);
})

db.on('disconnected', () => {
    console.log('mongoDB disconnected');
})

module.exports = db;