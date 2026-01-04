const Medication = require('../models/medicationsModel');
const asyncHandler = require('express-async-handler');

const addMedication = async (req, res) => {

    const { name, description, dosage_instructions } = req.body;
    try {
        if (!name || !description || !dosage_instructions) {
            return res.status(400).json({ msg: "Not all fields have been entered" })
        }

        const newMedication = new Medication({
            name,
            description,
            dosage_instructions
        });

        const savedMedication = await newMedication.save();
        res.json({ medication: savedMedication, mssg: "medication added successfully!!" });


    } catch (error) {
        res.status(400).json({ mssg: "eroor in addition of medicine" })
        console.log(error)

    }
}
const getMedication = async (req, res) => {
    try {
        const medications = await Medication.find({});
        res.status(200).json(medications);
    } catch (error) {
        res.status(400).json({ mssg: "eroor in getting medications" })
        console.log(error)
    }
}
const getMedicationById = async (req, res) => {
    const { id: MedicineId } = req.params;
    try {
        const medicine = await Medication.findById({_id: MedicineId});

        res.status(200).json({ medication: medicine, mssg: `medicine fetched for ${MedicineId} ` })

    } catch (error) {
        res.status(400).json({ mssg: "error in getting medications" })
        console.log(error)
    }
}

const deleteMed = async (req, res) => {
    const id = req.params.id;
    const medication = await Medication.findByIdAndRemove(id);

    if (!medication) {
        res.status(500);
        throw new Error("medocation with such id does not exists");
    }

    return res.status(201).json({ message: "Medication Successfully" });
};

const updateMedication = asyncHandler(async(req,res)=>{
    const updateMedi = await Medication.findByIdAndUpdate(req.params.id,
            req.body,
            {new: true}
        )
    if(!updateMedi){
        res.status(404);
        throw new Error("MedRecord not found");
    }
    res.status(200).json(updateMedi)
})



module.exports = {getMedication,addMedication,getMedicationById,deleteMed,updateMedication}
