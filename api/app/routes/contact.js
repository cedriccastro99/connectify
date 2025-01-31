import express from 'express';
import ContactController from '../controllers/contact.js';
import authorization from '../middlewares/authorization.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/', authorization, ContactController.create);
router.post('/copy', authorization, ContactController.copy);
router.post('/list', authorization, ContactController.list);
router.post('/upload/profile/:id', [authorization, upload.single('image')], ContactController.upload)

router.put('/:id', authorization, ContactController.update);

router.delete('/:id', authorization, ContactController.delete)

export default router;