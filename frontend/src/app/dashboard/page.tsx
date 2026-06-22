'use client'

import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface Trip {
  _id: string
  fromLocation: string
travelMode: string
  destination: string

  startDate: string
  endDate: string

  budget: number
  travelers: number
  status?: string

  travelTips?: string[]
  packingList?: string[]
  hotels?: any[]
  itinerary?: any[]

  budgetEstimate?: {
    flights: number
    accommodation: number
    food: number
    transport: number
    activities: number
    total: number
  }
}

export default function DashboardPage() {
  const [destination, setDestination] = useState('')
  const [fromLocation, setFromLocation] =
  useState('')

const [travelMode, setTravelMode] =
  useState('Flight')
  const [budget, setBudget] = useState('')
  const [travelers, setTravelers] = useState('1')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
const [loading, setLoading] =
  useState(false)
  const [interests, setInterests] = useState<string[]>([])

  
  const [trips, setTrips] = useState<Trip[]>([])
  const [generatingTrip, setGeneratingTrip] =
  useState<string | null>(null)
  const [showProfile, setShowProfile] =
  useState(false)
  const [showAccount, setShowAccount] =
  useState(false)
  const [showPassword, setShowPassword] =
  useState(false)
  const [showStats, setShowStats] =
  useState(false)
  const [user, setUser] = useState<any>(null)

const [oldPassword, setOldPassword] =
  useState('')

const [newPassword, setNewPassword] =
  useState('')

useEffect(() => {
  const storedUser =
    localStorage.getItem('user')

  if (storedUser) {
    setUser(JSON.parse(storedUser))
  }
}, [])
  

  const [editingTrip, setEditingTrip] = useState<any>(null)

  const [editDestination, setEditDestination] = useState('')
  const [editBudget, setEditBudget] = useState('')
  const [editTravelers, setEditTravelers] = useState('')

  const [editStartDate, setEditStartDate] = useState('')
  const [editEndDate, setEditEndDate] = useState('')
const interestOptions = [
  '🏖️ Beaches',
  '🏔️ Adventure',
  '🍜 Food',
  '🌃 Nightlife',
  '🌿 Nature',
  '🛍️ Shopping',
]
const [search, setSearch] = useState('')
  const fetchTrips = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await api.get('/trips', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setTrips(response.data)
  } catch (error) {
    console.log(error)
  }
}

