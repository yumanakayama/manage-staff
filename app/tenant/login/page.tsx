import SignFormComponent from '@/app/components/form/SignFormComponent'
import React from 'react'

const TenantLogin = () => {
  return (
    <>
      <h1 className='formPageH1'>テナントログイン</h1>
      <div className="inner">
        <p className='center spaceB02'>メールアドレスとパスワードを入力してログインしてください。</p>
        <SignFormComponent buttonText="ログイン" submit="tenantLogin" />
      </div>
    </>
  )
}

export default TenantLogin