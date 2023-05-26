const express = require('express');
const router = express.Router();
const localityController = require('../controllers/localityController');



router.post("/locality",localityController.create);


module.exports = router;
