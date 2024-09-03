import React from 'react'
import styles from './appTop.module.scss'
import Link from 'next/link'

const AppTopHeader = () => {
  return (
    <header className={styles.header}>
      <nav>
        <div><a href="/" className={styles.logo}>ManageStaff</a></div>
        <ul className={styles.navLinks}>
          <li><a href="/tenant/login">テナントログイン</a></li>
          <li><a href="/employee/login">メンバーログイン</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default AppTopHeader