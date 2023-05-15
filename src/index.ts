import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import 'dotenv/config';

import { loginValidation, registerValidation, blogValidation } from './utils/validations';

import { checkAuth, handleValidationErrors, loggerMiddleware } from './utils';
import { getHome, imageUpload, UserControllers, BlogControllers } from './controllers';

mongoose
    .connect(String(process.env.MONGO_URI))
    .then(() => console.log('DATABASE OK'))
    .catch((err) => console.log('DATABASE FAILED', err));

const app = express();

const upload = multer();

app.use(express.json());
app.use(loggerMiddleware);

app.use(cors());

// HOME
app.get('/', getHome);

// UPLOAD
app.post('/api/upload', checkAuth, upload.single('image'), imageUpload);

// AUTH
app.post('/api/auth/login', loginValidation, handleValidationErrors, UserControllers.login);
app.post(
    '/api/auth/register',
    registerValidation,
    handleValidationErrors,
    UserControllers.register,
);
app.get('/api/auth/me', checkAuth, UserControllers.getMe);

// POSTS
app.get('/api/posts/post/:id', BlogControllers.getOne);
app.get('/api/posts/latest', BlogControllers.getAll);
app.get('/api/posts/popular', BlogControllers.getSortPostsPopular);
app.get('/api/posts/tag/:tag_name', BlogControllers.getPostsByTag);
app.get('/api/tags', BlogControllers.getTags);

app.post('/api/posts', checkAuth, blogValidation, handleValidationErrors, BlogControllers.create);
app.delete('/api/posts/:id', checkAuth, BlogControllers.remove);
app.patch(
    '/api/posts/:id',
    checkAuth,
    blogValidation,
    handleValidationErrors,
    BlogControllers.update,
);
app.patch('/api/posts/:id/comment', checkAuth, BlogControllers.newCommentUpdate);

console.log(process.env.PORT);
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log('SERVER IS RUNNING ON PORT ' + PORT);
}).on('error', (err) => {
    console.log('SERVER ERROR');
});
