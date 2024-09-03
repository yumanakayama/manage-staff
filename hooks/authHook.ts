// レンダリング時にcookiesからtokenを抽出したらtenantVerifyTokenAPIで検証する。
// okであればこちらのカスタムフックのstateにtokenの状態を格納する。
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface TenantUserData {
  _id: string
  userName: string
  email: string
  password: string
  master: boolean
  admin: boolean
  tenantId: string
}

const authHook = () => {
  const router = useRouter()
  const [tenantUserData, setTenantUserData] = useState<TenantUserData>({
    _id: "",
    userName: "",
    email: "",
    password: "",
    master: false,
    admin: false,
    tenantId: "",
  })

  useEffect(() => {
    const checkToken = async () => {
      try {
        // サーバーサイドにトークンの検証を依頼
        const response = await fetch('/api/verifyToken/verifyToken', {
          method: 'GET',
          credentials: 'include', // Cookieを含める
        })

        if (!response.ok) {
          // サーバーでの検証に失敗。または一致しない。
          // alert("セッションが無効になりました。")
          router.push("/")
        }

        const data = await response.json()

        // データの存在を確認してからtokenの情報をステートに格納。
        if (data && typeof data === 'object') {
          setTenantUserData({
            _id: data._id || "",
            userName: data.name || "",
            email: data.email || "",
            password: data.password || "",
            master: Boolean(data.master),
            admin: Boolean(data.admin),
            tenantId: data.tenantId || "",
          })
          console.log(tenantUserData)
        } else {
          router.push("/")
        }
      } catch (error) {
        // alert("セッションの有効期限が無効です。")
        router.push("/")
      }
    }

    checkToken()
  }, [])

  return tenantUserData
}

export default authHook
