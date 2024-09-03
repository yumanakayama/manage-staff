import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { AssignModel } from '@/utils/schemaModels'

interface Assign {
  _id: string;
  admin: boolean;
  tenantId: string;
}

export async function DELETE(req: Request) {
  const body: Assign = await req.json()

  // 管理者のみ操作できる。（token）
  if (body.admin !== true) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }

  try {
    await connectDB()

    const assign = await AssignModel.findOne({ tenantId: body.tenantId })// メンバーテーブルから検索。
    if (assign.tenantId !== body.tenantId) {
      return NextResponse.json({ message: "テナントが存在しません。" }, { status: 400 })
    }

    const response = await AssignModel.deleteOne({ _id: body._id })
    if (response.deletedCount > 0) {// deletedCountを指定必須。
      return NextResponse.json({ message: "削除に成功しました。" }, { status: 200 })
    } else {
      return NextResponse.json({ message: "投稿が存在しません。" }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({ message: "削除に失敗しました。" }, { status: 400 })
  }
}