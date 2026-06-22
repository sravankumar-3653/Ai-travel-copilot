interface Props {
  trip: any
  onGenerate: (id: string) => void
}

export default function TripCard({
  trip,
  onGenerate,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold">
        {trip.destination}
      </h2>

      <p className="mt-2">
        Budget: ₹{trip.budget}
      </p>

      <p>
        Travelers: {trip.travelers}
      </p>

      <button
        onClick={() => onGenerate(trip._id)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Generate AI Itinerary
      </button>
    </div>
  )
}