// tokenの所在を確認してリダイレクト操作を行う。

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

interface AuthData {
  _id: string
  name: string
  email: string
  password: string
  admin: boolean
  master: string
  tenantId: string

}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // トップページ、テナント新規登録、ページログインページ以外が対象の処理。下記URL 以外のパスに対して認証チェックを行う。
  if (pathname !== '/' && pathname !== '/tenant/sign-up' && pathname !== '/tenant/login' && pathname !== '/employee/login') {
    // トークンがない場合、ログインページにリダイレクト。
    if (!token) {
      const url = new URL('/', request.url)
      // url.searchParams.set('message', 'セッションの有効期限が切れました')
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/tenant-page') {
    if (!token) {
      const url = new URL('/', request.url)
      // url.searchParams.set('message', 'セッションの有効期限が切れました')
      return NextResponse.redirect(url)
    }
  }

  try {
    const secret_key = process.env.TENANT_SECRET_KEY

    if (token) {
      const { payload }: { payload: AuthData } = await jwtVerify(token, new TextEncoder().encode(secret_key))

      // // ログイン済みユーザーは新規テナント登録できないようにするページに訪れた場合はリダイレクトする。
      // if (pathname === '/tenant/sign-up') {
      //   return NextResponse.redirect(new URL('/tenant-page', request.url))
      // }

      // adminがtrueではない者が配属先登録ページに訪れた場合はリダイレクトする。
      if (pathname === '/tenant-page/assignment') {
        if (payload.admin !== true) {
          return NextResponse.redirect(new URL('/tenant-page', request.url))
        }
      }

      // tenantIdがないものがテナントページに訪れた場合リダイレクトする。
      if (pathname === '/tenant-page') {
        if (!payload.tenantId) {
          return NextResponse.redirect(new URL('/', request.url))
        }
      }

      // テナントログイン後にログインページに訪れられないようにする。
      if (pathname === '/') {
        if (payload.tenantId) {
          return NextResponse.redirect(new URL('/tenant-page', request.url))
        }
      }

      // テナントログイン後にログインページに訪れられないようにする。
      if (pathname === '/tenant/login') {
        if (payload.tenantId) {
          return NextResponse.redirect(new URL('/tenant-page', request.url))
        }
      }

      // 一般ユーザーログイン後にログインページに訪れられないようにする。
      if (pathname === '/employee/login') {
        if (payload.tenantId) {
          return NextResponse.redirect(new URL('/tenant-page', request.url))
        }
      }

      // masterがないものがテナント編集ページに訪れた場合リダイレクトする。
      if (pathname === '/tenant/edit') {
        if (!payload.master) {
          return NextResponse.redirect(new URL('/tenant-page', request.url))
        }
      }

      // masterがないものがメンバー登録ページに訪れた場合リダイレクトする。
      if (pathname === '/employee/sign-up') {
        if (!payload.master) {
          return NextResponse.redirect(new URL('/tenant-page', request.url))
        }
      }

      // SSRでtokenのtenantId抽出。自tenantIdと一致した情報を取得（カスタムフックでは取り出さずにmiddlewareを使用する。）
      if (payload.tenantId) {
        // console.log(payload.tenantId)
        // console.log(payload.master)
        // console.log(payload.admin)
        // console.log(payload.name)
        const response = NextResponse.next()
        response.headers.set('X-Tenant-ID', payload.tenantId)// SSRでtenantIdを識別するときに使用する。
        response.headers.set('X-Master', payload.master)
        response.headers.set('X-Id', payload._id)
        response.headers.set('X-Admin', payload.admin as any)
        response.headers.set('X-Pathname', pathname)
        // 名前をエスケープシーケンスに変換
        const nameEscaped = encodeURIComponent(payload.name);
        response.headers.set('X-Name', nameEscaped);
        return response
      }
    }

    // 認証と権限チェックが通過した場合、リクエストを続行
    return NextResponse.next()
  } catch (error) {
    // トークンが無効な場合はログインページへリダイレクト
    console.error(error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Middlewareを適用するパスを指定
export const config = {
  matcher: [
    '/',
    '/employee/sign-up',
    '/tenant/sign-up',
    '/tenant/edit',
    '/tenant-page',
    '/tenant/login',
    '/employee/login',
    '/employee/edit',
    '/tenant-page/employee-lists',
    '/tenant-page/client-lists',
    '/tenant-page/client-register',
    '/tenant-page/chat',
    '/tenant-page/assignment',
  ]
}