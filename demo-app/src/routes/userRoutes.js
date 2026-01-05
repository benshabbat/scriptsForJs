import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// GET all users
router.get('/', userController.getAllUsers);

// GET user by id
router.get('/:id', userController.getUserById);

// POST create new user
router.post('/', userController.createUser);

// PUT update user
router.put('/:id', userController.updateUser);

// DELETE user
router.delete('/:id', userController.deleteUser);

export default router;
