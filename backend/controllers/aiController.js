const Trip = require('../models/Trip')
const { generateTravelPlan } = require('../services/geminiService')

const generateItinerary = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)

    if (!trip) {
      return res.status(404).json({
        message: 'Trip not found',
      })
    }

    const aiResponse = await generateTravelPlan(trip)

    const cleanResponse = aiResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()

    const parsedData = JSON.parse(cleanResponse)

    console.log(parsedData)

    trip.itinerary = parsedData.itinerary || []

    trip.budgetEstimate =
      parsedData.budgetEstimate || {}

    trip.hotels = parsedData.hotels || []

    trip.travelTips =
      parsedData.travelTips || []

    trip.packingList =
      parsedData.packingList || []

    trip.image =
      `https://source.unsplash.com/1600x900/?${trip.destination},travel`

    await trip.save()

    res.status(200).json({
      success: true,
      trip,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  generateItinerary,
}