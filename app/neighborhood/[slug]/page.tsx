import { supabase } from '@/lib/supabase'
import NeighborhoodClient from './NeighborhoodClient'

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
    <NeighborhoodClient
      neighborhood={neighborhood}
      mosques={mosques || []}
      slug={slug}
    />
  )
}