const handleInterestChange = (
  interest: string
) => {
  if (interests.includes(interest)) {
    setInterests(
      interests.filter(i => i !== interest)
    )
  } else {
    setInterests([...interests, interest])
  }
}

 const generateAI = async (tripId: string) => {
  try {
    setGeneratingTrip(tripId)

    const token = localStorage.getItem('token')

    await api.post(
      `/ai/${tripId}/generate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    toast.success(
      'AI Itinerary Generated Successfully'
    )

    fetchTrips()
  } catch (error) {
    console.log(error)

    toast.error(
      'Failed to generate itinerary'
    )
  } finally {
    setGeneratingTrip(null)
  }
}
  const addActivity = async (
  tripId: string,
  day: number
) => {
  const activity = prompt('Enter new activity')

  if (!activity) return

  try {
    const token = localStorage.getItem('token')

    await api.put(
      `/trips/${tripId}/activity`,
      {
        day,
        activity,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    fetchTrips()
  } catch (error) {
    console.log(error)
    alert('Failed to add activity')
  }
}

const deleteActivity = async (
  tripId: string,
  day: number,
  activityIndex: number
) => {
  try {
    const token = localStorage.getItem('token')

    await api.delete(
      `/trips/${tripId}/activity`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          day,
          activityIndex,
        },
      }
    )

    fetchTrips()
  } catch (error) {
    console.log(error)
    alert('Failed to delete activity')
  }
}
const changePassword = async () => {
  try {
    const token =
      localStorage.getItem('token')

    await api.put(
      '/auth/change-password',
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    alert(
      'Password changed successfully'
    )

    setShowPassword(false)

    setOldPassword('')
    setNewPassword('')
  } catch (error: any) {
    alert(
      error?.response?.data?.message ||
        'Failed to change password'
    )
  }
}


const exportPDF = (trip: Trip) => {
  const doc = new jsPDF()
  console.log('Packing List:', trip.packingList)
  console.log('Hotels:', trip.hotels)
  console.log('Itinerary Days:', trip.itinerary?.length)

  let y = 20
  const pageHeight = 280

  const checkPage = () => {
    if (y > pageHeight) {
      doc.addPage()
      y = 20
    }
  }

  doc.setFontSize(20)
  doc.text('AI Travel Copilot', 20, y)

  y += 12

  doc.setFontSize(16)
  doc.text(`Trip to ${trip.destination}`, 20, y)

  y += 15

  doc.setFontSize(12)

  doc.text(`Budget: ₹${trip.budget}`, 20, y)
  y += 8

  doc.text(`Travelers: ${trip.travelers}`, 20, y)
  y += 8

  doc.text(
    `Dates: ${new Date(
      trip.startDate
    ).toLocaleDateString()} - ${new Date(
      trip.endDate
    ).toLocaleDateString()}`,
    20,
    y
  )

  y += 15

  // Travel Tips
  doc.setFont('helvetica', 'bold')
  doc.text('Travel Tips', 20, y)

  doc.setFont('helvetica', 'normal')

  trip.travelTips?.forEach((tip: string) => {
    y += 8

    checkPage()

    const lines = doc.splitTextToSize(
      `• ${tip}`,
      165
    )

    doc.text(lines, 20, y)

    y += lines.length * 6
  })

  y += 10

  // Packing List
  checkPage()

  doc.setFont('helvetica', 'bold')
  doc.text('Packing List', 20, y)

  doc.setFont('helvetica', 'normal')

  trip.packingList?.forEach((item: string) => {
    y += 8

    checkPage()

    const lines = doc.splitTextToSize(
      `• ${item}`,
      165
    )

    doc.text(lines, 20, y)

    y += lines.length * 6
  })

  y += 10

  // Hotels
  checkPage()

  doc.setFont('helvetica', 'bold')
  doc.text('Recommended Hotels', 20, y)

  doc.setFont('helvetica', 'normal')

  trip.hotels?.forEach((hotel: any) => {
    y += 8

    checkPage()

    const hotelText =
      typeof hotel === 'string'
        ? hotel
        : `${hotel.name || ''} ${hotel.price || ''}`

    const lines = doc.splitTextToSize(
      `• ${hotelText}`,
      165
    )

    doc.text(lines, 20, y)

    y += lines.length * 6
  })

  y += 12

  // Itinerary
  checkPage()

  doc.setFont('helvetica', 'bold')
  doc.text('Day Wise Itinerary', 20, y)

  trip.itinerary?.forEach((day: any) => {
    y += 10

    checkPage()

    doc.setFont('helvetica', 'bold')
    doc.text(`Day ${day.day}`, 20, y)

    doc.setFont('helvetica', 'normal')

    day.activities.forEach((activity: string) => {
      y += 8

      checkPage()

      const lines = doc.splitTextToSize(
        `• ${activity}`,
        160
      )

      doc.text(lines, 25, y)

      y += lines.length * 6
    })
  })

  console.log('PDF SAVING...')
  doc.save(`${trip.destination}-trip.pdf`)
}
const updateStatus = async (
  tripId: string,
  status: string
) => {
  try {
    const token = localStorage.getItem('token')

    await api.put(
      `/trips/${tripId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    fetchTrips()
  } catch (error) {
    console.log(error)
    alert('Failed to update status')
  }
}
const deleteTrip = async (tripId: string) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this trip?'
  )

  if (!confirmed) return

  try {
    const token = localStorage.getItem('token')

    await api.delete(`/trips/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    toast.success('Trip Deleted Successfully')

    fetchTrips()
  } catch (error) {
    console.log(error)

    toast.error('Failed to delete trip')
  }
}
const openEditModal = (trip: any) => {
  setEditingTrip(trip)

  setEditDestination(trip.destination)
  setEditBudget(String(trip.budget))
  setEditTravelers(String(trip.travelers))

  setEditStartDate(
    trip.startDate.split('T')[0]
  )

  setEditEndDate(
    trip.endDate.split('T')[0]
  )
}
const saveTripChanges = async () => {
  try {
    const token = localStorage.getItem('token')

    await api.put(
      `/trips/${editingTrip._id}`,
      {
        destination: editDestination,
        budget: Number(editBudget),
        travelers: Number(editTravelers),
        startDate: editStartDate,
        endDate: editEndDate,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    toast.success('Trip Updated Successfully')

    setEditingTrip(null)

    fetchTrips()
  } catch (error) {
    console.log(error)

    toast.error('Failed to update trip')
  }
}
  useEffect(() => {
    fetchTrips()
  }, [])
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      await api.post(
  '/trips',
  {
    destination,
    fromLocation,
    travelMode,
    startDate,
    endDate,
    budget: Number(budget),
    travelers: Number(travelers),
    interests,
  },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setDestination('')
      setBudget('')
      setTravelers('1')

      fetchTrips()

      toast.success('Trip Created Successfully')
    } catch (error: any) {
      toast.error(
  error?.response?.data?.message ||
  'Failed to create trip'
)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 p-10">
      <div className="max-w-6xl mx-auto">

  <div className="flex justify-between items-center mb-10">

    <div>
      <h1 className="text-6xl font-extrabold text-white">
        AI Travel Copilot ✈️
      </h1>

      <p className="text-blue-200 mt-3 text-lg">
        Plan smarter. Travel better. Powered by AI.
      </p>
    </div>

    <div className="relative">

      <button
        onClick={() =>
          setShowProfile(!showProfile)
        }
        className="
          bg-white/20
          backdrop-blur-lg
          text-white
          px-5
          py-3
          rounded-xl
          text-xl
        "
      >
        👤 {user?.name || 'Profile'}
      </button>

      {showProfile && (
        <div
          className="
absolute
right-0
mt-4
w-80
bg-slate-900/95
backdrop-blur-xl
border
border-white/20
rounded-3xl
shadow-2xl
p-6
z-50
"
        >
          <div className="mb-6 border-b border-white/20 pb-4 text-2xl">
  <h3 className="text-white text-2xl font-bold">
    👤 {user?.name || 'Profile'}
  </h3>

  <p className="text-gray-300 text-xl mt-2">
    📧 {user?.email}
  </p>

  <p className="text-gray-300 text-xl mt-2">
    📱 {user?.mobile}
  </p>
</div>

<div className="space-y-3 mb-6">
  <div className="bg-white/10 p-3 rounded-xl text-white text-xl">
    ✈️ Trips: {trips.length}
  </div>

  <div className="bg-white/10 p-3 rounded-xl text-white text-xl">
    💰 Total Budget:
    ₹{trips.reduce((a, t) => a + t.budget, 0)}
  </div>
</div>
          <button
  onClick={() => setShowAccount(true)}
  className="
    w-full
    text-left
    py-2
    hover:bg-white/10
    rounded-lg
    px-2
    text-xl
  "
>
  👤 Account Info
</button>
<button
  onClick={() => setShowPassword(true)}
  className="
    w-full
    text-left
    py-2
    hover:bg-white/10
    rounded-lg
    px-2
    text-xl
  "
>
  🔐 Change Password
</button>
<button
  onClick={() => setShowStats(true)}
  className="
    w-full
    text-left
    py-2
    hover:bg-white/10
    rounded-lg
    px-2
    text-xl
  "
>
  📊 My Stats
</button>

          <button
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.href = '/login'
            }}
            className="
w-full
bg-gradient-to-r
from-red-500
to-red-700
text-white
font-bold
py-4
rounded-2xl
hover:scale-105
transition
text-xl
"
          >
            Logout
          </button>
        </div>
      )}

    </div>

  </div>


        <form
          onSubmit={handleSubmit}
          className="
bg-white/10
backdrop-blur-lg
border
border-white/20
p-8
rounded-3xl
shadow-2xl
mb-10
"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
  Create Your Next Adventure 🌍
</h2>
<input
  type="text"
  placeholder="From Location"
  value={fromLocation}
  onChange={e =>
    setFromLocation(e.target.value)
  }
  className="
    w-full
    bg-white/20
    border
    border-white/20
    text-white
    placeholder-gray-300
    p-4
    rounded-xl
    mb-4
    text-xl
  "
  required
/>
          <input
            type="text"
            placeholder="Destination"
            className="
w-full
bg-white/20
border
border-white/20
text-white
placeholder-gray-300
p-4
rounded-xl
mb-4
text-xl
"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            required
          />
          <select
  value={travelMode}
  onChange={e =>
    setTravelMode(e.target.value)
  }
  className="
    w-full
    bg-white/20
    border
    border-white/20
    text-white
    p-4
    rounded-xl
    mb-4
    text-xl

    
  "
>
  <option value="Flight" className='mt-4
w-80
bg-slate-900/95
backdrop-blur-xl
border
border-white/20
rounded-3xl
shadow-2xl'>
    ✈️ Flight
  </option>

  <option value="Train" className='mt-4
w-80
bg-slate-900/95
backdrop-blur-xl
border
border-white/20
rounded-3xl
shadow-2xl'>
    🚆 Train
  </option>

  <option value="Bus" className='mt-4
w-80
bg-slate-900/95
backdrop-blur-xl
border
border-white/20
rounded-3xl
shadow-2xl'>
    🚌 Bus
  </option>

  <option value="Car" className='mt-4
w-80
bg-slate-900/95
backdrop-blur-xl
border
border-white/20
rounded-3xl
shadow-2xl'>
    🚗 Car
  </option>
</select>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
  <div>
    <label className="block text-white font-semibold mb-2 text-xl">
      📅 Start Date
    </label>

    <input
      type="date"
      value={startDate}
      onChange={e => setStartDate(e.target.value)}
      className="
        w-full
        p-4
        rounded-2xl
        bg-white/15
        border
        border-white/20
        text-white
        backdrop-blur-lg
        text-xl
      "
      required
    />
  </div>

  <div>
    <label className="block text-white font-semibold mb-2 text-xl">
      🗓️ End Date
    </label>

    <input
      type="date"
      value={endDate}
      onChange={e => setEndDate(e.target.value)}
      className="
        w-full
        p-4
        rounded-2xl
        bg-white/15
        border
        border-white/20
        text-white
        backdrop-blur-lg
        text-xl
      "
      required
    />
  </div>
</div>

          <input
            type="number"
            placeholder="Budget"
            className="
w-full
bg-white/20
border
border-white/20
text-white
placeholder-gray-300
p-4
rounded-xl
mb-4
text-xl
"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Travelers"
            className="
w-full
bg-white/20
border
border-white/20
text-white
placeholder-gray-300
p-4
rounded-xl
mb-4
text-xl
"
            value={travelers}
            onChange={e => setTravelers(e.target.value)}
            required
          />
          <div className="mb-8">
  <h3 className="text-white text-xl font-bold mb-4 text-xl">
    ✨ Travel Interests
  </h3>

 <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 items-start">
    {interestOptions.map(item => (
      <div
        key={item}
        onClick={() => handleInterestChange(item)}
        className={`
          cursor-pointer
          rounded-2xl
          p-4
          text-center
          font-semibold
          transition-all
          duration-300
          border
          text-xl
          ${
            interests.includes(item)
              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 scale-105 shadow-lg'
              : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
          }
        `}
      >
        {item}
      </div>
    ))}
  </div>
</div>

          <button
            type="submit"
            className="
bg-gradient-to-r
from-cyan-500
to-blue-600
text-white
font-bold
px-8
py-4
rounded-xl
hover:scale-105
transition
text-xl
"
          >
            {loading ? 'Creating...' : 'Create Trip'}
          </button>
        </form>
        <div className="grid md:grid-cols-4 gap-4 mb-10">

  <div className="bg-cyan-500/20 p-5 rounded-2xl">
    <h3 className="text-cyan-300 text-xl">Trips</h3>
    <p className="text-3xl font-bold text-white text-xl">
      {trips.length}
    </p>
  </div>

  <div className="bg-green-500/20 p-5 rounded-2xl">
    <h3 className="text-green-300 text-xl">Budget</h3>
    <p className="text-3xl font-bold text-white text-xl">
      ₹{trips.reduce((a,b)=>a+b.budget,0)}
    </p>
  </div>

  <div className="bg-purple-500/20 p-5 rounded-2xl">
    <h3 className="text-purple-300 text-xl">Destinations</h3>
    <p className="text-3xl font-bold text-white text-xl">
      {new Set(trips.map(t=>t.destination)).size}
    </p>
  </div>

  <div className="bg-orange-500/20 p-5 rounded-2xl">
    <h3 className="text-orange-300 text-xl">AI Plans</h3>
    <p className="text-3xl font-bold text-white text-xl">
      {
        trips.filter(
          t => t.itinerary?.length
        ).length
      }
    </p>
  </div>

</div>
<input
  type="text"
  placeholder="🔍 Search Destination"
  value={search}
  onChange={e => setSearch(e.target.value)}
  className="
    w-full
    mb-8
    p-4
    rounded-xl
    bg-white/10
    border
    border-white/20
    text-white
    text-xl
  "
/>

        <h2 className="text-4xl font-bold text-white mb-8">
  My Adventures 🌎
</h2>

        <div className="space-y-8">
          {trips.length === 0 && (
  <div
    className="
      bg-white/10
      backdrop-blur-lg
      border
      border-white/20
      rounded-3xl
      p-10
      text-center
      text-white
      mt-6
    "
  >
    <h2 className="text-4xl font-bold mb-4">
      ✈️ No Trips Yet
    </h2>

    
    
    
  </div>
)}
          {trips.filter(trip =>
                trip.destination
                 .toLowerCase()
                .includes(search.toLowerCase())
                ).map(trip => (
            <div
               key={trip._id}
               className="
w-full
relative
overflow-hidden
rounded-3xl
bg-white/10
backdrop-blur-lg
border
border-white/20
shadow-2xl
p-8
"
>
  
      <h3 className="text-3xl font-bold text-cyan-300">
  🌍 {trip.destination}
</h3>
{/* FIXED: Changed columns layout to a flexbox row on desktop, layout spaces evenly */}
<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
  
  {/* Left Column Group */}
  <div className="space-y-2">
    <p className="text-white text-xl">
      📍 {trip.fromLocation} → {trip.destination}
    </p>

    <p className="text-white text-xl">
      🚘 Mode:
      <span className="font-bold text-xl ml-1">
        {trip.travelMode}
      </span>
    </p>
  </div>

  {/* Right Column Group (Fixed spacing & alignments) */}
  <div className="text-white text-left md:text-right space-y-2">
    <p className='text-xl'>
      💰 Budget:
      <span className="font-bold text-green-400 text-xl ml-1">
        ₹{trip.budget}
      </span>
    </p>

    <p className='text-xl'>
      👥 Travelers:
      <span className="font-bold text-xl ml-1">
        {trip.travelers}
      </span>
    </p>
  </div>

</div>
<div className="columns-1 md:columns-1 lg:columns-2 gap-8 space-y-8 [column-fill:_balance]">
              <button
  onClick={() => generateAI(trip._id)}
  disabled={generatingTrip === trip._id}
  className="
    mt-6
    w-full
    bg-gradient-to-r
    from-cyan-500
    to-blue-600
    text-white
    font-bold
    py-3
    rounded-xl
    hover:scale-105
    transition
    disabled:opacity-50
    disabled:cursor-not-allowed
    text-xl
  "
>
  {generatingTrip === trip._id
    ? 'Generating... ⏳'
    : 'Generate AI Itinerary'}
</button>
              <button
  onClick={() => {
    console.log("PDF BUTTON CLICKED")
    exportPDF(trip)
  }}
  className="
    mt-3
    w-full
    bg-purple-600
    text-white
    px-4
    py-2
    rounded-lg
    hover:bg-purple-700
    text-xl
  "
>
  Export PDF 📄
</button>

<button
  onClick={() => openEditModal(trip)}
  className="
    mt-3
    w-full
    bg-yellow-600
    text-white
    px-4
    py-2
    rounded-lg
    hover:bg-yellow-700
    lg:mt-6
    text-xl
  "
>
  Edit Trip ✏️
</button>

<button
 onClick={() => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete your trip to ${trip.destination}?`
    )

    if (confirmDelete) {
      deleteTrip(trip._id)
    }
  }}
  className="
    mt-3
    w-full
    bg-red-600
    text-white
    px-4
    py-2
    rounded-lg
    hover:bg-red-700
     lg:mt-6
     text-xl
  "
