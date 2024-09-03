import AssignmentForm from "@/app/components/form/AssignmentForm"
import { headers } from 'next/headers'

// メンバー一覧と取引先一覧を取得。

export const fetchEmployees = async () => {
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
        tenantId: tenantId,
      }),
    })

    const employees = await response.json()
    return employees
  } catch (error) {
    throw error
  }
}

export const fetchClients = async () => {
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
        tenantId: tenantId,
      }),
    })

    const clients = await response.json()
    return clients
  } catch (error) {
    throw error
  }
}

const Assignmment = async () => {
  const employees = await fetchEmployees()
  const clients = await fetchClients()
  const employeesClients = {
    employees,
    clients
  }

  return (
    <>
      <AssignmentForm employeesClients={employeesClients} />

    </>
  )
}

export default Assignmment