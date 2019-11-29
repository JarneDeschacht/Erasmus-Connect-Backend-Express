const express = require('express');
const chatController = require('../controllers/chat')


const router = express.Router();


router.post('/sendMessage', chatController.sendMessage)


module.exports = router;