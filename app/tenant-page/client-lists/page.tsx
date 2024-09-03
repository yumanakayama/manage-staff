import React from 'react'
import { headers } from 'next/headers'
import ItemDeleteButton from '@/app/components/button/ItemDeleteButton'
import styles from './clientList.module.scss'
interface Client {
  _id: string
  name: string
  description?: string
  tenantId: string
}

const fetchClientLists = async () => {
  const headersList = headers()
  const tenantId = headersList.get('X-Tenant-ID')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/client/getAll`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: tenantId
      }),
    })
    const clientLists = await response.json()
    return clientLists
  } catch (error) {
    throw error
  }
}
const ClientLists = async () => {
  const clientLists: Client[] = await fetchClientLists()
  const headersList = headers()
  const master = headersList.get('X-Master')

  return (
    <>
      <h1 className='formPageH1'>取引先一覧</h1>
      <div className='inner'>
        <ul className={styles.clientList}>
          {clientLists.length > 0 ? (
            clientLists.map((clientList) => (
              <li key={clientList._id} id={clientList._id}>
                <p className={styles.clientName}>{clientList.name}</p>
                <p className={styles.strong}>補足情報</p>
                <p className={styles.clientDescription}>{clientList.description}</p>
                {master === "true" && (
                  <div className={styles.deleteButtonWrapper}>
                    <ItemDeleteButton clientName={clientList.name} _id={clientList._id} deleteSubmit="clientDelete" />
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className={styles.emptyList}>まだ登録されていません。</li>
          )}
        </ul>
      </div>
    </>
  )
}

export default ClientLists