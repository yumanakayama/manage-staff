'use client'
import SignFormComponent from '@/app/components/form/SignFormComponent'
import authHook from '@/hooks/authHook'
import React from 'react'

const ClientRegister = () => {
  const userAuth = authHook()
  return (
    <>
      <h1 className='formPageH1'>取引先新規登録</h1>
      <p className='center spaceB01'>取引先を新規登録できます。</p>
      <SignFormComponent nameText="取引先名称" buttonText="新規登録" submit="clientRegister" userAuth={userAuth} />
    </>
  )
}

export default ClientRegister