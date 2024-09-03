import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { AssignModel, ChatModel, ClientModel, EmployeeModel, TenantModel } from '@/utils/schemaModels'
import bcrypt from 'bcryptjs';
import xss from 'xss'

interface tenantData {
  tenantId: string;
  password: string;
  master: boolean;
}

export async function DELETE(req: Request) {
  const body: tenantData = await req.json()

  // masterのみ操作できる。
  if (body.master === undefined || body.master === false) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }

  try {
    await connectDB()

    // パスワード確認。
    const sanitizedPassword = xss(body.password.trim())// サニタイズ。
    const tenant = await TenantModel.findOne({ tenantId: body.tenantId }) as tenantData// DBから企業情報を取得。
    if (!tenant) {
      return NextResponse.json({ message: "テナントが存在しません。" }, { status: 400 })
    }
    const compared = await bcrypt.compare(sanitizedPassword, tenant.password)// (インプットの値, DB内の情報)
    if (!compared) {
      return NextResponse.json({ message: "パスワードが一致しませんでした。" }, { status: 400 })
    }

    // パスワード確認後デリート。
    const tenantResponse = await TenantModel.deleteOne({ tenantId: body.tenantId })
    // 関連データも削除する。
    if (tenantResponse.deletedCount > 0) {// deletedCountを指定必須。
      const employeeResponse = await EmployeeModel.deleteMany({ tenantId: body.tenantId })// employee内の関連データもすべて削除。
      const clientResponse = await ClientModel.deleteMany({ tenantId: body.tenantId })// client内の関連データもすべて削除。
      const chatResponse = await ChatModel.deleteMany({ tenantId: body.tenantId })// chat内の関連データもすべて削除。
      const assignResponse = await AssignModel.deleteMany({ tenantId: body.tenantId })// assign内の関連データもすべて削除。

      return NextResponse.json({ message: "削除しました。" }, { status: 200 })
    } else {
      return NextResponse.json({ message: "削除に失敗しました。" }, { status: 400 })
    }

  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "削除に失敗しました。" }, { status: 400 })
  }
}