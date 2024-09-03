import connectDB from '@/utils/database'
import { NextResponse } from 'next/server'
import { TenantModel } from '@/utils/schemaModels'
interface tenantData {
  tenantId: string;
}
export async function POST(req: Request) {
  const body: tenantData = await req.json()

  try {
    await connectDB()
    const tenant = await TenantModel.findOne(
      { tenantId: body.tenantId },
      'name' // 指定したカラムのみフロントに渡す。
    )

    return NextResponse.json(tenant, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "エラーが発生しました。" }, { status: 400 })
  }
}