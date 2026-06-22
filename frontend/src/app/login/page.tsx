'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] =
  useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user',JSON.stringify(response.data.user))

      alert('Login Successful')

      router.push('/dashboard')
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Login Failed')
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
  min-h-[650px]
  flex
  flex-col
  justify-center
"
      >
        <h1 className="text-5xl font-extrabold text-white text-center">
  Welcome Back ✈️
</h1>

<p className="text-center text-blue-200 mt-2 mb-8">
  Continue your next adventure
</p>

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

        <div className="relative mb-5">
  <input
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    value={password}
    onChange={e =>
      setPassword(e.target.value)
    }
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
          Login
        </button>
        <p className="text-center text-white mt-6">
  Don't have an account?

  <a
    href="/register"
    className="text-cyan-300 ml-2 font-bold"
  >
    Register
  </a>
</p>
      </form>
    </div>
  )
}