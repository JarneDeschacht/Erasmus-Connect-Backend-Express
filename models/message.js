const db = require('../util/database');
const sqlDateConvert = require('../util/sqlDateConvert')

module.exports = class Message {
    constructor(messageId, sender, receiver, sendDate, content) {
        this.messageId = messageId;
        this.sender = sender;
        this.receiver = receiver;
        this.sendDate = sendDate;
        this.content = content;
    }

    save() {
        return db.execute(`
            INSERT INTO message (sender, receiver, sendDate, content)
            VALUES (?,?,?,?);
        `, [this.sender, this.receiver, this.sendDate, this.content])
    }

    static getMessagesFromUser(userId) {
        return db.execute(`
            SELECT * from message
            WHERE sender = ? OR receiver = ?
            ORDER BY sendDate
        `, [userId, userId])
    }

    static getConversation(userId, chatWithId) {
        return db.execute(`
            SELECT * FROM message
            WHERE (sender = ? OR receiver = ?)
            AND
            (sender = ? OR receiver = ?);
        `, [userId, userId, chatWithId, chatWithId])
    }

    static getLastMessageOfConversation(connectionId) {
        return db.execute(`
            SELECT mes.content, mes.sendDate
            FROM message mes
            JOIN student sender
                ON sender.studentId = mes.sender
            JOIN student receiver
                ON receiver.studentId = mes.receiver
            JOIN userConnection con1
                ON con1.senderId = sender.studentId 
                AND con1.receiverId = receiver.studentId
            JOIN userConnection con2
                ON con2.senderId = sender.studentId 
                AND con2.receiverId = receiver.studentId
            WHERE con1.connectionId = ?
            ORDER BY mes.sendDate desc
            LIMIT 1
      `,[connectionId])
    }


}