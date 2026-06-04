import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { neighborhoodSlug, lat, lng } = await request.json()

  const query = '[out:json][timeout:25];node["amenity"="place_of_worship"]["religion"="muslim"](around:2000,' + lat + ',' + lng + ');out body;'

  let data
  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'masjidi-app/1.0'
      },
      body: 'data=' + encodeURIComponent(query)
    })
    const text = await res.text()
    data = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'Overpass API error' }, { status: 500 })
  }

  const { data: neighborhood } = await supabaseAdmin
    .from('neighborhoods')
    .select('id')
    .eq('slug', neighborhoodSlug)
    .single()

  if (!neighborhood) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  let added = 0
  for (const node of data.elements || []) {
    const name = node.tags?.['name:ar'] || node.tags?.name || 'mosque'
    const mapsUrl = 'https://www.google.com/maps?q=' + node.lat + ',' + node.lon
    const { error } = await supabaseAdmin.from('mosques').insert({
      neighborhood_id: neighborhood.id,
      name,
      lat: node.lat,
      lng: node.lon,
      maps_url: mapsUrl,
      source: 'osm',
      status: 'active',
    })
    if (!error) added++
  }

  return NextResponse.json({ added, total: data.elements?.length || 0 })
}