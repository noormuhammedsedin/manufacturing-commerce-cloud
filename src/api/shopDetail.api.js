const express=require("express");
const router=express.Router();
const Shopify = require("shopify-api-node");
const dotenv = require('dotenv')
require('dotenv').config();
const _SHOP = process.env._SHOP;
const _ACCESS_TOKEN =process.env._ACCESS_TOKEN;
const axios = require('axios');
const shopify = new Shopify({
  shopName: _SHOP,
  accessToken: _ACCESS_TOKEN
});

const graphClient = axios.create({
  baseURL: `https://${_SHOP}/admin/api/2023-04/graphql.json`,
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': _ACCESS_TOKEN
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await graphClient.post('', {
      query: `{
        shop {
          id
          name
          email
          myshopifyDomain
          contactEmail
          plan {
            displayName
            partnerDevelopment
            shopifyPlus
          }
        }
      }`
    });
    res.json(response.data.data);
  } catch (error) {
    console.error("Error retrieving shop app details:", error);
    res.status(500).send('Error retrieving shop app details');
  }
});



module.exports=router;