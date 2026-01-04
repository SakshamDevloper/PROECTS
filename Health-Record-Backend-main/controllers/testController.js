const asyncHandler = require('express-async-handler');
const {Test} = require('../models/testreportsModel') 
const getAllTest = asyncHandler(async (req,res) => {

    const tests = await Test.find({});
    res.status(200).json(tests);
});

const addTest = asyncHandler(async(req,res)=>{

    const {name,price,description,category} = req.body;
    if(!name || !price || !description ||!category){
        res.status(400);
        throw new Error("all fields are required");
    }

    const test = await Test.create({name,price,description,category});
    res.status(200).json({"test": test,"msg": "All data received"});
});

const getSingleTest = asyncHandler(async(req,res)=>{
    const {id: testId} = req.params;
    const test = await Test.findById({_id: testId});
    if(!test){
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json(test);
});

const deleteTest = asyncHandler(async(req,res)=>{
    const {id: testId} = req.params;
    const test = await Test.findByIdAndDelete({_id: testId});
    if(!test){
        res.status(404);
        throw new Error("Test not found"); 
    }
    res.status(200).json({"msg": "Deleted"})
    
});

const updateTest = asyncHandler(async(req,res)=>{
    const updateTest = await Test.findByIdAndUpdate(req.params.id,
            req.body,
            {new: true}
        )
    if(!updateTest){
        res.status(404);
        throw new Error("Test not found");
    }
    res.status(200).json(updateTest)
})


module.exports = {getAllTest,getSingleTest,deleteTest,addTest,updateTest};