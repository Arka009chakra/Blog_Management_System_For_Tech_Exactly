const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Activity = require('../models/Activity');
const slugify = require('slugify');

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(30, Math.max(1, Number(req.query.limit) || 10));
    const filter = { status: 'published' };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.tag) filter.tags = String(req.query.tag).toLowerCase();
    if (req.query.search) filter.$text = { $search: req.query.search };

    const posts = await Post.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments(filter);
    res.json({ posts, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    next(error);
  }
};

// This endpoint accepts either a post ID or its slug.
exports.getOne = async (req, res, next) => {
  try {
    const value = req.params.slug;
    const condition = /^[0-9a-fA-F]{24}$/.test(value)
      ? { _id: value }
      : { slug: value };

    const post = await Post.findOne(condition).populate('author', 'name');

    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = req.user && String(post.author._id) === String(req.user._id);
    const isAdmin = req.user && req.user.role === 'admin';

    if (post.status === 'draft' && !isOwner && !isAdmin) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comments = await Comment.find({ post: post._id })
      .populate('author', 'name')
      .sort({ createdAt: 1 });

    res.json({ post, comments });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const baseSlug = slugify(req.body.title, { lower: true, strict: true }) || 'post';
    let slug = baseSlug;
    let number = 1;

    while (await Post.findOne({ slug })) {
      number += 1;
      slug = `${baseSlug}-${number}`;
    }

    const post = await Post.create({
      ...req.body,
      slug,
      author: req.user._id
    });

    await Activity.create({
      actor: req.user._id,
      action: 'POST_CREATE',
      targetType: 'Post',
      targetId: String(post._id)
    });

    res.status(201).json({ post });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const allowed = ['title', 'body', 'excerpt', 'category', 'tags', 'status'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) post[key] = req.body[key];
    });

    await post.save();
    res.json({ post });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (String(post.author) !== String(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    await Activity.create({
      actor: req.user._id,
      action: 'POST_DELETE',
      targetType: 'Post',
      targetId: String(post._id)
    });

    res.json({ message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

exports.mine = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    next(error);
  }
};
