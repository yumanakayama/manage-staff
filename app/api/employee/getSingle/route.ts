// 自テナント内一般ユーザー単体取得

import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { EmployeeModel } from '@/utils/schemaModels'

interface EmployeeData {
  _id: string;
  name: string;
  email: string;
  password: string;
  admin: boolean;
  tenantId: string;
}

export async function POST(req: Request) {
  const body: EmployeeData = await req.json()
  try {
    await connectDB()

    // メンバーテーブルから検索。
    const employees = await EmployeeModel.findOne({ _id: body._id })
    return NextResponse.json(employees)
  } catch (error) {
    return NextResponse.json({ message: 'サーバーエラーが発生しました。' }, { status: 500 })
  }
}