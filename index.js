require("dotenv").config()
const express = require('express');
// const {randomUUID} = require('crypto');
const app = express();
const db=require('./database/db')
const cors = require('cors')
db()

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: true })); 

 
// ***************** USER ***************** //
app.use('/api', require('./routes/User'))
app.get('/', (req,res)=>res.send("up and running"))

// Task
app.use('/api', require('./routes/Questions'));

// Point 
app.use('/api', require('./routes/Point'))
app.use('/api/widthdraw', require('./routes/Withdraw'))


app.use('/uploads', express.static('uploads'));
app.use('/api', require('./routes/User_Approve'))

// console.log(crypto.randomUUID());
app.listen(process.env.PORT, () => {
    console.log(`Server Started on PORT : ${process.env.PORT}`)
})