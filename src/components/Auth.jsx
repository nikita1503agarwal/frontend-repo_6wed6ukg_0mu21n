import { useState } from 'react'
import { api, setToken } from '../lib/api'

function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register'
      const body = mode === 'login' ? { email, password } : { email, name, password }
      const res = await api(path, { method: 'POST', body, auth: false })
      setToken(res.token)
      onAuthed(res.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('login')} className={`px-3 py-1 rounded ${mode==='login'?'bg-slate-900 text-white':'bg-slate-100'}`}>Login</button>
        <button onClick={() => setMode('register')} className={`px-3 py-1 rounded ${mode==='register'?'bg-slate-900 text-white':'bg-slate-100'}`}>Register</button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode==='register' && (
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Jane Doe" required />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="you@company.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="••••••••" required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full bg-slate-900 text-white rounded py-2">{loading?'Please wait...':(mode==='login'?'Login':'Create Account')}</button>
      </form>
    </div>
  )
}

export default Auth