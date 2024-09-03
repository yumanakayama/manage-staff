import React from 'react'
import styles from './css/logoutButton.module.scss'
const LogoutButton = () => {

  const logout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.confirm("ログアウトしますか？")) {
      // トークンを削除する
      await fetch('/api/session/logout', { method: 'POST' })

      // 2024/08/29追加。チャット最新通知機能。
      localStorage.removeItem('lastCommentDate')

      window.location.href = "/";// ブラウザをリロードしてリダイレクトする。
    }
  }
  return (
    <button className={styles.logoutButton} onClick={logout}>ログアウト</button>
  )
}

export default LogoutButton