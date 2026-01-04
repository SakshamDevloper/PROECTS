const mongoose = require('mongoose');

const doctorModel = mongoose.Schema({
    fname:{
        type:String,
        required:true,
    },
    lname:{
        type:String,
        required:true
    },
    specialization:{
        type:String,
        required:true
    },
    contact_info:{
        type:String,
        required:true
    },
    fees:{
        type:Number
    },
    
    medRecords: [{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'MedRecord'
    }]
})

doctorModel.static('getFullName', function(doctor) { return `${doctor.fname}+${doctor.lname}` });

const Doctor = mongoose.model('Doctor',doctorModel);

module.exports = Doctor
