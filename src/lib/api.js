export const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function getToken() {
  return localStorage.getItem('token') || ''
}

export function setToken(t) {
  localStorage.setItem('token', t)
}

export function clearToken() {
  localStorage.removeItem('token')
}

export async function api(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const url = `${API_URL}${path}`
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }
  if (auth) {
    const token = getToken()
    if (token) opts.headers['Authorization'] = `Bearer ${token}`
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(url, opts)
  if (!res.ok) {
    let msg = `${res.status}`
    try { const j = await res.json(); msg = j.detail || j.message || JSON.stringify(j) } catch {}
    throw new Error(msg)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}
