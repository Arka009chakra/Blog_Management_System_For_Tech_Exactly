const router = require('express').Router();
const Joi = require('joi');
const controller = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');

const commentSchema = Joi.object({
  body: Joi.string().min(1).max(2000).required(),
  post: Joi.string().optional()
});

router.post('/', protect, validate(commentSchema), controller.create);
router.put('/:id', protect, validate(commentSchema), controller.update);
router.delete('/:id', protect, controller.remove);

module.exports = router;
