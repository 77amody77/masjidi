'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AddMosquePage() {
  const [name, setName] = useState('')
  const searchParams = useSearchParams()
  const [neighborhood, setNeighborhood] = useState(searchParams.get('neighborhood') || '')
  const [mapsUrl, setMapsUrl] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const neighborhoods = [
    { name: 'الفيحاء', slug: 'al-fayha' },
    { name: 'السلام', slug: 'al-salam' },
    { name: 'الروابي', slug: 'al-rawabi' },
    { name: 'الربوة', slug: 'al-rabwah' },
    { name: 'الريان', slug: 'al-rayan' },
    { name: 'المنار', slug: 'al-manar' },
    { name: 'السعادة', slug: 'al-saada' },
    { name: 'الصفا', slug: 'al-safa' },
  ]

  async function submit() {
  if (!name || !neighborhood) return
  setLoading(true)

  const res = await fetch('/api/mosque-add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, neighborhoodSlug: neighborhood, mapsUrl }),
  })

  setLoading(false)
  if (res.ok) setSent(true)
}

  if (sent) {
    return (
      <main dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-sm w-full text-center">
          <p className="text-4xl mb-4">✓</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">شكراً!</h2>
          <p className="text-gray-500 mb-6">تم إرسال المسجد للمراجعة</p>
          <Link href="/" className="text-green-600 text-sm">العودة للرئيسية</Link>
        </div>
      </main>
    )
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-12">
        <Link href="/" className="text-green-600 text-sm mb-6 block">→ الرئيسية</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إضافة مسجد</h1>
        <p className="text-gray-500 mb-8">ساهم في إضافة مسجد غير موجود</p>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">اسم المسجد *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="مثال: مسجد النور"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">الحي *</label>
            <select
              value={neighborhood}
              onChange={e => setNeighborhood(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
            >
              <option value="">اختر الحي</option>
              {neighborhoods.map(n => (
                <option key={n.slug} value={n.slug}>{n.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">رابط قوقل ماب (اختياري)</label>
            <input
              type="text"
              value={mapsUrl}
              onChange={e => setMapsUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
            />
          </div>

          <button
            onClick={submit}
            disabled={loading || !name || !neighborhood}
            className="bg-green-600 text-white py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال للمراجعة'}
          </button>
        </div>
      </div>
    </main>
  )
}