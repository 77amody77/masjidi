'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

type Mosque = {
  id: string
  name: string
  lat: number
  lng: number
}

type Neighborhood = {
  name: string
  slug: string
}

export default function NeighborhoodClient({
  neighborhood,
  mosques,
  slug,
}: {
  neighborhood: Neighborhood
  mosques: Mosque[]
  slug: string
}) {
  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-green-600 text-sm mb-6 block">→ الرئيسية</Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">حي {neighborhood?.name}</h1>
        <Link
          href={'/mosque/add?neighborhood=' + slug}
          className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium mb-6"
        >
          + إضافة مسجد
        </Link>
        <p className="text-gray-500 mb-4">{mosques?.length || 0} مسجد</p>

        {mosques && mosques.length > 0 && (
          <div className="mb-6">
            <Map mosques={mosques.filter(m => m.lat && m.lng)} />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {mosques?.length === 0 && (
            <p className="text-gray-400 text-center py-12">لا توجد مساجد مضافة بعد</p>
          )}
          {mosques?.map((m) => (
            <Link
              key={m.id}
              href={'/mosque/' + m.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all flex justify-between items-center"
            >
              <span className="text-gray-800 font-medium">{m.name}</span>
              <span className="text-gray-400 text-sm">←</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}