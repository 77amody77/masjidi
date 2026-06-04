import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await supabaseAdmin.from('mosques').update({ status: 'rejected' }).eq('id', id)
  return NextResponse.redirect(new URL('/admin', request.url))
}