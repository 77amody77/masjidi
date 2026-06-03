'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Props = {
  mosqueId: string
  field: string
  label: string
  value: string | undefined
  type: 'toggle' | 'number'
}

const labels: Record<string, Record<string, string>> = {
  women_section: { yes: 'يوجد', no: 'لا يوجد', unknown: 'غير معروف' },
  friday_prayer: { yes: 'تقام', no: 'لا تقام', unknown: 'غير معروف' },
  eid_prayer: { yes: 'تقام', no: 'لا تقام', unknown: 'غير معروف' },
}

export default function InfoRow({ mosqueId, field, label, value, type }: Props) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value || 'unknown')
  const [sent, setSent] = useState(false)

  async function save() {
    await supabase.from('mosque_info').insert({
      mosque_id: mosqueId,
      field,
      value: val,
      status: 'pending',
    })
    setSent(true)
    setEditing(false)
    setTimeout(() => setSent(false), 3000)
  }

  const display = type === 'toggle'
    ? (labels[field]?.[val] || 'غير معروف')
    : (val && val !== 'unknown' ? val + ' دقيقة' : '—')

  return (
    <div className="border-b border-gray-100 last:border-0">
      <div
        className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
        onClick={() => !editing && setEditing(true)}
      >
        <span className="text-gray-600">{label}</span>
        <div className="flex items-center gap-2">
          {sent && <span className="text-xs text-green-500">تم الإرسال</span>}
          <span className="text-gray-800 font-medium">{display}</span>
          {!editing && <span className="text-gray-300 text-xs">تعديل</span>}
        </div>
      </div>

      {editing && (
        <div className="px-4 pb-4">
          {type === 'toggle' ? (
            <div className="flex gap-2 mb-3">
              {['yes', 'no', 'unknown'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setVal(opt)}
                  className={`px-4 py-2 rounded-full text-sm border transition-all ${
                    val === opt
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {labels[field]?.[opt]}
                </button>
              ))}
            </div>
          ) : (
            <input
              type="number"
              value={val === 'unknown' ? '' : val}
              onChange={e => setVal(e.target.value)}
              placeholder="عدد الدقائق"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-32 mb-3"
            />
          )}
          <div className="flex gap-2">
            <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
              إرسال للمراجعة
            </button>
            <button onClick={() => setEditing(false)} className="text-gray-400 text-sm px-3">
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  )
}