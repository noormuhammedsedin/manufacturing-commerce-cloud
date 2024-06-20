const express=require("express");
const bodyParser = require('body-parser');
const cors=require("cors");
const connect=require("./db/connect");
const shopData=require("./api/shopDetail.api");
const quote=require("./api/quote.api")
const app=express();
const port=process.env.PORT||3000;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const dotenv = require('dotenv')
require('dotenv').config();

app.use('/shopData',shopData);
app.use('/submit-quote',quote);

app.listen(port,()=>{
  connect();
  console.log(`Listening on port ${port}`)
})

