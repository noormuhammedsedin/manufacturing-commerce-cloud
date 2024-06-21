const express=require("express");
const router=express.Router();
const dotenv = require('dotenv')
require('dotenv').config();
const _SHOP = process.env._SHOP;
const _ACCESS_TOKEN =process.env._ACCESS_TOKEN;
const axios = require('axios');
const Quote=require("../models/quote.model");

// Route to Submit Quote
router.post('/', async (req, res) => {
  try {
    const { products, customerInfo } = req.body;
    const quote = new Quote({ products, customerInfo, status: 'submitted' });
    await quote.save();
    // Transform products to Salesforce line items
    const lineItems = products.map(product => ({
      SBQQ__ProductCode__c: product.sku,
      SBQQ__Quantity__c: product.quantity,
      SBQQ__UnitPrice__c: product.price / 100,
      SBQQ__Description__c: product.product_description,
      SBQQ__LineItemImageURL__c: product.image,
      SBQQ__ProductFamily__c: product.product_type,
      SBQQ__ProductName__c: product.product_title
    }));

    // Prepare Salesforce Quote data
    const salesforceQuoteData = {
      saver: "SBQQ.QuoteAPI.QuoteSaver",
      model: JSON.stringify({
        record: {
          attributes: {
            type: "SBQQ__Quote__c",
            url: "/services/data/v41.0/sobjects/SBQQ__Quote__c/a0l61000003kUlVAAU"
          },
          Name: "Q-00681",
          Id: "a0l61000003kUlVAAU"
        },
        nextKey: 2,
        netTotal: lineItems.reduce((total, item) => total + (item.SBQQ__UnitPrice__c * item.SBQQ__Quantity__c), 0),
        lineItems: lineItems,
        lineItemGroups: [],
        customerTotal: lineItems.reduce((total, item) => total + (item.SBQQ__UnitPrice__c * item.SBQQ__Quantity__c), 0)
      })
    };
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