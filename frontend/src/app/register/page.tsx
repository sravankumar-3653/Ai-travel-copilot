'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] =
  useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      await api.post('/auth/register', {
  name,
  email,
  mobile,
  password,
})

      alert('Registration Successful')

      router.push('/login')
    } catch (error: any) {
      alert(
        error?.response?.data?.message || 'Registration Failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
  className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-gradient-to-br
    from-blue-950
    via-indigo-900
    to-purple-900
    p-6
  "
>
      <form
        onSubmit={handleSubmit}
        className="
  bg-white/10
  backdrop-blur-2xl
  border
  border-white/20
  p-12
  rounded-[32px]
  shadow-2xl
  w-full
  max-w-xl
  min-h-[700px]
  flex
  flex-col
  justify-center
"
      >
        <div className="text-center mb-8">
  <div className="text-7xl mb-4">
    ✈️
  </div>

  <h2 className="text-cyan-300 text-xl font-semibold">
    AI Travel Copilot
  </h2>
</div>
        <h1 className="text-5xl font-extrabold text-white text-center">
  Create Account 
</h1>

<p className="text-center text-blue-200 mt-2 mb-8">
  Start planning smarter trips
</p>

        <input
  type="text"
  placeholder="Full Name"
  value={name}
  onChange={e => setName(e.target.value)}
  className="
    w-full
    bg-white/15
    border
    border-white/20
    text-white
    placeholder-gray-300
    p-5
    rounded-2xl
    mb-5
    text-xl
  "
  required
/>

        <input
          type="email"
          placeholder="Email"
           className="
    w-full
    bg-white/15
    border
    border-white/20
    text-white
    placeholder-gray-300
    p-5
    rounded-2xl
    mb-5
    text-xl
  "
  
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
  type="tel"
  placeholder="Mobile Number"
  pattern="[0-9]{10}"
  className="
    w-full
    bg-white/15
    border
    border-white/20
    text-white
    placeholder-gray-300
    p-5
    rounded-2xl
    mb-5
    text-xl
  "
  
  value={mobile}
  onChange={e => setMobile(e.target.value)}
  required
/>

        <div className="relative mb-5">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    className="
      w-full
      bg-white/15
      border
      border-white/20
      text-white
      placeholder-gray-300
      p-5
      rounded-2xl
      pr-16
      text-xl
    "
    required
  />

  <button
    type="button"
    onClick={() =>
      setShowPassword(!showPassword)
    }
    className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-white
    "
  >
    {showPassword ? '🙈' : '👁'}
  </button>
</div>

        <button
          type="submit"
          className="
  w-full
  bg-gradient-to-r
  from-cyan-500
  to-blue-600
  text-white
  py-5
  rounded-2xl
  font-bold
  text-lg
  hover:scale-105
  transition
  text-xl
"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center text-white mt-6 text-xl">
  Already have an account?

  <a
    href="/login"
    className="text-cyan-300 ml-2 font-bold text-xl"
  >
    Login
  </a>
</p>
      </form>
    </div>
  )
}