const Router = require('express');
const {addMedication,getMedication,deleteMed,getMedicationById,updateMedication} = require('../controllers/mediCntrl')
const router = Router();

router.route('/').get(getMedication).post(addMedication);
router.route('/:id').get(getMedicationById).delete(deleteMed).put(updateMedication);


module.exports = router