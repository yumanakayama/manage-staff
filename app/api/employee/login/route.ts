import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { EmployeeModel } from '@/utils/schemaModels'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'// tokenライブラリ
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
  name: string;
  email: string;
  password: string;
  tenantId: string;
  lastCommentDate: Date;
}

export async function POST(req: Request) {
  const body: tenantLoginData = await req.json()

  // 入力データのエスケープ
  const sanitizedEmail = xss(body.email.trim())
  const sanitizedPassword = xss(body.password.trim())

  try {
    await connectDB()
    const employee = await EmployeeModel.findOne({ email: sanitizedEmail })
    if (employee) {
      const compared = await bcrypt.compare(sanitizedPassword, employee.password)
      if (compared) {// ハッシュ化されたpasswordと入力passwordが一致した場合。

        const secret_key = process.env.TENANT_SECRET_KEY
        if (!secret_key) {
          return NextResponse.json({ message: "TENANT_SECRET_KEY is not defined" }, { status: 500 })
        }

        const payload = {
          _id: employee._id,
          name: employee.name,
          admin: employee.admin,
          tenantId: employee.tenantId,
          lastCommentDate: employee.lastCommentDate,
        }

        // JWT の生成
        const token = await new SignJWT(payload)
          .setProtectedHeader({ alg: 'HS256' }) // アルゴリズムの指定
          .setExpirationTime('72h') // トークンの有効期限
          .sign(new TextEncoder().encode(secret_key)) // 秘密鍵をエンコード

        // CSRF トークンの生成
        const csrfToken = crypto.randomBytes(32).toString('hex')

        // Cookie に JWT と CSRF トークンを設定
        const response = NextResponse.json({ message: "ログインに成功しました。", csrfToken }, { status: 200 })
        response.cookies.set('token', token, COOKIE_OPTIONS)
        response.cookies.set('csrfToken', csrfToken, COOKIE_OPTIONS)

        return response
      } else {
        return NextResponse.json({ message: "ログインに失敗しました。入力内容が正しくないかユーザーが存在しません。" }, { status: 400 })// password
      }
    } else {
      return NextResponse.json({ message: "ログインに失敗しました。入力内容が正しくないかユーザーが存在しません。" }, { status: 400 })// name
    }
  } catch (error) {
    return NextResponse.json({ message: "ログインに失敗しました。入力内容が正しくないかユーザーが存在しません。" }, { status: 400 })// 何かしらのエラー
  }
}