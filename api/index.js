const express = require("express")
const authRoutes = require("./routes/authRoutes.js");
const InitiateMongoServer = require("./config/db");
require('dotenv').config();

const app = express()

InitiateMongoServer();

/*app.use((req,res,next)=>{
    console.log("I'm in the middleware");
    next();
})*/


app.get('/',(req,res)=>{
    console.log("Getting route");
    res.send("WORKING  ss");
})


app.use('/api/auth',authRoutes)


app.listen(process.env.PORT,()=>{
    console.log("FBI is listenning!");
})
