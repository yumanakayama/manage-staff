import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { EmployeeModel } from '@/utils/schemaModels'

interface bodyData {
  _id: string;
  master: boolean;
  admin: boolean;
  tenantId: string;
}

interface updateData {
  tenantId: string;
}

export async function PUT(req: Request) {
  const body: bodyData = await req.json()

  // masterのみ操作できる。
  if (body.master === undefined || body.master === false) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }

  try {
    await connectDB()

    const employee = await EmployeeModel.findOne({ tenantId: body.tenantId }) as updateData// メンバーテーブルから検索。

    // tenantIdが一致しない。
    if (!employee) {
      return NextResponse.json({ message: "エラーが発生しました。" }, { status: 400 })
    }

    const employeeUpdate = await EmployeeModel.updateOne({ _id: body._id }, body)

    // 更新しようとしたがメンバーが存在しない。
    if (employeeUpdate.matchedCount !== 1) {
      return NextResponse.json({ message: "メンバーが存在しません。" }, { status: 400 })
    }

    return NextResponse.json({ message: "権限が変更されました。" }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "権限の変更に失敗しました。" }, { status: 400 })
  }
}