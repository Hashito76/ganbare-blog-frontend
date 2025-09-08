// src/app/api/exit-preview/route.ts

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  draftMode().disable()
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  redirect(`/post/${slug}`)
}
