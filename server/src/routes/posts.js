const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get all posts (with pagination, search, filter)
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, category, status } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (status) {
            query.status = status;
        } else {
            query.status = 'published'; // Default to published posts
        }

        const posts = await Post.find(query)
            .populate('author', 'username')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments(query);

        res.json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalPosts: count
        });
    } catch (error) {
        next(error);
    }
});

// Get single post
router.get('/:id', async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email')
            .populate('category', 'name description')
            .populate('comments.user', 'username');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        next(error);
    }
});

// Create post (protected) with image upload
router.post('/', auth, upload.single('featuredImage'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('status').optional().isIn(['draft', 'published'])
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content, category, status } = req.body;

        const post = new Post({
            title,
            content,
            author: req.user._id,
            category,
            status: status || 'draft',
            featuredImage: req.file ? `/uploads/${req.file.filename}` : ''
        });

        await post.save();
        await post.populate('author', 'username');
        await post.populate('category', 'name');

        res.status(201).json(post);
    } catch (error) {
        next(error);
    }
});

// Update post (protected)
router.put('/:id', auth, upload.single('featuredImage'), async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        const { title, content, category, status } = req.body;

        if (title) post.title = title;
        if (content) post.content = content;
        if (category) post.category = category;
        if (status) post.status = status;
        if (req.file) post.featuredImage = `/uploads/${req.file.filename}`;

        await post.save();
        await post.populate('author', 'username');
        await post.populate('category', 'name');

        res.json(post);
    } catch (error) {
        next(error);
    }
});

// Delete post (protected)
router.delete('/:id', auth, async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// Add comment to post (protected)
router.post('/:id/comments', auth, [
    body('content').trim().notEmpty().withMessage('Comment content is required')
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({
            user: req.user._id,
            content: req.body.content
        });

        await post.save();
        await post.populate('comments.user', 'username');

        res.status(201).json(post.comments[post.comments.length - 1]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;