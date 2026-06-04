const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://fbgaajtpdyccvbzpnbji.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZ2FhanRwZHljY3ZienBuYmppIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQ1MDkyMCwiZXhwIjoyMDk0MDI2OTIwfQ.XQRWhiYt1ADsYwQGhfF1b2WL_bbdpq9G1xfQqMYjNuQ'
)

const neighborhoods = [
  { slug: 'al-rawabi', lat: 24.7089, lng: 46.7234 },
  { slug: 'al-rabwah', lat: 24.7012, lng: 46.6891 },
  { slug: 'al-rayan', lat: 24.7156, lng: 46.7312 },
  { slug: 'al-manar', lat: 24.6823, lng: 46.7445 },
  { slug: 'al-saada', lat: 24.6756, lng: 46.7123 },
  { slug: 'al-safa', lat: 24.6934, lng: 46.7389 },
]

async function fetchMosques(lat, lng) {
  const query = '[out:json][timeout:30];node["amenity"="place_of_worship"]["religion"="muslim"](around:2000,' + lat + ',' + lng + ');out body;'
  
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'masjidi-riyadh/1.0 (contact@masjidi.app)'
    },
    body: 'data=' + encodeURIComponent(query)
  })
  
  const text = await res.text()
  const data = JSON.parse(text)
  return data.elements || []
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function main() {
  for (const n of neighborhoods) {
    console.log('جلب مساجد:', n.slug)
    
    const { data: neighborhood } = await supabase
      .from('neighborhoods')
      .select('id')
      .eq('slug', n.slug)
      .single()
    
    if (!neighborhood) {
      console.log('الحي غير موجود:', n.slug)
      continue
    }
    
    const mosques = await fetchMosques(n.lat, n.lng)
    console.log('وجد', mosques.length, 'مسجد')
    
    let added = 0
    for (const m of mosques) {
      const name = m.tags?.['name:ar'] || m.tags?.name || 'مسجد'
      const { error } = await supabase.from('mosques').insert({
        neighborhood_id: neighborhood.id,
        name,
        lat: m.lat,
        lng: m.lon,
        maps_url: 'https://www.google.com/maps?q=' + m.lat + ',' + m.lon,
        source: 'osm',
        status: 'active',
      })
      if (!error) added++
    }
    
    console.log('أضاف', added, 'مسجد لـ', n.slug)
    await sleep(8000)
  }
  
  console.log('اكتمل!')
}

main().catch(console.error)