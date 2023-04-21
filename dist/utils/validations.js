"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogValidation = exports.registerValidation = exports.loginValidation = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidation = [
    (0, express_validator_1.body)('email', 'Invalid email format').isEmail(),
    (0, express_validator_1.body)('password', 'Too short password').isLength({ min: 5 }),
];
exports.registerValidation = [
    (0, express_validator_1.body)('email', 'Invalid email format').isEmail(),
    (0, express_validator_1.body)('password', 'Too short password').isLength({ min: 5 }),
    (0, express_validator_1.body)('fullName', 'Too short name').isLength({ min: 3 }),
];
exports.blogValidation = [
    (0, express_validator_1.body)('title', 'Too short title').isLength({ min: 1 }).isString(),
    (0, express_validator_1.body)('text', 'Too short description').isLength({ min: 1 }).isString(),
    (0, express_validator_1.body)('tags', 'Invalid tags format').optional().isArray(),
    (0, express_validator_1.body)('imageUrl', 'Invalid url format').optional().isString(),
];
//# sourceMappingURL=validations.js.map