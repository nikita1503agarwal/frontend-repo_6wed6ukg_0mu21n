import { useEffect, useState } from 'react'
import { api } from '../lib/api'

function Clients({ onSelect }) {
  const [clients, setClients] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    try { const res = await api('/clients'); setClients(res) } catch (e) { console.error(e) }
  }
  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await api('/clients', { method: 'POST', body: { name, email } }); setName(''); setEmail(''); await load() } catch (e) { alert(e.message) }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="bg-white rounded-xl p-4 shadow border grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Client name" value={name} onChange={e=>setName(e.target.value)} required />
        <input type="email" className="border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button disabled={loading} className="bg-slate-900 text-white rounded px-3 py-2">Add Client</button>
      </form>
      <div className="bg-white rounded-xl p-4 shadow border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} className="border-t">
                <td className="py-2">{c.name}</td>
                <td>{c.email || '-'}</td>
                <td><button onClick={() => onSelect(c)} className="text-blue-600">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Clients