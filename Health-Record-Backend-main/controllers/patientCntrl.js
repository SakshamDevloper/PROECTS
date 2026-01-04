const asyncHandler = require('express-async-handler');
const {Patient} = require('../models/patientModel');



const getAllPatient = asyncHandler(async(req,res)=>{

    const patients = await Patient.find().lean()
    res.status(200).json(patients);
});

const addPatient = asyncHandler(async(req,res)=>{

    const {fname,lname,date_of_birth,gender, contact_info, insurance_details} = req.body;

    if(!fname || !lname || !date_of_birth || ! contact_info){
        res.status(401);
        throw new Error("All fields are mandatory");
    }

    const patient = await Patient.create({
        fname,lname,date_of_birth,contact_info,gender,insurance_details
    });

    res.status(201).json(patient);
});

const getSinglePatient = asyncHandler(async (req,res) => {

    const { id: patientId } = req.params;
    const patient = await Patient.findById({_id: patientId});

    if(!patient){
        res.status(404);
        throw new Error(`Patient with  id: ${patientId} does not exists`)
    }

    res.status(200).json(patient);
});

const deletePatient = asyncHandler( async (req,res) => {
    const { id: patientId } = req.params;
    const patient = await Patient.findById({_id: patientId});

    if(!patient){
        res.status(404);
        throw new Error(`Patient with  id: ${patientId} does not exists`)
    }
    await patient.remove();
    res.status(200).json({ patient: null, status: "success" });
});

const updatePatient = asyncHandler( async(req,res)=>{
    const { id: patientId } = req.params;
    const patient = await Patient.findById({_id: patientId});

    if(!patient){
        res.status(404);
        throw new Error(`Patient with  id: ${patientId} does not exists`)
    }

    const updated_patient = await Patient.findByIdAndUpdate(patientId,req.body, {new: true});
    res.status(200).json(updated_patient);
})

module.exports = {addPatient, getAllPatient,deletePatient,getSinglePatient,updatePatient}