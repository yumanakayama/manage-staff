// 自テナント内コメント一覧取得

import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { ChatModel } from '@/utils/schemaModels'

interface Post {
  _id: string;
  name: string;
  comment: string;
  userId: string;
  tenantId: string;
  createdAt: Date;
}

export async function POST(req: Request) {
  const body: Post = await req.json()
  try {
    await connectDB()

    // メンバーテーブルから検索。
    const Chats = await ChatModel.find(
      { tenantId: body.tenantId },
      'name comment userId  createdAt' // 指定したカラムのみフロントに渡す。
    )
    return NextResponse.json(Chats)
  } catch (error) {
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 })
  }
}