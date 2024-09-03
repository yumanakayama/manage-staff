'use client'
import SignFormComponent from '@/app/components/form/SignFormComponent'
import React, { useEffect, useState } from 'react'
import authHook from '@/hooks/authHook'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/app/components/button/LogoutButton'

interface profileBeforeEditing {
  name: string
  email: string
  password: string
}

const EmployeeEdit = () => {
  const userAuth = authHook()
  const router = useRouter()
  const [profileBeforeEditing, setprofileBeforeEditing] = useState<profileBeforeEditing | undefined>(undefined)

  useEffect(() => {

    const fetchData = async () => {
      // 無駄なリクエストをさける。（複数レンダリングを避ける）
      if (!userAuth._id) {
        return
      }
      try {
        const response = await fetch(`/api/employee/getSingle`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _id: userAuth._id,
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
  }, [userAuth.tenantId])

  return (
    <>
      <h1 className='formPageH1'>プロフィール編集</h1>
      <p className='center spaceB01'>名前、メールアドレス、パスワードが変更できます。</p>
      <SignFormComponent nameText="メンバー氏名" buttonText="更新する" submit="employeeEdit" profileBeforeEditing={profileBeforeEditing} userAuth={userAuth} />
      <div className='center spaceT03'><LogoutButton /></div>
    </>
  )
}

export default EmployeeEdit