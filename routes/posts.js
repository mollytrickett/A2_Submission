const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const verifyToken = require('../verifyToken');

const { postValidation } = require('../validations/validation');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('createdBy', 'name');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('createdBy', 'name');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
const { error } = postValidation(req.body);

if (error){
    return res.status(400).json({ message: error.details[0].message });
}

const post = new Post({
    title: req.body.title,
    description: req.body.description,
    createdBy: req.user._id
});

try {
    const savedPost = await post.save();
    res.status(201).json(savedPost);
} catch (err) {
    res.status(400).json({ message: err.message });
}
});

router.put('/:id', verifyToken, async (req, res) => {
const { error } = postValidation(req.body);
if (error) return res.status(400).json({ message: error.details[0].message });

try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.createdBy.toString() !== req.user._id) {
    return res.status(401).json({ message: 'Not authorized to update this post' });
    }
    
    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    
    const updatedPost = await post.save();
    res.json(updatedPost);
} catch (err) {
    res.status(400).json({ message: err.message });
}
});

router.delete('/:id', verifyToken, async (req, res) => {
try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    if (post.createdBy.toString() !== req.user._id) {
    return res.status(401).json({ message: 'Not authorized to delete this post' });
    }
    
    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Post deleted successfully' });
} catch (err) {
    res.status(400).json({ message: err.message });
}
});

module.exports = router;