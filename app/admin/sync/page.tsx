'use client'

import { useState } from 'react'

const neighborhoods = [
  { name: 'الفيحاء', slug: 'al-fayha', lat: 24.6877, lng: 46.7219 },
  { name: 'السلام', slug: 'al-salam', lat: 24.6942, lng: 46.7167 },
  { name: 'الروابي', slug: 'al-rawabi', lat: 24.7089, lng: 46.7234 },
  { name: 'الربوة', slug: 'al-rabwah', lat: 24.7012, lng: 46.6891 },
  { name: 'الريان', slug: 'al-rayan', lat: 24.7156, lng: 46.7312 },
  { name: 'المنار', slug: 'al-manar', lat: 24.6823, lng: 46.7445 },
  { name: 'السعادة', slug: 'al-saada', lat: 24.6756, lng: 46.7123 },
  { name: 'الصفا', slug: 'al-safa', lat: 24.6934, lng: 46.7389 },
]

export default function SyncPage() {
  const [results, setResults] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)

  async function sync(n: typeof neighborhoods[0]) {
    setLoading(n.slug)
    try {
      const res = await fetch('/api/sync/mosques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ neighborhoodSlug: n.slug, lat: n.lat, lng: n.lng }),
      })
      const data = await res.json()
      setResults(r => ({ ...r, [n.slug]: '✓ أضاف ' + (data.added || 0) + ' مسجد' }))
    } catch {
      setResults(r => ({ ...r, [n.slug]: '✗ خطأ' }))
    }
    setLoading(null)
  }

  async function syncAll() {
     for (const n of neighborhoods) {
  await sync(n)
  await new Promise(r => setTimeout(r, 2000))
}
  }
  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">جلب المساجد</h1>
        <p className="text-gray-500 mb-6">جلب مساجد من OpenStreetMap لكل حي</p>
        <button
          onClick={syncAll}
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium mb-6 w-full"
        >
          جلب كل الأحياء
        </button>
        <div className="flex flex-col gap-3">
          {neighborhoods.map(n => (
            <div key={n.slug} className="bg-white rounded-xl border border-gray-100 p-4 flex justify-between items-center">
              <span className="font-medium text-gray-800">{n.name}</span>
              <div className="flex items-center gap-3">
                {results[n.slug] && <span className="text-sm text-green-600">{results[n.slug]}</span>}
                <button
                  onClick={() => sync(n)}
                  disabled={loading === n.slug}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm"
                >
                  {loading === n.slug ? 'جاري...' : 'جلب'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}