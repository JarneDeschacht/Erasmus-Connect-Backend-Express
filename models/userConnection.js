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

    static acceptConnection(id) {
        return db.execute(`
            UPDATE userConnection
            SET accepted = 'true'
            WHERE connectionId = ?
        `, [id])
    }

    static getConnctionFromUsers(userId, connectToId) {
        console.log('in sql query' + userId, connectToId)
        return db.execute(`
            select * 
            from userConnection
            where user1Id = ? AND user2Id=?;
        `, [userId, connectToId])
    }
}