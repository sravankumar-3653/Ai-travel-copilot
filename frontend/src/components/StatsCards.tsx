interface Props {
  trips: number
}

export default function StatsCards({ trips }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-gray-500">
          Total Trips
        </h3>

        <p className="text-4xl font-bold">
          {trips}
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-gray-500">
          AI Generated
        </h3>

        <p className="text-4xl font-bold">
          {trips}
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow">
        <h3 className="text-gray-500">
          Destinations
        </h3>

        <p className="text-4xl font-bold">
          {trips}
        </p>
      </div>
    </div>
  )
}