>
  Delete Trip 🗑️
</button>
</div>
              {trip.budgetEstimate && (
  <div className="mt-4 border-t pt-4">
    <h4 className="font-bold mb-3 text-2xl">
      💰 Budget Estimate
    </h4>

    <p className="text-xl">
      🚘 {trip.travelMode}: ₹
      {trip.budgetEstimate.transport}
    </p>

    <p className="text-xl">
      🏨 Accommodation: ₹
      {trip.budgetEstimate.accommodation}
    </p>

    <p className="text-xl">
      🍜 Food: ₹
      {trip.budgetEstimate.food}
    </p>

    <p className="text-xl">
      🎯 Activities: ₹
      {trip.budgetEstimate.activities}
    </p>

    <p className="font-bold mt-3 text-2xl text-green-400">
      💰 Total: ₹
      {trip.budgetEstimate.total}
    </p>
  </div>
)}

              {trip.hotels && trip.hotels.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold mb-2 text-xl">
                    Recommended Hotels
                  </h4>

                  {trip.hotels.map((hotel: any, index) => (
                    <div
                      key={index}
                      className="mb-2 p-2 border rounded"
                    >
                      <p className="font-semibold className='text-xl'">
                        {hotel.name}
                      </p>
                      <p className='text-xl'>{hotel.category}</p>
                      <p className='text-xl'>{hotel.priceRange}</p>
                    </div>
                  ))}
                </div>
              )}

              {trip.travelTips &&
  trip.travelTips.length > 0 && (
    <div className="mt-4 text-xl">
      <h4 className="font-bold mb-2 text-xl">
        Travel Tips
      </h4>

      <ul className='text-xl'>
        {trip.travelTips.map(
          (tip, index) => (
            <li key={index}>
              • {tip}
            </li>
          )
        )}
      </ul>
    </div>
  )}

