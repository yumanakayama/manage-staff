import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { ChatModel } from '@/utils/schemaModels'
import xss from 'xss'

interface Post {
  _id: string;
  name: string;
  comment: string;
  userId: string;
  tenantId: string;
  createdAt?: Date;
}
export async function POST(req: Request) {
  const body: Post = await req.json()

  // commentサニタイズ処理
  const sanitizedBody = {
    name: body.name,
    comment: xss(body.comment),
    userId: body.userId,
    tenantId: body.tenantId,
    createdAt: new Date()
  }

  //空や空白は除外。
  if (sanitizedBody.comment.trim() === '') {
    return NextResponse.json({ message: "未入力項目があります。" }, { status: 400 });
  }

  //2以上必須。
  if (sanitizedBody.comment.length < 2) {
    return NextResponse.json({ message: "コメント内容はは2文字以上で入力してください。" }, { status: 400 })
  }


  try {
    await connectDB()
    await ChatModel.create(sanitizedBody)
    return NextResponse.json({ message: "投稿しました。" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ message: "サーバーエラーが発生しました。" }, { status: 500 })
  }
}