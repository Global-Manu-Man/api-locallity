const express = require('express');
const router = express.Router();
const localityController = require('../controllers/localityController');
const discountController = require('../controllers/discountController');


//Locality

router.post("/locality",localityController.create);
router.get("/locality/:id",localityController.getItems);
router.post("/locality/update",localityController.UpdateData);
router.get("/locality/delete/:id",localityController.deleteItem);
router.get("/locality/deleteOne/:id",localityController.deleteSingleImg);

//discount 
router.post("/discount",discountController.createCode)
router.get("/discount/delete/:code",discountController.deleteCode)

module.exports = router;
