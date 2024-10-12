'use client'
import authHook from '@/hooks/authHook'
import React, { useState } from 'react'
import styles from './css/accountDeleteButton.module.scss'

const AccountDeleteButton = () => {
  const userAuth = authHook()
  const [modal, setModal] = useState<boolean>(false)
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
          setModal(false)
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
      <button type='button' onClick={() => setModal(true)} className={styles.accountDeleteButton}>アカウント削除</button>
      {modal && (
        <div className={styles.deleteModal}>
          <div className={styles.modalInner}>
            <p className={styles.cation}>
              テナントを削除します。<br />
              削除する場合はパスワードを入力して<br />
              ”削除する”を押してください。<br />
              （データの復元はできません。）
              </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input type="password" className={styles.input} placeholder="パスワードを入力してください" value={password} onChange={e => setPassword(e.target.value)} />
              <button type='button' className={styles.button} onClick={() => setModal(false)}>キャンセル</button>
              <button type='submit' className={styles.button}>削除する</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default AccountDeleteButton