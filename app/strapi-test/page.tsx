'use client'

import { useState } from 'react'

export default function StrapiTestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState('')

  const bust = () => `_t=${Date.now()}`

  const runStep = async (stepNum: string, label: string) => {
    setLoading(true)
    setAction(label)
    setResult(`Running step ${stepNum}: ${label}...`)
    try {
      const res = await fetch(`/api/strapi/populate?step=${stepNum}&${bust()}`, { method: 'POST' })
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setResult(String(e))
    }
    setLoading(false)
  }

  const explore = async () => {
    setLoading(true)
    setAction('explore')
    try {
      const res = await fetch(`/api/strapi-explore?${bust()}`)
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setResult(String(e))
    }
    setLoading(false)
  }

  const checkApartments = async () => {
    setLoading(true)
    setAction('check')
    try {
      const res = await fetch(`/api/apartments?${bust()}`)
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (e) {
      setResult(String(e))
    }
    setLoading(false)
  }

  const steps = [
    { num: '1', label: 'Categories', color: 'bg-green-600' },
    { num: '2', label: 'Apartments', color: 'bg-green-700' },
    { num: '3', label: 'Settings/Home/Global', color: 'bg-green-800' },
    { num: '4', label: 'Attractions', color: 'bg-teal-600' },
    { num: '5', label: 'Promotions', color: 'bg-teal-700' },
    { num: '6', label: 'Infrastructure', color: 'bg-teal-800' },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Strapi Manager</h1>
      <p className="text-sm text-gray-600 mb-6">{'Click each step in order. Each step runs separately to avoid timeouts.'}</p>
      
      <div className="mb-4">
        <h2 className="font-semibold mb-2">{'Explore'}</h2>
        <button 
          onClick={explore}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50 mr-3"
        >
          {loading && action === 'explore' ? 'Loading...' : 'Explore Strapi'}
        </button>
        <button 
          onClick={checkApartments}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {loading && action === 'check' ? 'Loading...' : 'Check Apartments API'}
        </button>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">{'Populate Data (click in order 1 -> 6)'}</h2>
        <div className="flex flex-wrap gap-2">
          {steps.map((s) => (
            <button
              key={s.num}
              onClick={() => runStep(s.num, s.label)}
              disabled={loading}
              className={`${s.color} text-white px-4 py-2 rounded disabled:opacity-50 text-sm`}
            >
              {loading && action === s.label ? 'Running...' : `${s.num}. ${s.label}`}
            </button>
          ))}
        </div>
      </div>

      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[70vh] text-sm whitespace-pre-wrap">
        {result || 'Click a button to get started'}
      </pre>
    </div>
  )
}
