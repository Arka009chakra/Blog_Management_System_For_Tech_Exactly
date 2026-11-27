const Comment = require('../models/Comment');
const Post = require('../models/Post');

exports.create = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.body.post, status: 'published' });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      body: req.body.body
    });

    await comment.populate('author', 'name');
    res.status(201).json({ comment });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    comment.body = req.body.body;
    await comment.save();
    await comment.populate('author', 'name');
    res.json({ comment });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (String(comment.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
