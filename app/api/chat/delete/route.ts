import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { ChatModel } from '@/utils/schemaModels'

interface Post {
  _id: string;
  name: string;
  comment: string;
  userId: string;
  tenantId: string;
  clickedUserId: string;
}

export async function DELETE(req: Request) {
  const body: Post = await req.json()

  // 本人のみ操作できる。（token）
  if (body.userId !== body.clickedUserId) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }//clickedUserIdとは削除ボタンをクリックしたユーザーのtokenの中の_id。userIdとは投稿に含まれるid。

  try {
    await connectDB()

    const chat = await ChatModel.findOne({ tenantId: body.tenantId })// メンバーテーブルから検索。
    if (chat.tenantId !== body.tenantId) {
      return NextResponse.json({ message: "テナントが存在しません。" }, { status: 400 })
    }

    const response = await ChatModel.deleteOne({ _id: body._id })
    if (response.deletedCount > 0) {// deletedCountを指定必須。
      return NextResponse.json({ message: "削除に成功しました。" }, { status: 200 })
    } else {
      return NextResponse.json({ message: "投稿が存在しません。" }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({ message: "削除に失敗しました。" }, { status: 400 })
  }
}