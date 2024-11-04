const express = require('express');
const router = express.Router()
const {addQuestion, getQuestion,getTodaysQuestions} = require('../controller/Questioning')

router.post('/addQuestion',addQuestion)
// router.get('/getQuestion',getQuestion)
router.get('/getQuestion',getTodaysQuestions)

module.exports = router