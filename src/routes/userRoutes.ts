import express from 'express';
import { UserController } from '../controllers/userController';

const router = express.Router();
const userController = new UserController();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUserById);
router.get('/', userController.getAllUsers);
router.get('/get/count', userController.getUserCount);
router.delete('/:id',userController.deleteUser)
router.patch('/:id', userController.updateUser);

export default router;