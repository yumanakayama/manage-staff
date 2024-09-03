'use client'
import authHook from '@/hooks/authHook'
import React, { useState } from 'react'
import styles from './css/accountDeleteButton.module.scss'

const AccountDeleteButton = () => {
  const userAuth = authHook()
  const [open, setOpen] = useState<boolean>(false)
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (window.confirm("本当に削除しますか？")) {
      try {
        const response = await fetch(`/api/tenant/delete`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tenantId: userAuth.tenantId,
            password: password,
            master: userAuth.master,
          }),
        })

        if (response.ok) {
          // トークンを削除する
          await fetch('/api/session/logout', { method: 'POST' })
          alert("アカウントを削除しました。")
          setOpen(false)
          setPassword("")
          window.location.href = "/";
        } else {
          alert("パスワード認証に失敗しました。")
        }
      } catch (error) {
        alert("削除に失敗しました。")
      }
    }
  }

  return (
    <>
      <button type='button' onClick={() => setOpen(true)} className={styles.accountDeleteButton}>アカウント削除</button>
      {open && (
        <>
          <p className={styles.cation}>削除する場合はパスワードを入力して”削除する”を押してください。</p>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button type='submit' className={styles.deleteNow}>削除する</button>
            <button type='button' onClick={() => setOpen(false)}>キャンセル</button>
          </form>
        </>
      )}
    </>
  )
}

export default AccountDeleteButton