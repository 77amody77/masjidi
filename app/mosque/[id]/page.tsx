import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import InfoRow from './InfoRow'

export default async function MosquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: mosque } = await supabase
    .from('mosques')
    .select('*, neighborhoods(name, slug)')
    .eq('id', id)
    .single()

  const { data: info } = await supabase
    .from('mosque_info')
    .select('*')
    .eq('mosque_id', id)
    .eq('status', 'active')

  const getInfo = (field: string) => info?.find(i => i.field === field)?.value

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href={'/neighborhood/' + mosque?.neighborhoods?.slug} className="text-green-600 text-sm mb-6 block">
          رجوع
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">{mosque?.name}</h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-500">معلومات المسجد</span>
          </div>
          <div>
            <InfoRow mosqueId={id} field="women_section" label="مصلى نساء" value={getInfo('women_section')} type="toggle" />
            <InfoRow mosqueId={id} field="friday_prayer" label="صلاة الجمعة" value={getInfo('friday_prayer')} type="toggle" />
            <InfoRow mosqueId={id} field="eid_prayer" label="صلاة العيد" value={getInfo('eid_prayer')} type="toggle" />
            <InfoRow mosqueId={id} field="minutes_fajr" label="إقامة الفجر" value={getInfo('minutes_fajr')} type="number" />
            <InfoRow mosqueId={id} field="minutes_dhuhr" label="إقامة الظهر" value={getInfo('minutes_dhuhr')} type="number" />
            <InfoRow mosqueId={id} field="minutes_asr" label="إقامة العصر" value={getInfo('minutes_asr')} type="number" />
            <InfoRow mosqueId={id} field="minutes_maghrib" label="إقامة المغرب" value={getInfo('minutes_maghrib')} type="number" />
            <InfoRow mosqueId={id} field="minutes_isha" label="إقامة العشاء" value={getInfo('minutes_isha')} type="number" />
          </div>
        </div>

        {mosque?.maps_url && (
          <a href={mosque.maps_url} target="_blank" rel="noreferrer" className="block w-full text-center bg-green-600 text-white py-3 rounded-xl font-medium">
            فتح في قوقل ماب
          </a>
        )}
      </div>
    </main>
  )
}