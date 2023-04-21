"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const multer_1 = __importDefault(require("multer"));
require("dotenv/config");
const validations_1 = require("./utils/validations");
const utils_1 = require("./utils");
const controllers_1 = require("./controllers");
mongoose_1.default
    .connect(String(process.env.MONGO_URI))
    .then(() => console.log('DATABASE OK'))
    .catch((err) => console.log('DATABASE FAILED', err));
const app = (0, express_1.default)();
const upload = (0, multer_1.default)();
app.use(express_1.default.json());
app.use(utils_1.loggerMiddleware);
app.get('/', controllers_1.getHome);
app.post('/api/upload', utils_1.checkAuth, upload.single('image'), controllers_1.imageUpload);
app.post('/api/auth/login', validations_1.loginValidation, utils_1.handleValidationErrors, controllers_1.UserControllers.login);
app.post('/api/auth/register', validations_1.registerValidation, utils_1.handleValidationErrors, controllers_1.UserControllers.register);
app.get('/api/auth/me', utils_1.checkAuth, controllers_1.UserControllers.getMe);
app.get('/api/posts/post/:id', controllers_1.BlogControllers.getOne);
app.get('/api/posts/latest', controllers_1.BlogControllers.getAll);
app.get('/api/posts/popular', controllers_1.BlogControllers.getSortPostsPopular);
app.get('/api/posts/tag/:tag_name', controllers_1.BlogControllers.getPostsByTag);
app.get('/api/tags', controllers_1.BlogControllers.getTags);
app.post('/api/posts', utils_1.checkAuth, validations_1.blogValidation, utils_1.handleValidationErrors, controllers_1.BlogControllers.create);
app.delete('/api/posts/:id', utils_1.checkAuth, controllers_1.BlogControllers.remove);
app.patch('/api/posts/:id', utils_1.checkAuth, validations_1.blogValidation, utils_1.handleValidationErrors, controllers_1.BlogControllers.update);
app.patch('/api/posts/:id/comment', utils_1.checkAuth, controllers_1.BlogControllers.newCommentUpdate);
console.log(process.env.PORT);
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log('SERVER IS RUNNING ON PORT ' + PORT);
}).on('error', (err) => {
    console.log('SERVER ERROR');
});
//# sourceMappingURL=index.js.map