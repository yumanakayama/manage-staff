'use client'
import SignFormComponent from '@/app/components/form/SignFormComponent'
import React, { useEffect, useState } from 'react'
import authHook from '@/hooks/authHook'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/app/components/button/LogoutButton'
import AccountDeleteButton from '@/app/components/button/AccountDeleteButton'
interface profileBeforeEditing {
  name: string
  email: string
  password: string
}

const TenantEdit = () => {
  const userAuth = authHook()
  const router = useRouter()
  const [profileBeforeEditing, setprofileBeforeEditing] = useState<profileBeforeEditing | undefined>(undefined)

  useEffect(() => {
    // 複数レンダリングを避ける。
    if (!userAuth.master || !userAuth.tenantId) {
      return
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tenant/get`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            master: userAuth.master,
            tenantId: userAuth.tenantId,
          }),
        })
        const data = await response.json()
        setprofileBeforeEditing(data)
      } catch (error) {
        alert("エラーが発生しました。")
        router.push("/")
      }
    }
    fetchData()
  }, [userAuth.master, userAuth.tenantId])

  return (
    <>
      <h1 className='formPageH1'>プロフィール編集</h1>
      <p className='center spaceB01'>名前、メールアドレス、パスワードが編集可能です。</p>
      <SignFormComponent nameText="企業名（ユーザー名）" buttonText="更新する" submit="tenantEdit" profileBeforeEditing={profileBeforeEditing} userAuth={userAuth} />
      <div className='center spaceT03'><LogoutButton /></div>
      <div className='center spaceT01'><AccountDeleteButton /></div>
    </>
  )
}

export default TenantEdit