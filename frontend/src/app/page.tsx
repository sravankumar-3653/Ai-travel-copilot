import Link from 'next/link'

export default function Home() {
return ( <main className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-purple-900 text-white"> <div className="max-w-7xl mx-auto px-6 py-20">

```
    {/* Hero Section */}
    <div className="text-center py-20">
      <h1 className="text-7xl font-extrabold">
        AI Travel Copilot ✈️
      </h1>

      <p className="text-blue-100 text-2xl mt-6 max-w-4xl mx-auto">
        Plan smarter journeys with AI-generated itineraries,
        budget estimation, hotel recommendations,
        packing checklists and travel insights.
      </p>

      <div className="flex justify-center gap-6 mt-10">
        <Link
          href="/login"
          className="
          px-8
          py-4
          bg-white
          text-blue-700
          rounded-2xl
          font-bold
          text-lg
          hover:scale-105
          transition
          "
        >
          Login
        </Link>

        <Link
          href="/register"
          className="
          px-8
          py-4
          bg-gradient-to-r
          from-pink-500
          to-purple-600
          text-white
          rounded-2xl
          font-bold
          text-lg
          hover:scale-105
          transition
          "
        >
          Register
        </Link>
      </div>
    </div>

    {/* Features */}
    <div className="grid md:grid-cols-3 gap-8 mt-20">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
        <h3 className="text-3xl font-bold text-cyan-300">
          🤖 AI Itinerary
        </h3>

        <p className="text-white mt-4 text-lg">
          Generate complete day-by-day travel plans using AI.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
        <h3 className="text-3xl font-bold text-green-300">
          💰 Budget Planning
        </h3>

        <p className="text-white mt-4 text-lg">
          Estimate transport, hotels, food and activity costs.
        </p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20">
        <h3 className="text-3xl font-bold text-pink-300">
          🏨 Hotel Suggestions
        </h3>

        <p className="text-white mt-4 text-lg">
          Discover recommended hotels for every destination.
        </p>
      </div>

    </div>

    {/* Stats */}
    <div className="grid md:grid-cols-4 gap-6 mt-24">

      <div className="bg-white/10 p-8 rounded-3xl text-center">
        <h3 className="text-5xl font-bold text-cyan-300">
          100+
        </h3>
        <p className="mt-3 text-xl">
          Destinations
        </p>
      </div>

      <div className="bg-white/10 p-8 rounded-3xl text-center">
        <h3 className="text-5xl font-bold text-green-300">
          500+
        </h3>
        <p className="mt-3 text-xl">
          Trips Planned
        </p>
      </div>

      <div className="bg-white/10 p-8 rounded-3xl text-center">
        <h3 className="text-5xl font-bold text-pink-300">
          1000+
        </h3>
        <p className="mt-3 text-xl">
          AI Plans Generated
        </p>
      </div>

      <div className="bg-white/10 p-8 rounded-3xl text-center">
        <h3 className="text-5xl font-bold text-yellow-300">
          98%
        </h3>
        <p className="mt-3 text-xl">
          Satisfaction
        </p>
      </div>

    </div>

    {/* CTA */}
    <div className="text-center mt-28">
      <h2 className="text-5xl font-bold">
        Start Planning Your Dream Trip Today
      </h2>

      <Link
        href="/register"
        className="
        inline-block
        mt-8
        px-10
        py-5
        rounded-2xl
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        text-white
        font-bold
        text-xl
        hover:scale-105
        transition
        "
      >
        Get Started 🚀
      </Link>
    </div>

  </div>
</main>


)
}
