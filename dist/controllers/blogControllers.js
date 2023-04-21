"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsByTag = exports.getSortPostsPopular = exports.getTags = exports.newCommentUpdate = exports.update = exports.remove = exports.create = exports.getOne = exports.getAll = void 0;
const post_1 = __importDefault(require("../models/post"));
const utils_1 = require("../utils");
const getAll = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find()
            .populate('author', '-passwordHash')
            .sort({ _id: -1 })
            .exec();
        response.json({
            success: true,
            posts,
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Posts request failed',
            error: err,
        });
    }
});
exports.getAll = getAll;
const getOne = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = request.params.id;
        const post = yield post_1.default.findOneAndUpdate({
            _id: postId,
        }, {
            $inc: { viewsCount: 1 },
        }, {
            returnDocument: 'after',
        })
            .populate('author', '-passwordHash')
            .populate('comments.user', 'fullName')
            .exec();
        response.json({
            success: true,
            post,
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Post request failed',
            error: err,
        });
    }
});
exports.getOne = getOne;
const create = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let blurHash;
        if (request.body.imageUrl) {
            blurHash = yield (0, utils_1.createBlurHash)(request.body.imageUrl);
        }
        const doc = new post_1.default({
            title: request.body.title,
            text: request.body.text,
            imageUrl: request.body.imageUrl,
            blurHash,
            tags: request.body.tags.filter((val) => val !== ''),
            author: request.userId,
        });
        const post = yield doc.save();
        utils_1.logger.info('added a new post', { id: post._id });
        response.json({
            success: true,
            post,
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Post creation failed',
            error: err,
        });
    }
});
exports.create = create;
const remove = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = request.params.id;
        post_1.default.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if (err) {
                return response.status(500).json({
                    message: 'Post delete failed',
                });
            }
            if (!doc) {
                return response.status(404).json({
                    message: 'Post not found',
                });
            }
            utils_1.logger.info('removed post', { id: postId });
            response.json({
                success: true,
            });
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Post delete failed',
            error: err,
        });
    }
});
exports.remove = remove;
const update = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = request.params.id;
        let blurHash;
        if (request.body.imageUrl) {
            blurHash = yield (0, utils_1.createBlurHash)(request.body.imageUrl);
        }
        post_1.default.updateOne({
            _id: postId,
        }, {
            title: request.body.title,
            text: request.body.text,
            imageUrl: request.body.imageUrl,
            blurHash,
            tags: request.body.tags.filter((val) => val !== ''),
            author: request.userId,
        }, (err, doc) => {
            if (err) {
                return response.status(500).json({
                    message: 'Post update failed',
                });
            }
            if (doc.matchedCount === 0) {
                return response.status(404).json({
                    message: 'Post not found',
                });
            }
            utils_1.logger.info('post updated', { id: postId });
            response.json({
                success: true,
            });
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Post update failed',
            error: err,
        });
    }
});
exports.update = update;
const newCommentUpdate = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = request.params.id;
        if (!request.body.newComment) {
            throw new Error('Required comment');
        }
        post_1.default.updateOne({
            _id: postId,
        }, {
            $push: {
                comments: {
                    user: request.userId,
                    text: request.body.newComment,
                },
            },
        }, (err, doc) => {
            if (err) {
                return response.status(500).json({
                    message: 'Post update failed',
                });
            }
            if (doc.matchedCount === 0) {
                return response.status(404).json({
                    message: 'Post not found',
                });
            }
            utils_1.logger.info('created a new comment', { id: postId });
            response.json({
                success: true,
            });
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Post update failed',
            error: err,
        });
    }
});
exports.newCommentUpdate = newCommentUpdate;
const getTags = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find().limit(8).exec();
        const tags = posts.map((obj) => obj.tags).flat();
        response.json({
            succes: true,
            tags: tags
                .filter((obj, i) => {
                return tags.indexOf(obj) === i;
            })
                .slice(0, 8),
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Tags request failed',
            error: err,
        });
    }
});
exports.getTags = getTags;
const getSortPostsPopular = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find()
            .populate('author', '-passwordHash')
            .sort({ viewsCount: -1 })
            .exec();
        response.json({
            succes: true,
            posts,
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Tags request failed',
            error: err,
        });
    }
});
exports.getSortPostsPopular = getSortPostsPopular;
const getPostsByTag = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find({ tags: request.params.tag_name })
            .populate('author', '-passwordHash')
            .exec();
        response.json({
            succes: true,
            posts,
        });
    }
    catch (err) {
        response.status(500).json({
            message: 'Tags request failed',
            error: err,
        });
    }
});
exports.getPostsByTag = getPostsByTag;
//# sourceMappingURL=blogControllers.js.map