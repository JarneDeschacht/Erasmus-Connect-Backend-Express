const User = require('../models/user');
const City = require('../models/city');
const UserConnection = require('../models/userConnection');
const { transformUsers } = require('../util/transformations');

exports.registerErasmus = async (req, res, next) => {

}

exports.getStudents = async (req, res, next) => {
    const userId = req.userId;
    try {
        const [users] = await User.getAll(userId);
        if (!users) {
            const error = new Error('No users found');
            error.statusCode = 401;
            throw (error);
        }
        res.status(200).json({
            message: 'Users fetched succesfully',
            users: await transformUsers([...users])
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getStudent = async (req, res, next) => {
    const studentId = req.params.studentId;
    try {
        res.status(200).json({
            message: 'User fetched succesfully',
            user: (await transformUsers([await fetchStudent(studentId)]))[0]
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getLoggedInUser = async (req, res, next) => {
    const userId = req.userId;
    try {
        res.status(200).json({
            message: 'Profile fetched succesfully',
            user: (await transformUsers([await fetchStudent(userId)]))[0]
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getCountries = async (req, res, next) => {
    try {
        const [rows] = await City.getAllCountries();
        res.status(200).json({
            message: 'Countries fetched succesfully',
            countries: rows.map(country => {
                return {
                    id: country.countryId,
                    code: country.countryCode,
                    name: country.countryName
                }
            })
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


        //checking if the connection already exists!!!!!!!
        [rows] = await UserConnection.getConnectionByUser1Id(userId)
        let con = rows[0]
        if (con) {
            if (con.user2Id == connectToId) {
                const error = new Error('this connection already exists');
                error.statusCode = 401;
                throw (error);
            }
        }

        [rows] = await UserConnection.getConnectionByUser1Id(connectToId)
        con = rows[0]
        if (con) {
            if (con.user2Id == userId) {
                const error = new Error('this connection already exists');
                error.statusCode = 401;
                throw (error);
            }
        }

















        await User.connectToStudent(userId, connectToId)

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
        const connectionId = req.body.connectionId;
        const user2Id = req.body.userId;

        const [rows] = await UserConnection.getConnectionById(connectionId);
        const connection = rows[0]

        if (connection.user2Id !== user2Id) {
            const error = new Error('the user that accepts the request was not found');
            error.statusCode = 401;
            throw (error);
        }

        if (connection.accepted === 'true') {
            const error = new Error('this connection already exists');
            error.statusCode = 401;
            throw (error);
        }



        await UserConnection.acceptConnection(connectionId);

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

const fetchStudent = async (id) => {
    const [rows] = await User.findById(id);
    const user = rows[0];
    if (!user) {
        const error = new Error('There is no user with this id!');
        error.statusCode = 401;
        throw (error);
    }
    return user;
}