{trip.packingList &&
  trip.packingList.length > 0 && (
    <div className="mt-4">
      <h4 className="font-bold mb-2 text-xl">
        Packing Checklist
      </h4>

      <div className="space-y-2">
        {trip.packingList.map(
          (item: string, index: number) => (
            <label
              key={index}
              className="flex items-center gap-2 text-xl"
            >
              <input
                type="checkbox"
                className="w-3 h-4 "
              />

              <span>{item}</span>
            </label>
          )
        )}
      </div>
    </div>
  )}

                

              {trip.itinerary &&
                trip.itinerary.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold mb-2 text-xl">
                      
                    </h4>

                    {trip.itinerary &&
  trip.itinerary.length > 0 && (
    <div className="mt-4">
      <h4 className="font-bold mb-2 text-xl">
        Itinerary
      </h4>

      {trip.itinerary.map(
        (dayPlan: any) => (
          <div
            key={dayPlan.day}
            className="border rounded p-3 mb-3 text-xl"
          >
            <h5 className="font-semibold mb-2">
              Day {dayPlan.day}
            </h5>

            {dayPlan.activities.map(
              (
                activity: string,
                index: number
              ) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-2"
                >
                  <span>
                    • {activity}
                  </span>

                  <button
                    onClick={() =>
                      deleteActivity(
                        trip._id,
                        dayPlan.day,
                        index
                      )
                    }
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              )
            )}

            <button
              onClick={() =>
                addActivity(
                  trip._id,
                  dayPlan.day
                )
              }
              className="mt-3 bg-green-600 text-white px-3 py-2 rounded"
            >
              Add Activity
            </button>
          </div>
        )
      )}
    </div>
  )}
                  </div>
                )}
            </div>
          ))}
        </div>
        {editingTrip && (
  <div className="
    fixed
    inset-0
    bg-black/80 backdrop-blur-md
    flex
    items-center
    justify-center
    z-50
  ">
    <div
  className="
    bg-slate-900
    border
    border-white/20
    backdrop-blur-xl
    p-8
    rounded-3xl
    w-full
    max-w-2xl
    shadow-2xl
  "
>
      <h2 className="text-5xl font-bold text-white mb-8">
  ✈️ Edit Your Trip
</h2>

      <input
        value={editDestination}
        onChange={e =>
          setEditDestination(e.target.value)
        }
        className="
  w-full
  bg-white/10
  border
  border-white/20
  text-white
  p-5 text-lg
  mt-2
  rounded-2xl
"
      />

      <input
        type="number"
        value={editBudget}
        onChange={e =>
          setEditBudget(e.target.value)
        }
        className="
      w-full
      bg-white/10
      border
      border-white/20
      text-white
      p-5 text-lg
      mt-2
      rounded-2xl
    "
      />

      <input
        type="number"
        value={editTravelers}
        onChange={e =>
          setEditTravelers(e.target.value)
        }
        className="
      w-full
      bg-white/10
      border
      border-white/20
      text-white
     p-5 text-lg
      mt-2
      rounded-2xl
    "
      />

      <div className="grid md:grid-cols-2 gap-4">
  <input
    type="date"
    value={editStartDate}
    onChange={e =>
      setEditStartDate(e.target.value)
    }
    className="
      w-full
      bg-white/10
      border
      border-white/20
      text-white
      p-5 text-lg
      mt-2
      rounded-2xl
    "
  />

  <input
    type="date"
    value={editEndDate}
    onChange={e =>
      setEditEndDate(e.target.value)
    }
    className="
      w-full
      bg-white/10
      border
      border-white/20
      text-white
      p-5 text-lg
      mt-2
      rounded-2xl
    "
  />
</div>

      <div className="flex gap-3">
        <button
          onClick={saveTripChanges}
          className="
  flex-1
  bg-gradient-to-r
  from-green-500
  to-emerald-600
  text-white
  py-5 text-lg
  mt-2
  rounded-2xl
  font-bold
"
        >
          Save
        </button>

        <button
          onClick={() =>
            setEditingTrip(null)
          }
          className="
  flex-1
  bg-gradient-to-r
  from-gray-500
  to-gray-700
  text-white
  py-5 text-lg
  mt-2
  
  rounded-2xl
  font-bold
"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

{showAccount && (
  <div className="
    fixed
    inset-0
    bg-black/60
    flex
    items-center
    justify-center
    z-50
    
  ">
    <div className="
    bg-slate-900
    border
    border-white/20
    rounded-3xl
    p-8
    py-5 text-lg
  mt-2
    w-[500px]
    shadow-2xl
    
  
    ">
      <h2 className="text-3xl font-bold mb-4">
        Account Information
      </h2>

      <p className='text-2xl'>
        <strong>Name:</strong> {user.name}
      </p>

      <p className='text-2xl'>
        <strong>Email:</strong> {user.email}
      </p>

      <p className='text-2xl'>
        <strong>Mobile:</strong> {user.mobile}
      </p>

      <p className='text-2xl'>
        <strong>Total Trips:</strong> {trips.length}
      </p>

      <button
        onClick={() =>
          setShowAccount(false)
        }
        className="
          mt-5
          w-full
          bg-blue-600
          text-white
          py-3
          py-5 text-lg
  mt-2
          rounded-lg
        "
      >
        Close
      </button>
    </div>
  </div>
)}
{showPassword && (
  <div
    className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    "
  >
    <div
      className="
    bg-slate-900
    border
    border-white/20
    rounded-3xl
    p-8
    w-[500px]
    shadow-2xl
    
  "
    >
      <h2 className="text-2xl font-bold">
        Change Password
      </h2>

      <input
        type="password"
        placeholder="Current Password"
        value={oldPassword}
        onChange={e =>
          setOldPassword(
            e.target.value
          )
        }
        className="
          w-full
          border
          p-3
          rounded
           p-5 text-lg
  mt-2
  rounded-2xl
        "
      />

      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e =>
          setNewPassword(
            e.target.value
          )
        }
        className="
          w-full
          border
          
          rounded
           p-5 text-lg
  mt-2
  rounded-2xl
        "
      />

      <div className="flex gap-3">
        <button
          onClick={changePassword}
          className="
            flex-1
            bg-green-600
            text-white
             p-5 text-lg
  mt-2
  rounded-2xl
          "
        >
          Update
        </button>

        <button
          onClick={() =>
            setShowPassword(false)
          }
          className="
            flex-1
            bg-gray-500
            text-white
            py-3
            p-5 text-lg
  mt-2
  rounded-2xl
          "
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
{showStats && (
  <div
    className="
      fixed
      inset-0
      bg-black/70
      flex
      items-center
      justify-center
      z-50
    "
  >
    <div
      className="
    bg-slate-900
    border
    border-white/20
    rounded-3xl
    p-8
    w-[500px]
    shadow-2xl
  "
    >
      <h2 className="text-3xl font-bold mb-6">
        Travel Statistics
      </h2>

      <div className="space-y-3 text-2xl">
        <p>
          🌍 Total Trips:
          <strong>
            {' '}
            {trips.length}
          </strong>
        </p>

        <p>
          📅 Planned:
          <strong>
            {' '}
            {
              trips.filter(
                t =>
                  t.status ===
                  'Planned'
              ).length
            }
          </strong>
        </p>

        <p>
          🚀 Ongoing:
          <strong>
            {' '}
            {
              trips.filter(
                t =>
                  t.status ===
                  'Ongoing'
              ).length
            }
          </strong>
        </p>

        <p>
          ✅ Completed:
          <strong>
            {' '}
            {
              trips.filter(
                t =>
                  t.status ===
                  'Completed'
              ).length
            }
          </strong>
        </p>
      </div>

      <button
        onClick={() =>
          setShowStats(false)
        }
        className="
          mt-6
          w-full
          bg-blue-600
          text-white
          py-3
          rounded-2xl
        "
      >
        Close
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  )
}
