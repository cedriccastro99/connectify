import bcrypt from 'bcryptjs';

import ErrorHandler from '../../utils/errorHandler.js';
import fieldValidator from '../../utils/fieldValidator.js';

import Password from '../models/password.js';

class PasswordController {
    async create(req) {
        try {
            const { password, user_id } = req.body;

            const required_fields = ['password', 'user_id'];
            const validate = fieldValidator(required_fields, req.body);

            if(!validate.success) {
                return ErrorHandler({ message: validate.message, status: 400 }, req, res, next);
            }

            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(password, salt);
            
            const new_password = new Password({
                user_id,
                password_hash: hashed_password
            });
            
            const created_password = await new_password.save();

            return {
                data: created_password,
                success: true,
                message: 'Password created successfully'
            }
        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }

    async validate(req) {
        try {
            const { password, user_id } = req.body;

            const required_fields = ['password', 'user_id'];
            const validate = fieldValidator(required_fields, req.body);

            if(!validate.success) {
                return ErrorHandler({ message: validate.message, status: 400 }, req, res, next);
            }

            const password_details = await Password.findOne({ user_id });

            if(!password_details) {
                return {
                    success: false,
                    message: 'Incorrect email or password',
                    status: 404
                }
            }

            const is_match = await bcrypt.compare(password, password_details.password_hash);

            if(!is_match) {
                return {
                    success: false,
                    message: 'Incorrect email or password',
                    status: 401
                }
            }

            return {
                success: true,
                message: 'Password validated successfully',
                status: 200
            }
        } catch (error) {
            log.error(`Error: ${error.message}`);
            res.status(error.status || 500).send({
                success: false,
                message: error.message || 'Internal Server Error',
                data: null
            })
        }
    }

    async update(req) {
        try {
            const { password, user_id } = req.body;

            const required_fields = ['password', 'user_id'];
            const validate = fieldValidator(required_fields, req.body);

            if(!validate.success) {
                return ErrorHandler({ message: validate.message, status: 400 }, req, res, next);
            }

            const salt = await bcrypt.genSalt(10);
            const hashed_password = await bcrypt.hash(password, salt);

            const updated_password = await Password.findOneAndUpdate({ user_id }, { password_hash: hashed_password }, { new: true });

            return {
                data: updated_password,
                success: true,
                message: 'Password updated successfully'
            }
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

export default new PasswordController();