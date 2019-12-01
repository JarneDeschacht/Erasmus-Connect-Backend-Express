const db = require('../util/database');
const sqlDateConvert = require('../util/sqlDateConvert')

module.exports = class Message{
    constructor(messageId, sender, receiver, sendDate, content){
        this.messageId = messageId;
        this.sender = sender;
        this.receiver = receiver;
        this.sendDate = sendDate;
        this.content = content;
    }

    save(){
        return db.execute(`
            INSERT INTO message (sender, receiver, sendDate, content)
            VALUES (?,?,?,?);
        `, [this.sender, this.receiver, this.sendDate, this.content])
    }

    static getMessagesFromUser(userId){
        return db.execute(`
            SELECT * from message
            WHERE sender = ? OR receiver = ?
            ORDER BY sendDate
        `,[userId, userId])
    }
}