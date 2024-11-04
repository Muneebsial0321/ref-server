const express = require('express');
const router = express.Router();
const { createWithdrawReq, acceptWithdrawReq, getAllReqs,getMyReqs} = require('../controller/WidthDraw'); // Adjust the path as needed

router.post('/', createWithdrawReq);

// Route for accepting a withdrawal request
router.put('/:id', acceptWithdrawReq);

// Route for getting all withdrawal requests
router.get('/', getAllReqs);
router.get('/:id', getMyReqs);

module.exports = router;
