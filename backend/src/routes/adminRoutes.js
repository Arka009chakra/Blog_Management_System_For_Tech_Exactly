const router = require('express').Router();
const controller = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', controller.dashboard);
router.get('/users', controller.users);
router.patch('/users/:id', controller.updateUser);
router.delete('/users/:id', controller.deleteUser);

router.get('/posts', controller.posts);
router.delete('/posts/:id', controller.deletePost);

router.get('/comments', controller.comments);
router.delete('/comments/:id', controller.deleteComment);

module.exports = router;
