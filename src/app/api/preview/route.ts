// src/app/api/preview/route.ts

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // ここで 'MY_SECRET_TOKEN' は、後でSanity側と共有する秘密の文字列です。
  // 本番環境では、環境変数から読み込むようにしてください。
  if (secret !== 'MY_SECRET_TOKEN') {
    return new Response('Invalid token', { status: 401 })
  }

  if (!slug) {
    return new Response('Slug not found', { status: 400 })
  }

  draftMode().enable()

  // プレビューモードが有効になった後、指定されたslugのページにリダイレクトします。
  // slugが `/` の場合はホームページにリダイレクトします。
  redirect(`/post/${slug}`)
}
