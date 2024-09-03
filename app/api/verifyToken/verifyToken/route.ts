import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
interface Payload {
  _id?: string;// メンバー用オプション
  name: string;
  admin: boolean;
  tenantId: string;
  master?: boolean;
  email?: string; // オプションプロパティ
  password?: string; // オプションプロパティ
}
export async function GET(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ message: 'No token provided' }, { status: 401 })
  }

  try {
    const secret_key = process.env.TENANT_SECRET_KEY

    if (!secret_key) {
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 })
    }

    const { payload }: { payload: Payload } = await jwtVerify(token, new TextEncoder().encode(secret_key))

    // バリデーションチェック用変数。
    const isInvalidPayload = typeof payload.name !== 'string' || typeof payload.admin !== 'boolean' || typeof payload.tenantId !== 'string';

    // テナント用。ペイロードの型チェック
    if (payload.master) {
      if (payload.email && payload.password) {// テナント編集ページ用。
        if (typeof payload.email !== 'string' || typeof payload.password !== 'string' || typeof payload.master !== 'boolean' || isInvalidPayload) {
          throw new Error('Invalid token payload')
        }
      }
      if (typeof payload.master !== 'boolean' || isInvalidPayload) { throw new Error('Invalid token payload') }// 全ページチェック必須

      // 共通レスポンスオブジェクト
      const tenantResponsePayload: Payload = {
        _id: payload._id,
        name: payload.name,
        admin: payload.admin,
        master: payload.master,
        tenantId: payload.tenantId
      }

      // email と password が存在する場合は、共通レスポンスオブジェクトに追加
      if (payload.email && payload.password) {
        tenantResponsePayload.email = payload.email
        tenantResponsePayload.password = payload.password
      }

      // JSON レスポンスを返す
      return NextResponse.json(tenantResponsePayload)
    }

    // テナント以外。ペイロードの型チェック
    if (!payload.master) {
      if (payload.email && payload.password) {// プロフィール編集ページ用。
        if (typeof payload._id !== 'string' || typeof payload.email !== 'string' || typeof payload.password !== 'string' || isInvalidPayload) {
          throw new Error('Invalid token payload')
        }
      }
      if (isInvalidPayload) { throw new Error('Invalid token payload') }// 全ページチェック必須

      // 共通レスポンスオブジェクト
      const tenantResponsePayload: Payload = {
        _id: payload._id,
        name: payload.name,
        admin: payload.admin,
        tenantId: payload.tenantId
      }

      // email と password が存在する場合は、共通レスポンスオブジェクトに追加
      if (payload.email && payload.password) {
        tenantResponsePayload.email = payload.email
        tenantResponsePayload.password = payload.password
      }

      // JSON レスポンスを返す
      return NextResponse.json(tenantResponsePayload)
    }

  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}