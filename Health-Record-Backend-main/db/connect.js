const mongoose = require('mongoose');



const connectDB = (url) => {
    mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true });
    console.log('mongo is running')
}

module.exports = connectDB;