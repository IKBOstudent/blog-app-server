"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
        unique: true,
    },
    imageUrl: String,
    blurHash: String,
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    comments: {
        type: [
            {
                user: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    required: true,
                    ref: 'User',
                },
                text: {
                    type: String,
                    required: true,
                },
            },
        ],
        default: [],
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('Post', PostSchema);
//# sourceMappingURL=post.js.map