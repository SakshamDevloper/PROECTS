const mongoose=require('mongoose');
;

const medicalRecord = mongoose.Schema({
    for_patient:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Patient'
    },
    record_date:{
        type:Date,
        default:Date.now()
    },
    assigned_by_doctor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Doctor'
    },
    prescription:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Medication'
    },

    test_assigned:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Test'
    }
})

const MedRecord = mongoose.model("MedRecord", medicalRecord);

module.exports = MedRecord;
