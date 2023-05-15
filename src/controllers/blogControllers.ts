import PostModel from '../models/post';
import { createBlurHash, logger } from '../utils';

export const getAll = async (request, response) => {
    try {
        const posts = await PostModel.find()
            .populate('author', '-passwordHash')
            .sort({ _id: -1 })
            .exec();

        response.json({
            success: true,
            posts,
        });
    } catch (err) {
        response.status(500).json({
            message: 'Posts request failed',
            error: err,
        });
    }
};

export const getOne = async (request, response) => {
    try {
        const postId = request.params.id;

        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
        )
            .populate('author', '-passwordHash')
            .populate('comments.user', 'fullName')
            .exec();

        response.json({
            success: true,
            post,
        });
    } catch (err) {
        response.status(500).json({
            message: 'Post request failed',
            error: err,
        });
    }
};

export const create = async (request, response) => {
    try {
        let blurHash;
        if (request.body.imageUrl) {
            blurHash = await createBlurHash(request.body.imageUrl);
        }

        const doc = new PostModel({
            title: request.body.title,
            text: request.body.text,
            imageUrl: request.body.imageUrl,
            blurHash,
            tags: request.body.tags.filter((val) => val !== ''),
            author: request.userId,
        });
        const post = await doc.save();

        logger.info('added a new post', { id: post._id });

        response.json({
            success: true,
            post,
        });
    } catch (err) {
        response.status(500).json({
            message: 'Post creation failed',
            error: err,
        });
    }
};

export const remove = async (request, response) => {
    try {
        const postId = request.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err, doc) => {
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

                logger.info('removed post', { id: postId });
                response.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        response.status(500).json({
            message: 'Post delete failed',
            error: err,
        });
    }
};

export const update = async (request, response) => {
    try {
        const postId = request.params.id;

        let blurHash;
        if (request.body.imageUrl) {
            blurHash = await createBlurHash(request.body.imageUrl);
        }

        PostModel.updateOne(
            {
                _id: postId,
            },
            {
                title: request.body.title,
                text: request.body.text,
                imageUrl: request.body.imageUrl,
                blurHash,
                tags: request.body.tags.filter((val) => val !== ''),
                author: request.userId,
            },
            (err, doc) => {
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

                logger.info('post updated', { id: postId });
                response.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        response.status(500).json({
            message: 'Post update failed',
            error: err,
        });
    }
};

export const newCommentUpdate = async (request, response) => {
    try {
        const postId = request.params.id;
        if (!request.body.newComment) {
            throw new Error('Required comment');
        }

        PostModel.updateOne(
            {
                _id: postId,
            },
            {
                $push: {
                    comments: {
                        user: request.userId,
                        text: request.body.newComment,
                    },
                },
            },
            (err, doc) => {
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

                logger.info('created a new comment', { id: postId });
                response.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        response.status(500).json({
            message: 'Post update failed',
            error: err,
        });
    }
};

export const getTags = async (request, response) => {
    try {
        const posts = await PostModel.find().limit(8).exec();
        const tags = posts.map((obj) => obj.tags).flat();

        response.json({
            succes: true,
            tags: tags
                .filter((obj, i) => {
                    return tags.indexOf(obj) === i;
                })
                .slice(0, 8),
        });
    } catch (err) {
        response.status(500).json({
            message: 'Tags request failed',
            error: err,
        });
    }
};

export const getSortPostsPopular = async (request, response) => {
    try {
        const posts = await PostModel.find()
            .populate('author', '-passwordHash')
            .sort({ viewsCount: -1 })
            .exec();

        response.json({
            succes: true,
            posts,
        });
    } catch (err) {
        response.status(500).json({
            message: 'Tags request failed',
            error: err,
        });
    }
};

export const getPostsByTag = async (request, response) => {
    try {
        const posts = await PostModel.find({ tags: request.params.tag_name })
            .populate('author', '-passwordHash')
            .exec();

        response.json({
            succes: true,
            posts,
        });
    } catch (err) {
        response.status(500).json({
            message: 'Tags request failed',
            error: err,
        });
    }
};
