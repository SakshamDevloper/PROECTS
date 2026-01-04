const Router = require('express');
const {getAllMeds,addMedRec,getSingleMedRec,deleteMedRecord,updateMedRec} = require('../controllers/medRecordCntrl')
const router = Router();

router.route('/').get(getAllMeds).post(addMedRec);
router.route('/:id').get(getSingleMedRec).delete(deleteMedRecord).put(updateMedRec);


module.exports = router