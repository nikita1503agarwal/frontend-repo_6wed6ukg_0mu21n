import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Clients from './components/Clients'
import Invoices from './components/Invoices'
import Settings from './components/Settings'
import { getToken, clearToken, api } from './lib/api'

function App() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('dashboard')

  useEffect(() => {
    const t = getToken()
    if (t) {
      api('/me').then(setUser).catch(() => clearToken())
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100">
      <Hero />

      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-20">
        {!user ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Auth onAuthed={(u) => setUser(u)} />
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold mb-2">What you can do</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Create professional invoices and share PDF/links</li>
                <li>Send M-Pesa STK push payment requests</li>
                <li>Track paid, pending and overdue invoices</li>
                <li>Manage clients and view their history</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <p className="font-semibold">{user.name || user.email}</p>
              </div>
              <div className="flex gap-2">
                {['dashboard','clients','invoices','settings'].map(t => (
                  <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded ${tab===t?'bg-slate-900 text-white':'bg-slate-100'}`}>{t[0].toUpperCase()+t.slice(1)}</button>
                ))}
                <button onClick={()=>{ clearToken(); setUser(null) }} className="px-3 py-1 rounded bg-red-100 text-red-700">Logout</button>
              </div>
            </div>

            {tab==='dashboard' && <Dashboard />}
            {tab==='clients' && <Clients onSelect={() => setTab('invoices')} />}
            {tab==='invoices' && <Invoices onCreate={() => setTab('invoices')} />}
            {tab==='settings' && <Settings />}
          </div>
        )}
      </div>

      <footer className="text-center text-slate-500 text-sm py-10">Built for SMEs • Localized for M-Pesa</footer>
    </div>
  )
}

export default App