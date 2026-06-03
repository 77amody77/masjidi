import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default async function Home() {
  const { data: neighborhoods } = await supabase
    .from('neighborhoods')
    .select('*')
    .order('name')

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">مساجد الرياض</h1>
        <p className="text-gray-700 text-lg mb-8">اختر الحي للعثور على المساجد القريبة منك</p>
        <div className="grid grid-cols-2 gap-3">
          {neighborhoods?.map((n) => (
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