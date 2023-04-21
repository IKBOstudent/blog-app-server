import mongoose from 'mongoose';

export interface IPostDocument extends mongoose.Document {
    title: string;
    text: string;
    imageUrl?: string;
    blurHash?: string;
    tags?: Array<string>;
    viewsCount?: number;
    author: mongoose.Types.ObjectId;
    comments: Array<{
        user: mongoose.Types.ObjectId;
        text: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
    _doc?: any;
}

const PostSchema = new mongoose.Schema<IPostDocument>(
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
