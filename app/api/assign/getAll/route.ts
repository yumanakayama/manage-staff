// 自テナント内取引先一覧取得

import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { AssignModel } from '@/utils/schemaModels'

interface Assign {
  tenantId: string;
}

export async function POST(req: Request) {
  const body: Assign = await req.json()
  try {
    await connectDB()

    // 取引先テーブルから検索。
    const clients = await AssignModel.find(
      { tenantId: body.tenantId },
      '-tenantId'  // 「-tenantId」でフィールドを除外。
    )
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 })
  }
}