const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const generateTravelPlan = async trip => {
  const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
})

  const prompt = `
Generate a detailed travel plan.

Starting Location: ${trip.fromLocation}

Destination: ${trip.destination}

Travel Mode: ${trip.travelMode}

Travelers: ${trip.travelers}

Budget: ${trip.budget}

Transportation cost MUST be estimated according to the selected travel mode.

If Travel Mode is Flight:
Estimate flight ticket costs.

If Travel Mode is Train:
Estimate train ticket costs.

If Travel Mode is Bus:
Estimate bus ticket costs.

If Travel Mode is Car:
Estimate fuel, toll and parking expenses.

Generate realistic hotel recommendations.

Generate useful travel tips.

Generate a packing checklist.

Return ONLY valid JSON in this format:

{
  "itinerary": [
    {
      "day": 1,
      "activities": [
        "Activity 1",
        "Activity 2"
      ]
    }
  ],
  "budgetEstimate": {
    "flights": 0,
    "accommodation": 0,
    "food": 0,
    "transport": 0,
    "activities": 0,
    "total": 0
  },
  "hotels": [
    {
      "name": "",
      "category": "",
      "priceRange": ""
    }
  ],
  "travelTips": [
    ""
  ],
  "packingList": [
    ""
  ]
}
`

  console.log(
  'AI INPUT:',
  trip.fromLocation,
  trip.destination,
  trip.travelMode
)

const result = await model.generateContent(prompt)

console.log('RAW AI RESPONSE:')
console.log(result.response.text())

return result.response.text()
}

module.exports = {
  generateTravelPlan,
}