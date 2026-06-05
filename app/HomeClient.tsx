'use client'

import { useState } from 'react'
import Link from 'next/link'

type Neighborhood = {
  id: string
  name: string
  slug: string
}

export default function HomeClient({ neighborhoods }: { neighborhoods: Neighborhood[] }) {
  const [query, setQuery] = useState('')

  const filtered = neighborhoods.filter(n =>
    n.name.includes(query.trim())
  )

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">مساجد الرياض</h1>
        <p className="text-gray-700 text-lg mb-6">اختر الحي للعثور على المساجد القريبة منك</p>

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث عن حي..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-6 bg-white shadow-sm focus:outline-none focus:border-green-400"
        />

        <div className="grid grid-cols-2 gap-3">
          {filtered.length === 0 && (
            <p className="text-gray-400 col-span-2 text-center py-8">لا توجد نتائج</p>
          )}
          {filtered.map((n) => (
            <Link
              key={n.id}
              href={`/neighborhood/${n.slug}`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
            >
              <span className="text-gray-800 font-medium">{n.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
