import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
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
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        comments: {
            type: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Post', PostSchema);
