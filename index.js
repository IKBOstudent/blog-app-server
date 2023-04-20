import express from 'express';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import 'dotenv/config';

import { loginValidation, registerValidation, blogValidation } from './utils/validations.js';

import { checkAuth, handleValidationErrors } from './utils/index.js';
import { getHome, UserControllers, BlogControllers } from './controllers/index.js';
import { resizeImage } from './utils/imageManipulations.js';

mongoose
    .connect(String(process.env.MONGO_URI))
    .then(() => console.log('DATABASE OK'))
    .catch((err) => console.log('DATABASE FAILED', err));

const app = express();

const upload = multer();

app.use(express.json());

app.use(
    cors({
        origin: '*',
    }),
);

// HOME
app.get('/', getHome);

// UPLOAD
app.post('/upload', checkAuth, upload.single('image'), async (request, response) => {
    try {
        const { buffer, mimetype, originalname } = request.file;

        const resizedImageBuffer = await resizeImage(buffer);

        const formData = new FormData();
        formData.append('image', resizedImageBuffer, { filename: originalname });

        const res_upload = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMAGE_API_KEY}`,
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
                },
            },
        );

        response.json(res_upload.data.data);
    } catch (e) {
        console.warn(e);
        response.status(500).json({
            message: 'Upload failed',
            error: e,
        });
    }
});

// AUTH
app.post('/auth/login', loginValidation, handleValidationErrors, UserControllers.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserControllers.register);
app.get('/auth/me', checkAuth, UserControllers.getMe);

// POSTS
app.get('/posts/post/:id', BlogControllers.getOne);
app.get('/posts/latest', BlogControllers.getAll);
app.get('/posts/popular', BlogControllers.getSortPostsPopular);
app.get('/posts/tag/:tag_name', BlogControllers.getPostsByTag);
app.get('/tags', BlogControllers.getTags);

app.post('/posts', checkAuth, blogValidation, handleValidationErrors, BlogControllers.create);
app.delete('/posts/:id', checkAuth, BlogControllers.remove);
app.patch('/posts/:id', checkAuth, blogValidation, handleValidationErrors, BlogControllers.update);
app.patch('/posts/:id/comment', checkAuth, BlogControllers.newCommentUpdate);

const PORT = process.env.PORT || 10000;
app.listen(PORT, (err) => {
    if (err) {
        return console.log('RUN FAILED', err);
    }
    console.log('SERVER IS RUNNING ON PORT ' + PORT);
});
