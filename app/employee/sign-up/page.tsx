'use client'
import SignFormComponent from '@/app/components/form/SignFormComponent'
import authHook from '@/hooks/authHook'
import React from 'react'

const EmployeeSignUp = () => {
  const userAuth = authHook()
  return (
    <>
      <h1 className='formPageH1'>メンバー新規登録</h1>
      <p className='center spaceB01'>メンバーを新規登録できます。</p>
      <SignFormComponent nameText="メンバー氏名" buttonText="新規登録" submit="employeeSignUp" userAuth={userAuth} />
    </>
  )
}

export default EmployeeSignUp