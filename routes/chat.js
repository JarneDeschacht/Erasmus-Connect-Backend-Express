const express = require('express');
const chatController = require('../controllers/chat')


const router = express.Router();

router.post('/sendMessage', chatController.sendMessage)
router.get('/getMessagesFromUser/:userId', chatController.getMessagesFromUser)
router.get('/getConversation/:loggedInUserId/:chatWithUserId', chatController.getConversation)
router.get('/getLastMessageOfConversationSaga/:connection_ids', chatController.getLastMessageOfConversationSaga)

module.exports = router;