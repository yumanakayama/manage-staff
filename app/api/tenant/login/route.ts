import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { TenantModel } from '@/utils/schemaModels'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import xss from 'xss'
import crypto from 'crypto'

// クッキーに保存するためのオプション
const COOKIE_OPTIONS = {
  httpOnly: true,  // JavaScript からアクセスできない
  secure: process.env.NODE_ENV === 'production',  // HTTPS のみで送信
  sameSite: 'strict' as const,  // クロスサイトリクエストの制限
  maxAge: 60 * 60 * 24 * 7,  // 1週間
}

interface tenantLoginData {
  _id: string;
  email: string;
  password: string;
  lastCommentDate: Date;
}

export async function POST(req: Request) {
  const body: tenantLoginData = await req.json()

  // 入力データのエスケープ
  const sanitizedEmail = xss(body.email.trim())
  const sanitizedPassword = xss(body.password.trim())

  try {
    await connectDB()
    const tenant = await TenantModel.findOne({ email: sanitizedEmail })
    if (tenant) {
      const compared = await bcrypt.compare(sanitizedPassword, tenant.password)
      if (compared) {
        const secret_key = process.env.TENANT_SECRET_KEY
        if (!secret_key) {
          return NextResponse.json({ message: "TENANT_SECRET_KEY is not defined" }, { status: 500 })
        }

        const payload = {
          _id: tenant._id,
          name: tenant.name,
          admin: tenant.admin,
          master: tenant.master,
          tenantId: tenant.tenantId,
          lastCommentDate: tenant.lastCommentDate
        }

        // JWT の生成
        const token = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' })
          .setExpirationTime('72h')
          .sign(new TextEncoder().encode(secret_key))

        // CSRF トークンの生成
        const csrfToken = crypto.randomBytes(32).toString('hex')

        // Cookie に JWT と CSRF トークンを設定
        const response = NextResponse.json({ message: "ログインに成功しました。", csrfToken }, { status: 200 })
        response.cookies.set('token', token, COOKIE_OPTIONS)
        response.cookies.set('csrfToken', csrfToken, COOKIE_OPTIONS)

        return response
      } else {
        return NextResponse.json({ message: "ログインに失敗しました。入力内容が正しくないかユーザーが存在しません。" }, { status: 400 })
      }
    } else {
      return NextResponse.json({ message: "ログインに失敗しました。入力内容が正しくないかユーザーが存在しません。" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ message: "ログインに失敗しました。入力内容が正しくないかユーザーが存在しません。" }, { status: 400 })
  }
}
