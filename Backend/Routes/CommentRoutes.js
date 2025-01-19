const express = require('express');
const CommentController = require('../Controllers/CommentController');

const router = express.Router();
const filePath = './data/comment.json';
const controller = new CommentController(filePath);

router.get('/', (req, res) => controller.get(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));

module.exports = router;