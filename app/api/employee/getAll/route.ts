// 自テナント内一般ユーザー一覧取得

import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { EmployeeModel } from '@/utils/schemaModels'

interface EmployeeData {
  name: string;
  tenantId: string;
}

export async function POST(req: Request) {
  const body: EmployeeData = await req.json()
  try {
    await connectDB()

    // メンバーテーブルから検索。
    const employees = await EmployeeModel.find(
      { tenantId: body.tenantId },
      'name admin' // 指定したカラムのみフロントに渡す。
    )
    return NextResponse.json(employees)
  } catch (error) {
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 })
  }
}