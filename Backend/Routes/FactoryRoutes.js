const express = require('express');
const FactoryController = require('../Controllers/FactoryController');

const router = express.Router();
const filepath = './data/factory.json';
const controller = new FactoryController(filepath);

router.get('/', (req, res) => controller.get(req, res));

router.post('/', (req, res) => controller.add(req, res));
router.put('/:id', (req, res) => controller.updateFactory(req, res));
router.get('/:id', (req, res) => controller.getFactoryById(req, res));
router.delete('/:id', (req, res) => controller.deleteFactory(req, res))

module.exports = router;