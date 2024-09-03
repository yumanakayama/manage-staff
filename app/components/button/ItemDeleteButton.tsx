'use client'
import authHook from '@/hooks/authHook'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import styles from './css/itemDeleteButton.module.scss'

interface ItemDeleteButton {
  _id: string,
  deleteSubmit: string,
  commentUserId?: string,
  employeeName?: string,
  clientName?: string,
}

const ItemDeleteButton = ({ _id, deleteSubmit, commentUserId, employeeName, clientName }: ItemDeleteButton) => {
  const userAuth = authHook()
  const router = useRouter()

  const handleClick = async (_id: string) => {

    const deleteSelect = () => {
      // メンバー削除
      if (deleteSubmit === "employeeDelete") {
        return "/api/employee/delete"
      }
      // 取引先削除
      if (deleteSubmit === "clientDelete") {
        return "/api/client/delete"
      }
      // チャットコメント削除
      if (deleteSubmit === "commentDelete") {
        return "/api/chat/delete"
      }
    }

    if (window.confirm(`${employeeName || clientName || !employeeName && !clientName && "コメント"}を削除しますか？`)) {
      const item = document.getElementById(`${_id}`)
      item?.classList.add("fadeOut")

      try {
        // チャットページ以外。
        if (deleteSubmit !== "commentDelete") {
          const response = await fetch(`${deleteSelect()}`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              _id: _id,
              employeeName: employeeName,// メンバー削除時配属表からも削除するときに参照する。
              master: userAuth.master,
              tenantId: userAuth.tenantId,
            }),
          })

          const data = await response.json()
          if (response.ok) {
            // alert("削除しました。")
            router.refresh()
          } else {
            alert(data.message)
          }
        }

        // チャットページ。
        if (deleteSubmit === "commentDelete") {
          const response = await fetch(`${deleteSelect()}`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              _id: _id,
              userId: commentUserId,
              clickedUserId: userAuth._id,
              tenantId: userAuth.tenantId,
            }),
          })

          const data = await response.json()
          if (response.ok) {
            window.location.reload()
          } else {
            alert(data.message)
          }
        }

      } catch (error) {
        alert("削除に失敗しました。")
      }
    }
  }

  return (
    <>
      {/* チャットページ以外の削除ボタン */}
      {deleteSubmit !== "commentDelete" && (
        <button className={styles.deleteButton} onClick={() => handleClick(_id)}>削除</button>
      )}

      {/* チャットページの削除ボタン */}
      {deleteSubmit === "commentDelete" && (
        <button className={styles.deleteButton} onClick={() => handleClick(_id)}>削除</button>
      )}
    </>
  )
}

export default ItemDeleteButton