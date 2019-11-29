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

    static getConnectionByUser1Id(userId) {
        return db.execute(`
            SELECT *
            FROM userConnection
            WHERE user1Id = ?
        `, [userId])
    }

    static getAllConnectionsFromUser(userId) {
        return db.execute(`
            SELECT user1Id,user2Id, stud.lastName, stud.firstName
            FROM userConnection as con
            JOIN student as stud
            ON stud.studentId = con.user1Id
            WHERE (user1Id = ? OR user2Id = ?)
            AND accepted = 'true';
        `, [userId, userId])
    }

    static getSentPendingRequestsFromUser(userId) {
        return db.execute(`
            SELECT user2Id, stud.lastName, stud.firstName
            FROM userConnection as con
            JOIN student as stud
            ON stud.studentId = con.user1Id
            WHERE user1Id = ?
            AND accepted = 'false'
        `, [userId])
    }

    static getReceivedPendingRequestsFromUser(userId) {
        return db.execute(`
            SELECT user1Id, stud.lastName, stud.firstName
            FROM userConnection as con
            JOIN student as stud
            ON stud.studentId = con.user1Id
            WHERE user2Id = ?
            AND accepted = 'false'
        `, [userId])
    }

    static getConnctionFromUsers(senderId, receiverId) {
        return db.execute(`
            select * 
            from userConnection
            where user1Id = ? AND user2Id = ?
        `, [senderId, receiverId])
    }

    static acceptConnection(id) {
        return db.execute(`
            UPDATE userConnection
            SET accepted = 'true'
            WHERE connectionId = ?
        `, [id])
    }

    static deleteConnection(connectionId) {
        return db.execute(`
            DELETE FROM userConnection
            WHERE connectionId = ?
        `, [connectionId])
    }
}   