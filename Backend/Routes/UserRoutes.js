const express = require('express');
const UserController = require('../Controllers/UserController');

const router = express.Router();
const filepath = './Data/user.json';
const contoller = new UserController(filepath);

router.get('/', (req, res) => contoller.get(req, res));

router.post('/login', (req, res) => contoller.login(req, res));
router.post('/register', (req, res) =>contoller.create(req, res));
router.get('/:id', (req, res) => contoller.getUserById(req, res));
router.put('/:id', (req, res) => contoller.update(req, res));
router.get('/menagers', (req, res) => contoller.getFreeMenagers(req, res));

module.exports = router;