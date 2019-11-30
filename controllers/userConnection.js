const User = require('../models/user');
const UserConnection = require('../models/userConnection');

exports.getConnections = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const response = {
            connections: [],
            sended: [],
            received: []
        }

        // get all the accepted requests
        let [connectionRows] = await UserConnection.getAllConnectionsFromUser(userId);
        connectionRows.forEach(rec => {
            if (rec.senderId.toString() === userId.toString()) {
                response.connections.push({
                    userId: rec.receiverId,
                    firstName: rec.receiverFirstName,
                    lastName: rec.receiverLastName
                })
            }
            else {
                response.connections.push({
                    userId: rec.senderId,
                    firstName: rec.senderFirstName,
                    lastName: rec.senderLastName
                })
            }
        })

        //get all the sended, still pending requests
        let [sendedRows] = await UserConnection.getSentPendingRequestsFromUser(userId); 
        sendedRows.forEach(rec => {
            response.sended.push({
                userId: rec.receiverId,
                firstName: rec.receiverFirstName,
                lastName: rec.receiverLastName
            })
        })

        // //get all the received, still pending requests
        let [receivedRows] = await UserConnection.getReceivedPendingRequestsFromUser(userId);
        receivedRows.forEach(rec => {
            response.received.push({
                userId: rec.senderId,
                firstName: rec.senderFirstName,
                lastName: rec.senderLastName
            })
        })

        //send the response
        res.status(200).json({
            ...response
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.connectToStudent = async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const connectToId = req.body.connectToId;

        let [rows] = await User.findById(userId);
        const user = rows[0]
        if (!user) {
            const error = new Error('the user who is sending the request does not exist');
            error.statusCode = 401;
            throw (error);
        }

        [rows] = await User.findById(connectToId)
        const connectToUser = rows[0]
        if (!connectToUser) {
            const error = new Error('the user who is receiving the request does not exist');
            error.statusCode = 401;
            throw (error);
        }

        [rows] = await UserConnection.getConnectionBySenderId(userId)
        let con = rows[0]
        if (con) {
            if (con.receiverId == connectToId) {
                const error = new Error('this connection already exists');
                error.statusCode = 401;
                throw (error);
            }
        }

        [rows] = await UserConnection.getConnectionBySenderId(connectToId)
        con = rows[0]
        if (con) {
            if (con.receiverId == userId) {
                const error = new Error('this connection already exists');
                error.statusCode = 401;
                throw (error);
            }
        }

        await UserConnection.connectToStudent(userId, connectToId)

        res.status(200).json({
            message: 'connection made'
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.acceptConnection = async (req, res, next) => {
    try {
        const senderId = req.body.sender;
        const receiverId = req.body.receiver

        const [rows] = await UserConnection.getConnctionFromUsers(senderId, receiverId)
        const connection = rows[0]

        if (connection.accepted === 'true') {
            const error = new Error('this connection already exists');
            error.statusCode = 401;
            throw (error);
        }

        await UserConnection.acceptConnection(connection.connectionId);
        res.status(200).json({
            message: 'connection was accepted'
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.refuseConnection = async (req, res, next) => {
    try {
        const senderId = req.body.sender;
        const receiverId = req.body.receiver

        const [rows] = await UserConnection.getConnctionFromUsers(senderId, receiverId)
        const connection = rows[0]
        if (!connection) {
            const error = new Error('there was no request between these users');
            error.statusCode = 401;
            throw (error);
        }

        if (connection.accepted === 'true') {
            const error = new Error('the request was already accepted');
            error.statusCode = 401;
            throw (error);
        }

        await UserConnection.deleteConnection(connection.connectionId)

        res.status(200).json({
            message: 'the connection was refused'
        });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.connectionStatus = async (req, res, next) => {
    const userId = req.params.sender;
    const connectToId = req.params.receiver

    const response = {
        connectionExists: false,
        connectionRequestSent: false,
        connectionRequestReceived: false
    }

    const [rows] = await UserConnection.getConnctionFromUsers(userId, connectToId)
    const connection = rows[0]

    try {
        if (connection) {
            if (connection.accepted === 'true') {
                response.connectionExists = true;
            }
            else {
                response.connectionRequestSent = true
            }
        }
        else {
            const [rows] = await UserConnection.getConnctionFromUsers(connectToId, userId)
            const connection = rows[0]
            if (connection) {
                response.connectionRequestReceived = true
            }
        }
        res.status(200).json({
            ...response
        });
    } catch (err) {
        res.status(200).json({
            ...response
        });
    }
}