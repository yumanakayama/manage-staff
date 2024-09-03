import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { AssignModel } from '@/utils/schemaModels'
import xss from 'xss'

export async function POST(req: Request) {
  const body = await req.json()

  // admin:trueのみ操作できる。
  if (body.admin !== true) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }

  // サニタイズ処理
  const sanitizedBody = {
    tenantId: body.tenantId,
    employee: xss(body.employee),
    client: xss(body.client),
    description: xss(body.description),
    since: xss(body.since),
    until: xss(body.until),
  }

  //200文字以下必須。
  if (sanitizedBody.description.length > 100) {
    return NextResponse.json({ message: "補足事項は100文字以内で入力してください。" }, { status: 400 })
  }

  try {
    await connectDB()
    await AssignModel.create(sanitizedBody)
    return NextResponse.json({ message: "新規登録しました。" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: "サーバーエラーが発生しました。" }, { status: 500 })
  }
}