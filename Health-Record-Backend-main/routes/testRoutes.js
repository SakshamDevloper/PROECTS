const Router = require('express');
const {getAllTest,addTest,getSingleTest,deleteTest,updateTest} = require('../controllers/testController')
const router = Router();

router.route('/').get(getAllTest).post(addTest);
router.route('/:id').get(getSingleTest).delete(deleteTest).put(updateTest);


module.exports = router