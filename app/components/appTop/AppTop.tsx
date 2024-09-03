import React from 'react'
import styles from './appTop.module.scss'

const AppTop = () => {
  return (
    <>
      <div className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1>チームの進捗を一目で把握<br />効率的なプロジェクト管理で、<br />期限遅れやタスクの見落としを防止</h1>
            <p>シンプルで使いやすいインターフェースを備えたManageStaffは、直感的な操作で誰でも簡単にプロジェクトとタスクを管理できます。</p>
            <a href="/tenant/sign-up" className={`${styles.btn} ${styles.btnPrimary}`}>無料で試してみる</a>
          </div>
          <div className={styles.heroImage}>
            <img src="/appTop/ManageStaffFvImg.png" alt="プロジェクト管理ツールの画面イメージ" />
          </div>
        </section>
      </div>
    </>
  )
}

export default AppTop