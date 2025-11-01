const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

// Create category (protected)
router.post('/', auth, [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('description').optional().trim()
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, description } = req.body;

        const category = new Category({ name, description });
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
