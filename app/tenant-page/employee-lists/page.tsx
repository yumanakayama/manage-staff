import React from 'react'
import { headers } from 'next/headers'
import ItemDeleteButton from '@/app/components/button/ItemDeleteButton'
import AdminSwitchButton from '@/app/components/button/AdminSwitchButton'
import styles from './employeeList.module.scss'
interface Employee {
  _id: string
  name: string
  admin: boolean
  tenantId: string
}

const fetchEmployeeLists = async () => {

  // middlewareでSSR時にtokenを抽出するためheadersを使用する。
  const headersList = headers()
  const tenantId = headersList.get('X-Tenant-ID')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/employee/getAll`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: tenantId
      }),
    })
    const employeeLists = await response.json()
    return employeeLists
  } catch (error) {
    throw error
    return [] // エラー時には空の配列を返す
  }
}

const EmployeeLists = async () => {
  const employees: Employee[] = await fetchEmployeeLists()

  const headersList = headers()
  const master = headersList.get('X-Master')

  return (
    <>
      <h1 className='formPageH1'>メンバー一覧</h1>
      <ul className={styles.employeeList}>
        {employees.length > 0 ? (
          employees.map((employee) => (
            <li key={employee._id} id={employee._id}>
              <p className={styles.employeeName}>{employee.name}</p>
              {master === "true" && <AdminSwitchButton employee={employee} />}
              {master === "true" && <ItemDeleteButton employeeName={employee.name} _id={employee._id} deleteSubmit="employeeDelete" />}
            </li>
          ))
        ) : (
          <li className={styles.emptyList}>まだ登録されていません。</li>
        )}
      </ul>
    </>
  )
}

export default EmployeeLists