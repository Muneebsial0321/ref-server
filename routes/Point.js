const express = require('express')
const router = express.Router()

const {handlePoint, handleGetPoint,getAllPoints,getMyPoints} = require('../controller/Point')
const { handleUpdatePoint} = require('../controller/User')
const { authenticateToken } = require('../jwtToken')

router.put('/point/:id', handleUpdatePoint)
router.get('/point',authenticateToken, handleGetPoint)
router.get('/points',getAllPoints)
router.get('/points/:id',getMyPoints)



module.exports = router;