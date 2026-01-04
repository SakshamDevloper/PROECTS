const {Router} = require('express')
const {getAllDoc, addDoc,getDocById,updateDoc,deleteDoc} = require('../controllers/doctorControllers')
const router = Router();

router.get('/',getAllDoc);
router.get('/:id',getDocById);
router.post('/',addDoc);
router.put('/:id',updateDoc);
router.delete('/:id',deleteDoc);

module.exports = router;
