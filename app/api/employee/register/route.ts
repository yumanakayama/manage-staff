import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { EmployeeModel, TenantModel } from '@/utils/schemaModels'
import bcrypt from 'bcryptjs'
import xss from 'xss'

export async function POST(req: Request) {
  const body = await req.json()

  // masterのみ操作できる。
  if (body.master === undefined || body.master === false) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }

  // name,emailサニタイズ処理
  const sanitizedBody = {
    name: xss(body.name),
    email: xss(body.email),
    password: body.password,
    tenantId: body.tenantId,
  }

  //空や空白は除外。
  if (sanitizedBody.name.trim() === '' || sanitizedBody.email.trim() === '' || sanitizedBody.password.trim() === '') {
    return NextResponse.json({ message: "未入力項目があります。" }, { status: 400 });
  }

  //2、5、8　以上必須。

  if (sanitizedBody.name.length < 2 || sanitizedBody.name.length > 20) {
    return NextResponse.json({ message: "名前は2文字以上、20文字以内で入力してください。" }, { status: 400 })
  }
  if (sanitizedBody.email.length < 5 || sanitizedBody.email.length > 50) {
    return NextResponse.json({ message: "メールアドレスは5文字以上、50文字以内で入力してください。" }, { status: 400 })
  }
  if (sanitizedBody.password.length < 8 || sanitizedBody.password.length > 100) {
    return NextResponse.json({ message: "パスワードは8文字以上、100文字以内で入力してください。" }, { status: 400 })
  }

  // メールアドレス形式のチェック。
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedBody.email)) {
    return NextResponse.json({ message: "無効なメールアドレス形式です。" }, { status: 400 })
  }

  try {
    const hashedPassword = await bcrypt.hash(sanitizedBody.password, 10)
    sanitizedBody.password = hashedPassword

    await connectDB()

    //新規登録時に入力されたemailがtenantにすでに存在する場合は登録できないようにする。
    const tenant = await TenantModel.findOne({ email: sanitizedBody.email })
    if (tenant) {
      return NextResponse.json({ message: `このメールアドレスは既に登録されています。` }, { status: 400 })
    }

    await EmployeeModel.create(sanitizedBody)
    return NextResponse.json({ message: "新規登録しました。" }, { status: 200 })
  } catch (error: any) {
    if (error.code === 11000) { // connectDBの重複エラー
      console.log(error)
      return NextResponse.json({ message: `このメールアドレスは既に登録されています。` }, { status: 400 })
    }
    return NextResponse.json({ message: "サーバーエラーが発生しました。" }, { status: 500 })
  }
}