const db = require('../util/database');

module.exports = class UserConnection {
    constructor(connectionId, accepted, senderId, receiverId) {
        this.connectionId = connectionId;
        this.accepted = accepted;
        this.senderId = senderId;
        this.receiverId = receiverId;
    }

    static getConnectionById(id) {
        return db.execute(`
            SELECT * FROM userConnection
            WHERE connectionId = ?
        `, [id])
    }

    static getConnectionBySenderId(userId) {
        return db.execute(`
            SELECT *
            FROM userConnection
            WHERE senderId = ?
        `, [userId])
    }

    static getAllConnectionsFromUser(userId) {
        return db.execute(`
            SELECT con.senderId, con.receiverId, studSender.lastName as 'senderLastName', studSender.firstName as 'senderFirstName', studReceiver.lastName as 'receiverLastName', studReceiver.firstName as 'receiverFirstName'
            FROM userConnection as con
            JOIN student as studSender
            ON studSender.studentId = con.senderId
            JOIN student as studReceiver
            on studReceiver.studentId = con.receiverId
            WHERE (senderId = ? OR receiverId = ?)
            AND accepted = 'true';
        `, [userId, userId])
    }

    static getSentPendingRequestsFromUser(userId) {
        return db.execute(`
            SELECT con.senderId, con.receiverId, studSender.lastName as 'senderLastName', studSender.firstName as 'senderFirstName', studReceiver.lastName as 'receiverLastName', studReceiver.firstName as 'receiverFirstName'FROM userConnection as con
            JOIN student as studSender
            ON studSender.studentId = con.senderId
            JOIN student as studReceiver
            on studReceiver.studentId = con.receiverId
            WHERE senderId = ?
            AND accepted = 'false';
        `, [userId])
    }

    static getReceivedPendingRequestsFromUser(userId) {
        return db.execute(`
            SELECT con.senderId, con.receiverId, studSender.lastName as 'senderLastName', studSender.firstName as 'senderFirstName', studReceiver.lastName as 'receiverLastName', studReceiver.firstName as 'receiverFirstName'FROM userConnection as con
            JOIN student as studSender
            ON studSender.studentId = con.senderId
            JOIN student as studReceiver
            on studReceiver.studentId = con.receiverId
            WHERE receiverId = ?
            AND accepted = 'false';
        `, [userId])
    }

    static getConnctionFromUsers(senderId, receiverId) {
        return db.execute(`
            select * 
            from userConnection
            where senderId = ? AND receiverId = ?
        `, [senderId, receiverId])
    }

    static connectToStudent(senderId, receiverId) {
        return db.execute(`
            INSERT INTO userConnection (accepted, senderId, receiverId)
            VALUES ('false', ?, ?);
        `, [senderId, receiverId])
    }

    static acceptConnection(connectionId) {
        return db.execute(`
            UPDATE userConnection
            SET accepted = 'true'
            WHERE connectionId = ?
        `, [connectionId])
    }

    static deleteConnection(connectionId) {
        return db.execute(`
            DELETE FROM userConnection
            WHERE connectionId = ?
        `, [connectionId])
    }
}   