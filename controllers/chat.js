const Message = require('../models/message')
const io = require('../socket')
const sqlDateConvert = require('../util/sqlDateConvert')

exports.sendMessage = async (req, res, next) => {
    try {
        const senderId = req.body.sender;
        const receiverId = req.body.receiver;
        const content = req.body.content;


        let message = new Message(null, senderId, receiverId, sqlDateConvert(new Date()), content);

        message.save()

        res.status(200).json({
            message: 'message was sent',
        });

        //send a message to all connected users
        //.broadcast does the same but does not send a message to the sender of the message
        io.getIo().emit('messages',{
            action: 'messageSent',
            message: message
        })


    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}