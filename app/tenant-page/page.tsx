import React from 'react'
import { headers } from 'next/headers'
import HorizontalCalendar from '../components/HorizontalCalendar';
import Assignmment from './assignment/Assignment';

interface Assign {
  _id: string;
  employee: string;
  client: string;
  since: string;
  until: string;
  description?: string;
}
const fetchAssignLists = async () => {
  const headersList = headers()
  const tenantId = headersList.get('X-Tenant-ID')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/assign/getAll`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId
      }),
    })
    const assignLists = await response.json()
    return assignLists
  } catch (error) {
    throw error
  }
}

const TenantPage = async () => {
  const assignLists: Assign[] = await fetchAssignLists()
  const headersList = headers()
  const admin = headersList.get('X-Admin')

  return (
    <div>
      <HorizontalCalendar assignLists={assignLists} />
      {admin === "true" && <Assignmment />}
    </div>
  )
}

export default TenantPage