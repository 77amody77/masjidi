import { supabaseAdmin } from '@/lib/supabase'

export default async function AdminPage() {
  const { data: pendingInfo } = await supabaseAdmin
    .from('mosque_info')
    .select('*, mosques(name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  const fields: Record<string, string> = {
    women_section: 'مصلى نساء',
    friday_prayer: 'صلاة الجمعة',
    eid_prayer: 'صلاة العيد',
    minutes_fajr: 'إقامة الفجر',
    minutes_dhuhr: 'إقامة الظهر',
    minutes_asr: 'إقامة العصر',
    minutes_maghrib: 'إقامة المغرب',
    minutes_isha: 'إقامة العشاء',
  }

  const values: Record<string, string> = {
    yes: 'يوجد / تقام',
    no: 'لا يوجد / لا تقام',
    unknown: 'غير معروف',
  }

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">لوحة الأدمن</h1>
        <p className="text-gray-500 mb-8">{pendingInfo?.length || 0} مساهمة تنتظر المراجعة</p>
        <div className="flex flex-col gap-3">
          {pendingInfo?.length === 0 && (
            <p className="text-gray-400 text-center py-12">لا توجد مساهمات بعد</p>
          )}
          {pendingInfo?.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900">{item.mosques?.name}</p>
                  <p className="text-sm text-gray-500">{fields[item.field] || item.field}: {values[item.value] || item.value}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('ar')}</span>
              </div>
              <div className="flex gap-2">
                <form action={'/api/admin/approve/' + item.id} method="POST">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">موافقة</button>
                </form>
                <form action={'/api/admin/reject/' + item.id} method="POST">
                  <button className="bg-red-50 text-red-500 border border-red-100 px-4 py-2 rounded-lg text-sm">رفض</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}