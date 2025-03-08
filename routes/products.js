const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products')
let BuildQueies = require('../Utils/BuildQuery')

// GET all products
router.get('/', async function(req, res, next) {
  let queries = req.query;
  let products = await productSchema.find(BuildQueies.QueryProduct(queries)).populate("categoryID");
  res.send(products);
});

// GET single product
router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: fail,
      message: error.message
    })
  }
});

// POST create product
router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newProduct = new productSchema({
    productName: body.productName,
    price: body.price,
    quantity: body.quantity,
    categoryID: body.category
  })
  await newProduct.save()
  res.send(newProduct);
});

// PUT update product
router.put('/:id', async function(req, res, next) {
  try {
    let body = req.body;
    let product = await productSchema.findByIdAndUpdate(req.params.id,
      body, { new: true });
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: fail,
      message: error.message
    })
  }
});

// DELETE (soft delete) product
router.delete('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).send({
      success: true,
      data: product,
      message: 'Product marked as deleted'
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;