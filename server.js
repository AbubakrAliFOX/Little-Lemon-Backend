const express = require('express');
const router = require('./routes/userRoutes.js')
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
// console.log(process.env.JWT_SECRET);

// Cors
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

// MiddleWare
const errorHandler = require('./middleware/errorhandler.js');


// DB Connection
const dbUrl = process.env.DB_URL;
const locallUrl = 'mongodb://127.0.0.1:27017/little-lemon';
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
})

// MiddleWare
app.use(express.json()); 
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/user', router);

app.use(errorHandler);

app.listen(3000, () => console.log('Running on 3000'));