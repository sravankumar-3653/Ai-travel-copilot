const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },
    fromLocation: {
  type: String,
  required: true,
},

travelMode: {
  type: String,
  default: 'Flight',
},

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    travelers: {
      type: Number,
      required: true,
    },
    status: {
  type: String,
  enum: ['Planned', 'Ongoing', 'Completed'],
  default: 'Planned',
},

    interests: [
      {
        type: String,
      },
    ],

    itinerary: [
      {
        day: {
          type: Number,
          required: true,
        },
        activities: [
          {
            type: String,
          },
        ],
      },
    ],

    budgetEstimate: {
      flights: {
        type: Number,
        default: 0,
      },
      accommodation: {
        type: Number,
        default: 0,
      },
      food: {
        type: Number,
        default: 0,
      },
      transport: {
        type: Number,
        default: 0,
      },
      activities: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },

    hotels: [
      {
        name: String,
        category: String,
        priceRange: String,
      },
    ],

    travelTips: [
      {
        type: String,
      },
    ],
    packingList: [
  {
    type: String,
  },
],

  },
     
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Trip', tripSchema)