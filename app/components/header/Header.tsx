import React, { useEffect, useState } from 'react'
import styles from './header.module.scss'
import Link from 'next/link'
import { headers } from 'next/headers'

interface tenantName {
  name: string
}

const tenantFetchData = async () => {
  const headersList = headers()
  const tenantId = headersList.get('X-Tenant-ID')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tenant/tenantNameGet`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: tenantId,
      }),
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

const Header = async () => {
  const tenantName: tenantName = await tenantFetchData()
  const headersList = headers()
  const nameEscaped = headersList.get('X-Name')
  const name = decodeURIComponent(nameEscaped as string)// ヘッダーから値を取得し、デコードして表示する

  return (
    <header className={styles.header}>
      {tenantName && (<h1><a href="/"><span className={styles.icon}>🏢</span>{tenantName.name}</a></h1>)}
      {name && (<p className='spNone'><span className={styles.icon}>👤</span>{name}</p>)}
    </header>
  )
}

export default Header