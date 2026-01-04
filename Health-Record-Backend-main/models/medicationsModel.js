const mongoose = require('mongoose');

const medicationModel = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required:true
    },
    dosage_instructions:{
        type:String,
        required:true
    },

    medRecord: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'MedRecord'
    }
})

const Medication = mongoose.model('Medication',medicationModel);

module.exports = Medication;
