import { supabase } from '@/lib/supabase'
import HomeClient from './HomeClient'

export default async function Home() {
  const { data: neighborhoods } = await supabase
    .from('neighborhoods')
    .select('*')
    .order('name')

  return <HomeClient neighborhoods={neighborhoods || []} />
}