import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../../components/Map'), { ssr: false })

export default async function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: neighborhood } = await supabase
    .from('neighborhoods')
    .select('*')
    .eq('slug', slug)
    .single()

  const { data: mosques } = await supabase
    .from('mosques')
    .select('*')
    .eq('neighborhood_id', neighborhood?.id)
    .eq('status', 'active')

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
        <p className="text-gray-500 mb-8">{mosques?.length || 0} مسجد</p>
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
              href={`/mosque/${m.id}`}
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