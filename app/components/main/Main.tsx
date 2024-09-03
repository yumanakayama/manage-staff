import React from 'react'
import styles from './css/main.module.scss'
interface ChildrenData {
  children: React.ReactNode
}
const Main = ({ children }: ChildrenData) => {
  return (
    <main className={styles.main}>{children}</main>
  )
}

export default Main