import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import ErrorHandler from '../../utils/errorHandler.js';

const authorization = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.user_id });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        log.error(`Error: ${error.message}`);
        return ErrorHandler({ message: 'Unauthorized', status: 401 }, req, res, next);
    }
};

export default authorization;