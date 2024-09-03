'use client'
import authHook from '@/hooks/authHook';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import styles from './css/commentForm.module.scss'
import { CircularProgress } from '@mui/material'


function CommentPostForm() {
  const userAuth = authHook()
  const [comment, setComment] = useState<string>("")
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [pending, setPending] = useState(false)// ボタンpendingアイコン

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setPending(true)
      const response = await fetch(`/api/chat/post`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userAuth.userName,
          userId: userAuth._id,
          tenantId: userAuth.tenantId,
          comment: comment,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setComment("")
        window.location.reload();
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("投稿に失敗しました。")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <button className={styles.commentBubbleButton} onClick={() => setOpenModal(!openModal)}>
        <span className={styles.icon}>💬</span>
        コメント
      </button>

      {openModal && (
        <>
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button className={styles.closeButton} onClick={() => setOpenModal(false)}>
                &times;
              </button>
              <form onSubmit={handleSubmit}>
                <label htmlFor="comment">コメント投稿</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button type='submit'>
                  {pending ? <CircularProgress size={16} className="customCircularWhite" /> : "投稿"}
                </button>
              </form>
            </div>
          </div>
          <style>{`body {overflow: hidden; position: fixed; width: 100%;}`}</style>
        </>
      )}
    </>
  )
}

export default CommentPostForm