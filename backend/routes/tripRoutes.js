const express = require('express')

const {
  createTrip,
  getTrips,
  addActivity,
  deleteActivity,
  updateTripStatus,
  deleteTrip,
  updateTrip,
} = require('../controllers/tripController')

const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', protect, createTrip)

router.get('/', protect, getTrips)

router.put('/:id', protect, updateTrip)

router.put('/:id/status', protect, updateTripStatus)

router.delete('/:id', protect, deleteTrip)

router.put('/:id/activity', protect, addActivity)

router.delete('/:id/activity', protect, deleteActivity)

module.exports = router