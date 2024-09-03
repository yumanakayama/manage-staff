// 自テナント内取引先一覧取得

import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { ClientModel } from '@/utils/schemaModels'

interface ClientData {
  name: string;
  description?: string;
  tenantId: string;
}

export async function POST(req: Request) {
  const body: ClientData = await req.json()
  try {
    await connectDB()

    // 取引先テーブルから検索。
    const clients = await ClientModel.find(
      { tenantId: body.tenantId },
      'name description'  // 指定したカラムのみフロントに渡す。
    )
    return NextResponse.json(clients)
  } catch (error) {
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 })
  }
}