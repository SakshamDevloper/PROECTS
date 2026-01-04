const express = require('express')
const errorHandler = require('./middlewares/errorHandler');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const testRoutes = require('./routes/testRoutes');
const medRecRoutes = require('./routes/medRecRoutes');
const medictnRoutes = require('./routes/medictnRoutes');
const connectDB = require('./db/connect');
const cors = require('cors');
const { Test } = require('./models/testreportsModel');
const MedRecord = require('./models/medRecModel');

require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT || 3000


const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port,()=>{
            console.log(`Server started on ${port}`)
        });
    }catch(err){
        console.log(err);
    }
};

// MedRecord.deleteMany()


app.use(express.json());
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/doctors',doctorRoutes);
app.use('/api/v1/tests',testRoutes);
app.use('/api/v1/med_records',medRecRoutes);
app.use('/api/v1/medications',medictnRoutes);
app.use(errorHandler);

start();
