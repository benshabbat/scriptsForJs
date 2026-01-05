import express from 'express';
import * as bookController from '../controllers/bookController.js';

const router = express.Router();

// GET all books
router.get('/', bookController.getAllBooks);

// GET book by id
router.get('/:id', bookController.getBookById);

// POST create new book
router.post('/', bookController.createBook);

// PUT update book
router.put('/:id', bookController.updateBook);

// DELETE book
router.delete('/:id', bookController.deleteBook);

export default router;
