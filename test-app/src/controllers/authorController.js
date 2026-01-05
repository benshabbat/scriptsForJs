import Author from '../models/Author.js';

// GET all authors
export const getAllAuthors = (req, res) => {
    try {
        const items = Author.getAll();
        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// GET author by id
export const getAuthorById = (req, res) => {
    try {
        const item = Author.getById(req.params.id);
        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Author not found'
            });
        }
        res.json({
            success: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// POST create author
export const createAuthor = (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Name is required'
            });
        }

        const newItem = Author.create({ name, description });
        res.status(201).json({
            success: true,
            data: newItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// PUT update author
export const updateAuthor = (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedItem = Author.update(req.params.id, { name, description });
        
        if (!updatedItem) {
            return res.status(404).json({
                success: false,
                error: 'Author not found'
            });
        }

        res.json({
            success: true,
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// DELETE author
export const deleteAuthor = (req, res) => {
    try {
        const deleted = Author.delete(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Author not found'
            });
        }

        res.json({
            success: true,
            message: 'Author deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
