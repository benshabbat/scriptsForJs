import express from 'express';
import * as authorController from '../controllers/authorController.js';

const router = express.Router();

// GET all authors
router.get('/', authorController.getAllAuthors);

// GET author by id
router.get('/:id', authorController.getAuthorById);

// POST create new author
router.post('/', authorController.createAuthor);

// PUT update author
router.put('/:id', authorController.updateAuthor);

// DELETE author
router.delete('/:id', authorController.deleteAuthor);

export default router;
