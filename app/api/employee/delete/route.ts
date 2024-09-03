import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { AssignModel, EmployeeModel } from '@/utils/schemaModels'

interface deleteData {
  master: boolean;
  _id: string;
  tenantId: string;
  employeeName: string;
}

export async function DELETE(req: Request) {
  const body: deleteData = await req.json()

  // masterのみ操作できる。
  if (body.master === undefined || body.master === false) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }

  try {
    await connectDB()

    const employee = await EmployeeModel.findOne({ tenantId: body.tenantId })// メンバーテーブルから検索。
    if (employee.tenantId !== body.tenantId) {
      return NextResponse.json({ message: "メンバーが存在しません。" }, { status: 400 })
    }

    const response = await EmployeeModel.deleteOne({ _id: body._id })// employeeテーブルからメンバーを削除する。
    await AssignModel.deleteOne({ employee: body.employeeName })// アサインテーブルからメンバーを削除する。
    if (response.deletedCount > 0) {// deletedCountを指定必須。
      return NextResponse.json({ message: "削除しました。" }, { status: 200 })
    } else {
      return NextResponse.json({ message: "削除に失敗しました。" }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({ message: "削除に失敗しました。" }, { status: 400 })
  }
}