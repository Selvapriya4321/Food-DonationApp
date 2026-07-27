const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const {
    getAllNGOs,
    getNGOById,
    createNGO,
    updateNGO,
    deleteNGO,
} = require('../controllers/ngoController');

// ============================================
// 1. PUBLIC ROUTES
// ============================================

// Get all NGOs
router.get('/', asyncHandler(getAllNGOs));

// Get NGO by ID
router.get('/:id', asyncHandler(getNGOById));

// ============================================
// 2. PROTECTED ROUTES
// ============================================

// Create NGO (protected)
router.post('/', auth, asyncHandler(createNGO));

// Update NGO (protected)
router.put('/:id', auth, asyncHandler(updateNGO));

// Delete NGO (protected)
router.delete('/:id', auth, asyncHandler(deleteNGO));

module.exports = router;