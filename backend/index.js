import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PostModel from './model/post.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());

(async () => {
    try {
        await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected ...');
    } catch (err) {
        console.error(err);
    }
})();

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.post('/api/create', async (req, res) => {
    const { postID, name, description } = req.body;

    if (!postID || !name || !description) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newPostData = {
        postID,
        name,
        description,
        comments: []
    };

    try {
        const createdPost = await PostModel.create(newPostData);
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await PostModel.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/posts/comments', async (req, res) => {
    const { postID, name, comment } = req.body;
    if (!postID || !name || !comment) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const post = await PostModel.findOne({ postID });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        post.comments.push({ name, comment });
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/api/post/', async (req, res) => {
    const { postID } = req.body;
    if (!postID) {
        return res.status(400).json({ message: 'Post ID is required' });
    }

    try {
        const post = await PostModel.findOne({ postID });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/post', async (req, res) => {
    const { postID } = req.body;
    try {
        const post = await PostModel.findOneAndDelete({ postID });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});

