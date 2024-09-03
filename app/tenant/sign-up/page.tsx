import SignFormComponent from '@/app/components/form/SignFormComponent'
import React from 'react'

const TenantSignUp = () => {
  return (
    <>
      <h1 className='formPageH1'>テナント新規登録</h1>
      <SignFormComponent nameText="企業名（ユーザー名）" buttonText="新規登録" submit="tenantSignUp" />
    </>
  )
}

export default TenantSignUp