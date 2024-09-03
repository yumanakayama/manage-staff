import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { EmployeeModel, TenantModel } from '@/utils/schemaModels'
import bcrypt from 'bcryptjs'
import xss from 'xss'

interface employeeData {
  _id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  tenantId: string;
  lastCommentDate: Date;
}

export async function PUT(req: Request) {
  const body: employeeData = await req.json()


  // 最新コメント更新リクエスト。(チャットページのみリクエスト)
  if (!body.name || !body.email || !body.password) {
    if (body.lastCommentDate) {
      try {
        await connectDB()
        // 2024.08.27新規追加。最新コメントの日付を更新する。
        const res = await EmployeeModel.updateOne({ _id: body._id }, { $set: { lastCommentDate: body.lastCommentDate } })

        return NextResponse.json({ message: "日付を更新しました。" }, { status: 200 }) // チャットページの処理はここで終了
      } catch (error: any) {
        console.error("日付の更新に失敗しました。")
      }
    }
  }




  // サニタイズ処理
  const sanitizedBody = {
    name: xss(body.name),
    email: xss(body.email),
    password: body.password,
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

    // テナントが存在するかどうか検証する。
    const employee = await EmployeeModel.findOne({ tenantId: body.tenantId }) as employeeData
    if (!employee) {
      return NextResponse.json({ message: "テナントが存在しません。" }, { status: 400 })
    }

    //編集時に入力されたemailがtenantテーブルに存在する場合は登録できないようにする。
    const tenant = await TenantModel.findOne({ email: sanitizedBody.email })
    if (tenant) {
      return NextResponse.json({ message: `このメールアドレスは既に登録されています。` }, { status: 400 })
    }

    await EmployeeModel.updateOne({ _id: body._id }, sanitizedBody)// updateOne({インプットで渡ってきた値とDB内の値が一致したら}, {渡ってきた値をサニタイズしてアップデート})
    return NextResponse.json({ message: "編集しました。" }, { status: 200 })
  } catch (error: any) {
    if (error.code === 11000) { // connectDBの重複エラー
      return NextResponse.json({ message: `このメールアドレスは既に登録されています。` }, { status: 400 })
    }
    return NextResponse.json({ message: "編集に失敗しました。" }, { status: 500 })
  }
}