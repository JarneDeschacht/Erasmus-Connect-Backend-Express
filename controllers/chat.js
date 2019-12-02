const Message = require('../models/message')
const io = require('../socket')
const sqlDateConvert = require('../util/sqlDateConvert')

exports.sendMessage = async (req, res, next) => {
    try {
        const senderId = req.body.sender;
        const receiverId = req.body.receiver;
        const content = req.body.content;

        let message = await new Message(null, senderId, receiverId, sqlDateConvert(new Date()), content);

        message.save()

        //send a message to all connected users
        //.broadcast does the same but does not send a message to the sender of the message
        io.getIo().emit('messages', {
            action: 'messageSent',
            message: message
        })

        res.status(200).json({
            message: 'message was sent',
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getMessagesFromUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const conversation = [];

        const [rows] = await Message.getMessagesFromUser(userId)

        rows.forEach(mes => {
            conversation.push(mes)
        })

        res.status(200).json({
            message: 'messages were returned',
            messages: conversation
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}


exports.getConversation = async (req, res, next) => {
    const chatWithUserId = req.params.chatWithUserId;
    const loggedInUserId = req.params.loggedInUserId;

    const [rows] = await Message.getConversation(loggedInUserId, chatWithUserId);
    let conversation = []

    rows.forEach(mes => {
        conversation.push(mes)
    })

    res.status(200).json({
        message: 'messages from conversation were returned',
        messages: conversation
    });
}