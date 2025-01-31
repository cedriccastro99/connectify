import _ from 'lodash';
import jwt from 'jsonwebtoken'
import Promise from 'bluebird';

import ErrorHandler from '../../utils/errorHandler.js';
import fieldValidator from '../../utils/fieldValidator.js';

import PasswordController from './password.js';
import User from '../models/user.js'

class UserController {
    async create(req, res, next) {
        try {
            const required_fields = ['email', 'password'];
            const validate = fieldValidator(required_fields, req.body);

            if (!validate.success) {
                return ErrorHandler({ message: validate.message, status: 400 }, req, res, next);
            }

            const { email, password } = req.body;

            const existing_user = await User.findOne({ email });

            if (existing_user) {
                return ErrorHandler({ message: 'User already exists', status: 400 }, req, res, next);
            }

            const user = new User(_.omit(req.body, 'password'))

            const new_user = await user.save();

            const { _id } = new_user;

            //create password
            const _password = await PasswordController.create({ body: { password, user_id: _id } });

            if (!_password.success) {

                //delete user if password creation fails
                await User.deleteOne({ _id });
                log.info(`User with id: ${_id} deleted due to password creation failure`);

                return ErrorHandler({ message: _password.message, status: 400 }, req, res, next);
            }

            res.status(200).send({
                data: new_user,
                success: true,
                message: 'User created successfully'
            })
        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }

    async register(req, res, next) {
        try {
            const required_fields = ['email', 'password'];
            const validate = fieldValidator(required_fields, req.body);

            if (!validate.success) {
                return ErrorHandler({ message: validate.message, status: 400 }, req, res, next);
            }

            const { email, password, status = 'inactive', role = 'user' } = req.body;

            const existing_user = await User.findOne({ email });

            if (existing_user) {
                return ErrorHandler({ message: 'User already exists', status: 400 }, req, res, next);
            }

            const user = new User({ email, password, status, role })

            const new_user = await user.save();

            const { _id } = new_user;

            //create password
            const _password = await PasswordController.create({ body: { password, user_id: _id } });

            if (!_password.success) {

                //delete user if password creation fails
                await User.deleteOne({ _id });
                log.info(`User with id: ${_id} deleted due to password creation failure`);

                return ErrorHandler({ message: _password.message, status: 400 }, req, res, next);
            }

            res.status(200).send({
                data: new_user,
                success: true,
                message: 'User created successfully'
            })
        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }

    async list(req, res, next) {

        const {
            start = 0,
            limit = 10,
            sort = 'desc',
            sort_by = 'createdAt',
            search = '',
            filter = {}
        } = req.body;
        
        try {
            //sanitize filter
            const _filter = Object.keys(filter).reduce((acc, key) => {
                if (filter[key] !== '') {
                    acc[key] = filter[key];
                }
                return acc;
            }, {})

            // Build the query dynamically
            const query = { ..._filter };

            if (search) {
                query.$or = [
                    { email: { $regex: `.*${search}.*`, $options: 'i' } }, // Add other fields as needed
                    { role: { $regex: `.*${search}.*`, $options: 'i' } },
                    { status: { $regex: `.*${search}.*`, $options: 'i' } }
                ];
            }

            const [users, user_count] = await Promise.all([
                await User.find(query)
                    .skip(start)
                    .limit(limit)
                    .sort({ [sort_by]: sort === 'asc' ? 1 : -1 })
                    .exec(),
                await User.countDocuments()
            ])

            res.status(200).send({
                data: {
                    data: users,
                    count: user_count
                },
                success: true,
                message: 'Users retrieved successfully'
            });
        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }

    async login(req, res, next) {
        try {
            const required_fields = ['email', 'password'];
            const validate = fieldValidator(required_fields, req.body);

            if (!validate.success) {
                return ErrorHandler({ message: validate.message, status: 400 }, req, res, next);
            }

            const { email, password } = req.body;

            const existing_user = await User.findOne({ email });

            if (!existing_user) {
                return ErrorHandler({ message: 'Incorrect email or password', status: 404 }, req, res, next);
            }

            if (existing_user.status === 'inactive') {
                return ErrorHandler({ message: 'Account inactive, please contact system administrator', status: 401 }, req, res, next);
            }

            const user_id = existing_user._id;

            const _password = await PasswordController.validate({ body: { password, user_id } });

            if (!_password.success) {
                return ErrorHandler({ message: _password.message, status: _password.status }, req, res, next);
            }

            //generate token to be used for authentication
            const token = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.status(200).send({
                data: {
                    token,
                    user: existing_user
                },
                success: true,
                message: 'User logged in successfully'
            });

        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
            
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);

            if(!user) {
                return ErrorHandler({ message: 'User not found', status: 404 }, req, res, next);
            }

            //check if email already exists
            const email_already_exist = await User.find({
                _id: {
                    $ne: id
                },
                email: req.body.email
            })

            if (email_already_exist.length > 0) {
                return ErrorHandler({ message: 'Email already exists', status: 400 }, req, res, next);
            }

            const new_user = await User.findByIdAndUpdate(id, req.body, { new: true });

            res.status(200).send({
                data: new_user,
                success: true,
                message: 'User updated successfully'
            });

        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }

    async updatePassword(req, res, next) {
        try {
            const { id } = req.params;

            const user = await User.findById(id);

            if(!user) {
                return ErrorHandler({ message: 'User not found', status: 404 }, req, res, next);
            }

            const { password } = req.body;

            const user_id = user._id;

            const _password = await PasswordController.update({ body: { password, user_id } });

            if (!_password.success) {
                return ErrorHandler({ message: _password.message, status: 400 }, req, res, next);
            }

            res.status(200).send({
                data: _password.data,
                success: true,
                message: 'Password updated successfully'
            });

        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }

    async resetPassword(req, res, next) {
        try {
            const [user = null] = await User.find({  email: req.body.email });
            
            if(user.length) {
                return ErrorHandler({ message: 'User does not exist', status: 404 }, req, res, next);
            }

            const { password } = req.body;

            const user_id = user._id;

            const _password = await PasswordController.update({ body: { password, user_id } });

            if (!_password.success) {
                return ErrorHandler({ message: _password.message, status: 400 }, req, res, next);
            }

            res.status(200).send({
                data: _password.data,
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }

    async session(req, res, next) {
        try {
            
            const { user, token } = req;

            res.status(200).send({
                data: {
                    token,
                    user: user
                },
                success: true,
                message: 'User session retrieved successfully'
            });
        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }
}

export default new UserController();