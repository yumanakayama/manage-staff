import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { ClientModel } from '@/utils/schemaModels'
import xss from 'xss'

export async function POST(req: Request) {
  const body = await req.json()

  // masterのみ操作できる。
  if (body.master === undefined || body.master === false) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }

  // name,descriptionサニタイズ処理
  const sanitizedBody = {
    name: xss(body.name),
    description: xss(body.description),
    tenantId: body.tenantId,
  }

  //空や空白は除外。
  if (sanitizedBody.name.trim() === '') {
    return NextResponse.json({ message: "未入力項目があります。" }, { status: 400 });
  }

  //2、8　以上必須。

  if (sanitizedBody.name.length < 2 || sanitizedBody.name.length > 20) {
    return NextResponse.json({ message: "名前は2文字以上、20文字以内で入力してください。" }, { status: 400 })
  }
  if (sanitizedBody.description.length > 100) {
    return NextResponse.json({ message: "補足事項は100文字以内で入力してください。" }, { status: 400 })
  }

  try {
    await connectDB()
    await ClientModel.create(sanitizedBody)
    return NextResponse.json({ message: "新規登録しました。" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: "サーバーエラーが発生しました。" }, { status: 500 })
  }
}