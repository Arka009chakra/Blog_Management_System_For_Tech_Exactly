const router = require('express').Router();
const Joi = require('joi');
const controller = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const postSchema = Joi.object({
  title: Joi.string().min(3).max(180).required(),
  body: Joi.string().min(10).max(30000).required(),
  excerpt: Joi.string().max(400).allow(''),
  category: Joi.string().max(60).allow(''),
  tags: Joi.array().items(Joi.string().max(30)).max(10),
  status: Joi.string().valid('published', 'draft')
});

function optionalProtect(req, res, next) {
  if (req.headers.authorization) return protect(req, res, next);
  next();
}

router.get('/', controller.list);
router.get('/mine', protect, controller.mine);
router.post('/', protect, validate(postSchema), controller.create);
router.get('/:slug', optionalProtect, controller.getOne);
router.put('/:id', protect, validate(postSchema), controller.update);
router.delete('/:id', protect, controller.remove);

module.exports = router;
