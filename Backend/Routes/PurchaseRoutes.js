const express = require('express');
const PurchaseController = require('../Controllers/PurchaseController');

const router = express.Router();
const filepath = './data/purchase.json';
const controller = new PurchaseController(filepath);
router.get('/', (req, res) => controller.get(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.get('/:id', (req, res) => controller.getById(req, res))
router.put('/:id', (req, res) => controller.update(req, res))
router.delete('/:id', (req, res) => controller.delete(req, res))

module.exports = router;