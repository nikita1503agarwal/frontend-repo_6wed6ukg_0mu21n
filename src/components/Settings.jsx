import { useEffect, useState } from 'react'
import { api } from '../lib/api'

function Settings(){
  const [cfg, setCfg] = useState({ consumer_key:'', consumer_secret:'', shortcode:'', passkey:'', callback_url:'', environment:'sandbox' })
  const [msg, setMsg] = useState('')

  useEffect(() => { (async ()=>{ try{ const c = await api('/mpesa/config'); setCfg(prev=>({ ...prev, ...c })) }catch(e){}})() }, [])

  const save = async (e) => {
    e.preventDefault(); setMsg('')
    try{ await api('/mpesa/config', { method:'POST', body: cfg }); setMsg('Saved!') }catch(e){ setMsg(e.message) }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow border">
      <p className="font-medium mb-2">M-Pesa (Daraja) Settings</p>
      <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Consumer Key" value={cfg.consumer_key} onChange={e=>setCfg({...cfg, consumer_key:e.target.value})} required />
        <input className="border rounded px-3 py-2" placeholder="Consumer Secret" value={cfg.consumer_secret} onChange={e=>setCfg({...cfg, consumer_secret:e.target.value})} required />
        <input className="border rounded px-3 py-2" placeholder="Shortcode" value={cfg.shortcode} onChange={e=>setCfg({...cfg, shortcode:e.target.value})} required />
        <input className="border rounded px-3 py-2" placeholder="Passkey" value={cfg.passkey} onChange={e=>setCfg({...cfg, passkey:e.target.value})} required />
        <input className="border rounded px-3 py-2 md:col-span-2" placeholder="Callback URL (public)" value={cfg.callback_url} onChange={e=>setCfg({...cfg, callback_url:e.target.value})} required />
        <select className="border rounded px-3 py-2" value={cfg.environment} onChange={e=>setCfg({...cfg, environment:e.target.value})}>
          <option value="sandbox">Sandbox</option>
          <option value="production">Production</option>
        </select>
        <div className="md:col-span-2 flex justify-end">
          <button className="bg-slate-900 text-white rounded px-3 py-2">Save Settings</button>
        </div>
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
      </form>
    </div>
  )
}

export default Settings