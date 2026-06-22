const express = require('express')

const { generateItinerary } = require('../controllers/aiController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/:id/generate', protect, generateItinerary)

module.exports = router