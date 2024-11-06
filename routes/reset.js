const express = require('express');
const router = express.Router()
const {forgotPassword,resetPassword} = require('../Functions/ForgetEmail')

router.get('/:id',forgotPassword)
// router.post('/',(req,res)=>{
//     console.log("sedning response")
//     res.json({res:"res",...req.body})
// })
router.post('/',resetPassword)


module.exports = router