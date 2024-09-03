import SignFormComponent from '@/app/components/form/SignFormComponent'
import React from 'react'

const EmployeeLogin = () => {
  return (
    <>
      <h1 className='formPageH1'>メンバーログイン</h1>
      <div className="inner">
        <p className='center spaceB02'>メールアドレスとパスワードを入力してログインしてください。</p>
        <SignFormComponent buttonText="ログイン" submit="employeeLogin" />
      </div>
    </>
  )
}

export default EmployeeLogin