const Trip = require('../models/Trip')

const createTrip = async (req, res) => {
  try {
    const {
  destination,
  fromLocation,
  travelMode,
  startDate,
  endDate,
  budget,
  travelers,
} = req.body

    const trip = await Trip.create({
  user: req.user.id,
  destination,
  fromLocation,
  travelMode,
  startDate,
  endDate,
  budget,
  travelers,
})

    res.status(201).json(trip)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user.id,
    })

    res.json(trips)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const addActivity = async (req, res) => {
  try {
    const { day, activity } = req.body

    const trip = await Trip.findById(req.params.id)

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    const dayPlan = trip.itinerary.find(
      item => item.day === Number(day)
    )

    if (!dayPlan) {
      return res.status(404).json({
        message: 'Day not found',
      })
    }

    dayPlan.activities.push(activity)

    await trip.save()

    res.json(trip)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const deleteActivity = async (req, res) => {
  try {
    const { day, activityIndex } = req.body

    const trip = await Trip.findById(req.params.id)

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    const dayPlan = trip.itinerary.find(
      item => item.day === Number(day)
    )

    if (!dayPlan) {
      return res.status(404).json({
        message: 'Day not found',
      })
    }

    dayPlan.activities.splice(activityIndex, 1)

    await trip.save()

    res.json(trip)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
const updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body

    const trip = await Trip.findById(req.params.id)

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    trip.status = status

    await trip.save()

    res.json(trip)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    await Trip.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Trip deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
const updateTrip = async (req, res) => {
  try {
    const {
      destination,
      budget,
      travelers,
      startDate,
      endDate,
    } = req.body

    const trip = await Trip.findById(req.params.id)

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    trip.destination =
      destination || trip.destination

    trip.budget =
      budget || trip.budget

    trip.travelers =
      travelers || trip.travelers

    trip.startDate =
      startDate || trip.startDate

    trip.endDate =
      endDate || trip.endDate

    await trip.save()

    res.json(trip)
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
module.exports = {
  createTrip,
  getTrips,
  addActivity,
  deleteActivity,
  updateTripStatus,
  deleteTrip,
  updateTrip,
}