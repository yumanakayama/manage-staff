// api/tenant/logout/route.ts

import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const response = NextResponse.json({ message: "ログアウトに成功しました。" }, { status: 200 })

  // JWTとCSRFトークンを削除するために、有効期限を過去に設定します
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),  // クッキーの有効期限を過去に設定して削除
  })

  response.cookies.set('csrfToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),  // CSRFトークンのクッキーも削除
  })

  return response
}