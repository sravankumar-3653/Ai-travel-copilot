export default function Navbar() {
  return (
    <nav className="bg-black text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">
        AI Travel Copilot ✈️
      </h1>

      <button className="bg-purple-600 px-4 py-2 rounded-lg">
        Logout
      </button>
    </nav>
  )
}