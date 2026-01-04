const Router = require('express');
const {getAllPatient,addPatient,getSinglePatient, deletePatient, updatePatient} = require('../controllers/patientCntrl')
const router = Router();

router.route('/').get(getAllPatient).post(addPatient);
router.route('/:id').get(getSinglePatient).put(updatePatient).delete(deletePatient);


module.exports = router