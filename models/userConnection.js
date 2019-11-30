const db = require('../util/database');

module.exports = class UserConnection {
    constructor(connectionId, accepted, user1Id, user2id) {
        this.connectionId = connectionId;
        this.accepted = accepted;
        this.user1Id = user1Id;
        this.user2id = user2id;
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
            SELECT senderId, receiverId, stud.lastName, stud.firstName
            FROM userConnection as con
            JOIN student as stud
            ON stud.studentId = con.senderId
            WHERE (senderId = ? OR receiverId = ?)
            AND accepted = 'true';
        `, [userId, userId])
    }

    static getSentPendingRequestsFromUser(userId) {
        return db.execute(`
            SELECT receiverId, stud.lastName, stud.firstName
            FROM userConnection as con
            JOIN student as stud
            ON stud.studentId = con.senderId
            WHERE senderId = ?
            AND accepted = 'false'
        `, [userId])
    }

    static getReceivedPendingRequestsFromUser(userId) {
        return db.execute(`
            SELECT senderId, stud.lastName, stud.firstName
            FROM userConnection as con
            JOIN student as stud
            ON stud.studentId = con.senderId
            WHERE receiverId = ?
            AND accepted = 'false'
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