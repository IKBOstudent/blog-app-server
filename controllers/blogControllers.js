import PostModel from "../models/post.js";

export const getAll = async (request, response) => {
  try {
    const posts = await PostModel.find().populate("author").exec();
    response.json({
      success: true,
      posts,
    });
  } catch (err) {
    response.status(500).json({
      message: "Posts request failed",
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
        returnDocument: "after",
      }
    )
      .populate("author")
      .exec();

    response.json({
      success: true,
      post,
    });
  } catch (err) {
    response.status(500).json({
      message: "Post request failed",
      error: err,
    });
  }
};

export const create = async (request, response) => {
  try {
    const doc = new PostModel({
      title: request.body.title,
      text: request.body.text,
      imageUrl: request.body.imageUrl,
      tags: request.body.tags,
      author: request.userId,
    });
    const post = await doc.save();

    response.json({
      success: true,
      post,
    });
  } catch (err) {
    response.status(500).json({
      message: "Post creation failed",
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
            message: "Post delete failed",
          });
        }

        if (!doc) {
          return response.status(404).json({
            message: "Post not found",
          });
        }

        response.json({
          success: true,
        });
      }
    );
  } catch (err) {
    response.status(500).json({
      message: "Post delete failed",
      error: err,
    });
  }
};

export const update = async (request, response) => {
  try {
    const postId = request.params.id;

    PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: request.body.title,
        text: request.body.text,
        imageUrl: request.body.imageUrl,
        tags: request.body.tags,
        author: request.userId,
      },
      (err, doc) => {
        if (err) {
          return response.status(500).json({
            message: "Post update failed",
          });
        }
        response.json({
          success: true,
        });
      }
    );
  } catch (err) {
    response.status(500).json({
      message: "Post update failed",
      error: err,
    });
  }
};

export const getTags = async (request, response) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    response.json({
      succes: true,
      tags,
    });
  } catch (err) {
    response.status(500).json({
      message: "Tags request failed",
      error: err,
    });
  }
};
