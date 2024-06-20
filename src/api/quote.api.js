const express=require("express");
const router=express.Router();
const dotenv = require('dotenv')
require('dotenv').config();
const _SHOP = process.env._SHOP;
const _ACCESS_TOKEN =process.env._ACCESS_TOKEN;
const axios = require('axios');
const Quote=require("../models/quote.model");

// Route to Submit Quote
router.post('/submit-quote', async (req, res) => {
  try {
    const { products, customerInfo } = req.body;
    const quote = new Quote({ products, customerInfo, status: 'submitted' });
    await quote.save();

    // Sending data to Salesforce CPQ
    const salesforceResponse = await axios.post('https://salesforce-api-url.com/quotes', {
      products,
      customerInfo
    });

    quote.salesforceId = salesforceResponse.data.id;
    await quote.save();

    res.status(200).send('Quote submitted successfully');
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).send('Error submitting quote');
  }
});

module.exports=router;