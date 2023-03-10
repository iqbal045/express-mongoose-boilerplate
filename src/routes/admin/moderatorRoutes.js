const router = require('express').Router();
const isAdmin = require('../../middlewares/isAdmin');
const {
  getModerators,
  createModerator,
  getModeratorById,
  updateModeratorById,
  deleteModeratorById,
  moderatorStatusChange,
  getModeratorsCount,
} = require('../../controllers/admin/ModeratorController');

// Get Moderators
router.get('/', isAdmin, getModerators);

// Create Moderator
router.post('/', isAdmin, createModerator);

// Get Moderator by Id.
router.get(`/:id`, isAdmin, getModeratorById);

// Update Moderator by Id.
router.put(`/:id`, isAdmin, updateModeratorById);

// Delete Moderator by Id.
router.delete(`/:id`, isAdmin, deleteModeratorById);

// Moderator Status Change by Id.
router.get(`/change-status/:id`, isAdmin, moderatorStatusChange);

// Get Moderators Count
router.get(`/get/count`, isAdmin, getModeratorsCount);

module.exports = router;
