import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name, neighborhoodSlug, mapsUrl } = await request.json()

  const { data: neighborhood } = await supabaseAdmin
    .from('neighborhoods')
    .select('id')
    .eq('slug', neighborhoodSlug)
    .single()

  if (!neighborhood) {
    return NextResponse.json({ error: 'الحي غير موجود' }, { status: 404 })
  }

  const { error } = await supabaseAdmin
    .from('mosques')
    .insert({
      neighborhood_id: neighborhood.id,
      name,
      maps_url: mapsUrl || null,
      source: 'manual',
      status: 'pending',
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}