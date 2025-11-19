import { useEffect, useState } from 'react'
import { api, API_URL } from '../lib/api'

function Row({i, onPay}){
  return (
    <tr className="border-t">
      <td className="py-2">{i.invoice_number}</td>
      <td>{i.client?.name || i.client_id}</td>
      <td>{i.total} {i.currency}</td>
      <td>{i.status}</td>
      <td className="text-right">
        <a href={`${API_URL}/invoices/${i.id}/html`} target="_blank" className="text-slate-700 mr-3">View</a>
        {i.status !== 'Paid' && <button onClick={() => onPay(i)} className="bg-green-600 text-white rounded px-3 py-1">Pay</button>}
      </td>
    </tr>
  )
}

function Invoices({ onCreate }) {
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [form, setForm] = useState({ client_id: '', issue_date: '', due_date: '', currency: 'KES', items: [], notes: '' })
  const [item, setItem] = useState({ description: '', quantity: 1, unit_price: 0, tax_rate: 0 })
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const inv = await api('/invoices')
    const cli = await api('/clients')
    setInvoices(inv)
    setClients(cli)
  }
  useEffect(() => { load() }, [])

  const addItem = (e) => {
    e.preventDefault()
    setForm({...form, items: [...form.items, item]}); setItem({ description: '', quantity: 1, unit_price: 0, tax_rate: 0 })
  }

  const create = async (e) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await api('/invoices', { method: 'POST', body: { ...form } })
      setForm({ client_id: '', issue_date: '', due_date: '', currency: 'KES', items: [], notes: '' })
      await load(); onCreate && onCreate(res)
    } catch (e) { alert(e.message) }
    setLoading(false)
  }

  const pay = async (inv) => {
    const phone = prompt('Enter M-Pesa phone number (e.g. 2547XXXXXXXX)')
    if (!phone) return
    try {
      const res = await api('/payments/stkpush', { method: 'POST', body: { invoice_id: inv.id, phone } })
      alert('Payment prompt sent. Confirm on your phone.')
      await load()
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="bg-white rounded-xl p-4 shadow border">
        <p className="font-medium mb-2">Create Invoice</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <select className="border rounded px-3 py-2" value={form.client_id} onChange={e=>setForm({...form, client_id: e.target.value})} required>
            <option value="">Select client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="date" className="border rounded px-3 py-2" value={form.issue_date} onChange={e=>setForm({...form, issue_date: e.target.value})} required />
          <input type="date" className="border rounded px-3 py-2" value={form.due_date} onChange={e=>setForm({...form, due_date: e.target.value})} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Description" value={item.description} onChange={e=>setItem({...item, description: e.target.value})} />
          <input type="number" className="border rounded px-3 py-2" placeholder="Qty" value={item.quantity} onChange={e=>setItem({...item, quantity: parseFloat(e.target.value)})} />
          <input type="number" className="border rounded px-3 py-2" placeholder="Unit Price" value={item.unit_price} onChange={e=>setItem({...item, unit_price: parseFloat(e.target.value)})} />
          <input type="number" className="border rounded px-3 py-2" placeholder="Tax %" value={item.tax_rate} onChange={e=>setItem({...item, tax_rate: parseFloat(e.target.value)})} />
          <button onClick={addItem} className="bg-slate-900 text-white rounded px-3 py-2">Add Item</button>
        </div>
        {form.items.length>0 && (
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Description</th><th>Qty</th><th>Unit</th><th>Tax</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {form.items.map((it, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="py-2">{it.description}</td>
                    <td>{it.quantity}</td>
                    <td>{it.unit_price}</td>
                    <td>{it.tax_rate}%</td>
                    <td>{(it.quantity*it.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3 flex justify-end">
          <button disabled={loading} className="bg-green-600 text-white rounded px-3 py-2">Create Invoice</button>
        </div>
      </form>

      <div className="bg-white rounded-xl p-4 shadow border">
        <p className="font-medium mb-2">Invoices</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500"><th className="py-2">Number</th><th>Client</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {invoices.map(i => <Row key={i.id} i={i} onPay={pay} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Invoices