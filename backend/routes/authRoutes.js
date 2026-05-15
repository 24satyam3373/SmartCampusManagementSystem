const express = require('express');
const router = express.Router();
const {
  register, login, getMe, updateProfile, getUsers,
  changePassword, getDashboardStats,
  deleteUser, toggleUserStatus, updateUserRole, uploadAvatar,
} = require('../controllers/authController');
const { uploadAvatar: uploadMiddleware } = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/upload-avatar', protect, uploadMiddleware.single('avatar'), uploadAvatar);
router.put('/change-password', protect, changePassword);
router.get('/users', protect, roleCheck('Admin'), getUsers);
router.get('/dashboard-stats', protect, getDashboardStats);
router.delete('/users/:id', protect, roleCheck('Admin'), deleteUser);
router.put('/users/:id/toggle-status', protect, roleCheck('Admin'), toggleUserStatus);
router.put('/users/:id/role', protect, roleCheck('Admin'), updateUserRole);

module.exports = router;
