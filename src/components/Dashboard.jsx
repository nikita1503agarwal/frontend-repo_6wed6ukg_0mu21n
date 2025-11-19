import { useEffect, useState } from 'react'
import { api } from '../lib/api'

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow border">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{new Intl.NumberFormat().format(value)}</p>
    </div>
  )
}

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const res = await api('/dashboard/summary')
        setData(res)
      } catch (e) { console.error(e) }
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Paid" value={data?.status?.Paid || 0} />
        <Card title="Pending" value={data?.status?.Pending || 0} />
        <Card title="Overdue" value={data?.status?.Overdue || 0} />
      </div>

      <div className="bg-white rounded-xl p-4 shadow border">
        <p className="font-medium mb-2">Recent Transactions</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Date</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent || []).map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">{new Date(r.created_at).toLocaleString()}</td>
                  <td>{r.reference || '-'}</td>
                  <td>{r.amount}</td>
                  <td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard