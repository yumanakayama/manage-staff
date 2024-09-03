'use client'
import React, { useState } from 'react'
import styles from './css/assignModal.module.scss'
interface Assign {
  assign: {
    employee: string;
    client: string;
    description?: string;
    since: string;
    until: string;
  }
}

const AssignModal = ({ assign }: Assign) => {
  const [modal, setModal] = useState<boolean>(false)
  return (
    <>
      <div style={{ height: "100%" }} onClick={() => setModal(true)}>
      </div >
      {modal && (
        <div>
          {assign.description ? (
            <p>{assign.description}</p>
          ) : (
            <p>補足情報はありません。</p>
          )}
        </div>

      )}
    </>
  )
}

export default AssignModal