import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { EmployeeModel, TenantModel } from '@/utils/schemaModels'
interface tenantData {
  tenantId: string;
  master: boolean;
}
export async function POST(req: Request) {
  const body: tenantData = await req.json()
  // masterのみ操作できる。
  if (body.master === undefined || body.master === false) {
    return NextResponse.json({ message: "権限がありません。" }, { status: 400 })
  }

  try {
    await connectDB()
    const tenant = await TenantModel.findOne({ tenantId: body.tenantId })
    return NextResponse.json(tenant, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "エラーが発生しました。" }, { status: 400 })
  }
}