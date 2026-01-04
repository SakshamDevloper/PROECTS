const asyncHandler = require('express-async-handler')
const MedRecord = require('../models/medRecModel');
const Medication = require('../models/medicationsModel');
const { Patient } = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const { Test } = require('../models/testreportsModel');

const getAllMeds = asyncHandler(async (req,res) => {

    const medRec = await MedRecord.find({}).populate('for_patient').populate('assigned_by_doctor').populate('prescription').populate('test_assigned')
    res.status(200).json(medRec);
});

const addMedRec = asyncHandler(async(req,res)=>{
    const {for_patient,assigned_by_doctor,prescription, test_assigned} = req.body;

    if(!for_patient || !assigned_by_doctor || !prescription){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    if(!test_assigned){
        test_assigned = "None";
    }

    const medRec = await MedRecord.create({for_patient,
        assigned_by_doctor,prescription,test_assigned
    });

    const patient = await Patient.findById({_id: for_patient});
    await patient.medical_history.push(medRec);
    patient.save();

    const doctor = await Doctor.findById({_id: assigned_by_doctor});
    await doctor.medRecords.push(medRec)
    doctor.save()

    res.status(200).json(medRec);
});

const getSingleMedRec = asyncHandler(async(req,res)=>{

    const {id: medId} = req.params;
    const medRec = await MedRecord.findById({_id: medId}).populate('for_patient').populate('assigned_by_doctor').populate('prescription').populate('test_assigned')
    if(!medRec){
        res.status(404);
        throw new Error(`Med record with id ${medId} does not exist`);
    }
    res.status(200).json(medRec);
});

const deleteMedRecord = asyncHandler(async(req, res)=>{
    const {id: medId} = req.params;
    const medRecd = await MedRecord.findById({_id: medId});
    const medRec = await MedRecord.findOneAndDelete({_id: medId});
    if(!medRec){
        res.status(404);
        throw new Error(`Med record with id ${medId} does not exist`);
    }

    res.status(200).json({rec:medRec,mssg:"medicine deleted succesfully"});
    
});

const updateMedRec = asyncHandler(async(req,res)=>{

    const medRec = await MedRecord.findById({_id: req.params.id})
    if(!medRec){
        res.status(404);
        throw new Error(`Med_Reord with ${req.params.id} does not exists`)
    }
    const {for_patient, assigned_by_doctor, prescription, test_assigned} = req.body;
    const patient = await Patient.findById({_id: for_patient});

    if(!patient){
        res.status(404);
        throw new Error(`Patient with id ${for_patient} does not exists`)
    }else{
        if(medRec.for_patient != for_patient){
            await patient.medical_history.push(medRec);
            patient.save();
        }    
    }
    
    const doctor = await Doctor.findById({_id: assigned_by_doctor});

    if(!doctor){
        res.status(404);
        throw new Error(`Doctor with id ${assigned_by_doctor} does not exists`)
    }else{

        if(medRec.assigned_by_doctor != assigned_by_doctor){
            await doctor.medRecords.push(medRec);
            doctor.save();
        }
        
    }

    const pres = await Medication.findById({_id: prescription});
    
    if(!pres){
        res.status(404);
        throw new Error(`Prescription with id ${prescription} does not exists`)
    }

    const test_as = await Test.findById(test_assigned)
    if(!test_as){
        res.status(404);
        throw new Error(`Test with id ${test_assigned} does not exists`)
    }
    
    const updateRec = await MedRecord.findOneAndUpdate(req.params.id,
            doctor_name,patientId, prescription, testResult,
            {new: true}
        )
    res.status(200).json(updateRec)
})



module.exports={
    deleteMedRecord,
    getSingleMedRec,
    getAllMeds,
    addMedRec,
    updateMedRec

}
