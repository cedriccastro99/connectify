import express from 'express';
import UserController from '../controllers/user.js';
import authorization from '../middlewares/authorization.js';

const router = express.Router();

router.get('/session', authorization, UserController.session)

router.post('/', authorization, UserController.create);
router.post('/list', authorization, UserController.list);
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/reset-password',  UserController.resetPassword);

router.put('/:id', authorization, UserController.update);
router.put('/:id/password', authorization, UserController.updatePassword);

export default router;