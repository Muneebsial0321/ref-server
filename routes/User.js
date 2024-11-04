const express = require('express');
const router = express.Router()

const {handleNewUser, handleLogin, handleUpdateUser, handleAllUser, handleUserById, handleGetApprovedUsers, handleBlockUser, handleUnBlockUser,getAllReferals,getMyReferals} = require('../controller/User')
const {authenticateToken} = require('../jwtToken')

router.post('/signup', handleNewUser) 
router.post('/login', handleLogin)
router.put('/updateUser/:id', handleUpdateUser)
router.get('/users', handleAllUser)
router.get('/getUser/:id',authenticateToken, handleUserById)
router.get('/refs',getAllReferals)
router.get('/refs/:id',getMyReferals)
router.get('/getAllUser/approved', handleGetApprovedUsers)
router.put('/block/:userId', handleBlockUser)
router.put('/unblock/:userId', handleUnBlockUser)


module.exports = router;