import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Too short password').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Invalid email format').isEmail(),
    body('password', 'Too short password').isLength({ min: 5 }),
    body('fullName', 'Too short name').isLength({ min: 3 }),
];

export const blogValidation = [
    body('title', 'Too short title').isLength({ min: 1 }).isString(),
    body('text', 'Too short description').isLength({ min: 1 }).isString(),
    body('tags', 'Invalid tags format').optional().isArray(),
    body('imageUrl', 'Invalid url format').optional().isString(),
];
