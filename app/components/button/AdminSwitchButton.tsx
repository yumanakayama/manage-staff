'use client'
import authHook from '@/hooks/authHook';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import styles from './css/adminSwitchButton.module.scss'

interface EmployeeData {
  employee: {
    _id: string
    name: string
    admin: boolean
    tenantId: string
  }
}

const AdminSwitchButton = ({ employee }: EmployeeData) => {
  const userAuth = authHook()
  const router = useRouter()
  const [adminSwitch, setAdminSwitch] = useState<boolean>(employee.admin)
  const [onMessage, setOnMessage] = useState(false)

  const handleClick = async (_id: string) => {
    setAdminSwitch(!adminSwitch)
    setOnMessage(true)
    try {
      const response = await fetch(`/api/employee/adminSwitch`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: _id,
          admin: !adminSwitch,
          master: userAuth.master,
          tenantId: userAuth.tenantId
        }),
      })
      if (response.ok) {
        router.refresh()
      }
    } catch (error) {
      alert("権限の切り替えに失敗しました。")
    }

    setTimeout(() => {
      setOnMessage(false)
    }, 1000)
  }

  return (
    <>
      <div className={styles.adminStatusWrap}>
        <p>管理者ステータス</p>
        <button
          onClick={() => handleClick(employee._id)} className={`${styles.toggleButton} ${adminSwitch ? styles.admin : ""}`}>
        </button>
        {adminSwitch ? (<span style={{ cursor: "default", opacity: onMessage ? 1 : 0, transitionDuration: onMessage ? "0s" : "0.3s" }}>権限が付与されました。</span>) : (<span style={{ cursor: "default", opacity: onMessage ? 1 : 0, transitionDuration: onMessage ? "0s" : "0.3s" }}>権限が削除されました。</span>)}
      </div>
    </>
  )
}

export default AdminSwitchButton