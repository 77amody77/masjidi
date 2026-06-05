'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

type Mosque = {
  id: string
  name: string
  lat: number
  lng: number
}

export default function Map({ mosques }: { mosques: Mosque[] }) {
  const center = mosques.length > 0
    ? [mosques[0].lat, mosques[0].lng] as [number, number]
    : [24.6877, 46.7219] as [number, number]

  return (
    <MapContainer
      center={center}
      zoom={14}
      style={{ height: '400px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      {mosques.map(m => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={icon}>
          <Popup>{m.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}