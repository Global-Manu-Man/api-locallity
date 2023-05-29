const express = require('express');
const router = express.Router();
const localityController = require('../controllers/localityController');



router.post("/locality",localityController.create);
router.get("/locality/:id",localityController.getItems);


module.exports = router;
