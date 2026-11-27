const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');

exports.dashboard = async (req, res, next) => {
  try {
    const [users, posts, comments, activities] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
      Activity.find()
        .populate('actor', 'name email')
        .sort({ createdAt: -1 })
        .limit(15)
    ]);

    res.json({ stats: { users, posts, comments }, activities });
  } catch (error) {
    next(error);
  }
};

exports.users = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (String(user._id) === String(req.user._id) && req.body.role === 'user') {
      return res.status(400).json({ message: 'You cannot remove your own admin role' });
    }

    if (req.body.role && ['admin', 'user'].includes(req.body.role)) {
      user.role = req.body.role;
    }
    if (typeof req.body.isActive === 'boolean') {
      user.isActive = req.body.isActive;
    }

    await user.save();
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const posts = await Post.find({ author: user._id }).select('_id');
    const postIds = posts.map(post => post._id);

    await Comment.deleteMany({ $or: [{ author: user._id }, { post: { $in: postIds } }] });
    await Post.deleteMany({ author: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User and their content deleted' });
  } catch (error) {
    next(error);
  }
};

exports.posts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    next(error);
  }
};

exports.comments = async (req, res, next) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'name email')
      .populate('post', 'title')
      .sort({ createdAt: -1 });
    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ message: 'Comment removed' });
  } catch (error) {
    next(error);
  }
};
