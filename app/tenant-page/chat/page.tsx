// 'use client'
import React, { useEffect, useState } from 'react'
import ItemDeleteButton from '@/app/components/button/ItemDeleteButton'
import CommentPostForm from '@/app/components/form/CommentPostForm'
import styles from './chat.module.scss'
import { headers } from 'next/headers';
// import authHook from '@/hooks/authHook'
// import { usePathname, useRouter } from 'next/navigation'
// import HorizontailCalendarLoadingBar from '@/app/components/LoadingBar/HorizontailCalendarLoadingBar'

interface Comments {
  _id: string;
  name: string;
  comment: string;
  userId: string;
  tenantId: string;
  createdAt: Date;
}

const commentListsFetch = async () => {
  const headersList = headers()
  const headersTenantId = headersList.get('X-Tenant-ID')
  const headersMaster = headersList.get('X-Master')
  const headersId = headersList.get('X-Id')

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/chat/getAll`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: headersTenantId,
      }),
    })

    const comments = await response.json()
    if (response.ok) {
      if (comments && comments.length > 0) {
        const latestComment = comments.sort((a: Comments, b: Comments) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const latestCommentDate = latestComment.createdAt;

        // 取り出した最新のコメント情報を取得して自分のlastCommentDateをアップデートする。
        if (headersMaster) {
          // テナント
          try {
            await fetch(`${process.env.NEXT_PUBLIC_URL}/api/tenant/edit`, {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                _id: headersId,
                master: headersMaster,
                tenantId: headersTenantId,
                lastCommentDate: latestCommentDate
              }),
            })
          } catch (error) {
            return;
          }

        } else if (!headersMaster) {
          // メンバー
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/employee/edit`, {
              method: 'PUT',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                _id: headersId,
                tenantId: headersTenantId,
                lastCommentDate: latestCommentDate
              }),
            })
          } catch (error) {
            return;
          }
        } else {
          return;
        }
      }
    }
    return comments

  } catch (error) {
    console.error(error)
  }

}

const Chat = async () => {
  // const userAuth = authHook()
  // const router = useRouter()
  // const pathname = usePathname()
  // const [comments, setComments] = useState<Comments[]>([])
  // const [loading, setLoading] = useState(true);
  // const [nowViewComment, setNowViewComment] = useState()// コメントがあった場合自動でコメントを取得してくる。

  // // 全コメントを取得して最新コメントを自動でアップデートする。
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!userAuth.tenantId) return; // tenantId がない場合はフェッチしない
  //     try {
  //       setLoading(true)
  //       const response = await fetch(`/api/chat/getAll`, {
  //         method: 'POST',
  //         headers: {
  //           'Accept': 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           tenantId: userAuth.tenantId
  //         }),
  //       })
  //       const comments = await response.json()
  //       if (response.ok) {
  //         setComments(comments)
  //         router.refresh()
  //       }

  //       //commentsから作成日時でソートして最も新しいコメントを取り出す。
  //       if (comments.length > 0) {
  //         const latestComment = comments.sort((a: Comments, b: Comments) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  //         const latestCommentDate = latestComment.createdAt;

  //         // ローカルにセット
  //         if (latestCommentDate) {
  //           localStorage.setItem('lastCommentDate', latestCommentDate)
  //         }





  //         // 取り出した最新のコメント情報を取得して自分のlastCommentDateをアップデートする。
  //         if (userAuth.master) {
  //           // テナント
  //           try {
  //             await fetch(`/api/tenant/edit`, {
  //               method: 'PUT',
  //               headers: {
  //                 'Accept': 'application/json',
  //                 'Content-Type': 'application/json',
  //               },
  //               body: JSON.stringify({
  //                 _id: userAuth._id,
  //                 master: userAuth.master,
  //                 tenantId: userAuth.tenantId,
  //                 lastCommentDate: latestCommentDate
  //               }),
  //             })
  //           } catch (error) {
  //             return;
  //           }

  //         } else if (!userAuth.master) {
  //           // メンバー
  //           try {
  //             const response = await fetch(`/api/employee/edit`, {
  //               method: 'PUT',
  //               headers: {
  //                 'Accept': 'application/json',
  //                 'Content-Type': 'application/json',
  //               },
  //               body: JSON.stringify({
  //                 _id: userAuth._id,
  //                 tenantId: userAuth.tenantId,
  //                 lastCommentDate: latestCommentDate
  //               }),
  //             })
  //           } catch (error) {
  //             return;
  //           }
  //         } else {
  //           return;
  //         }
  //       }
  //     } catch (error) {
  //       throw error
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchData()
  // }, [userAuth, nowViewComment])




  // // 2024/08/30追加。チャット最新投稿通知。投稿されるとトリガーになり矯正で取得させる。
  // useEffect(() => {
  //   // WebSocket 接続の設定
  //   const ws = new WebSocket('wss://manage-staff.vercel.app:443');

  //   // WebSocket接続時にテナントIDをサーバーに送信
  //   ws.onopen = () => {
  //     ws.send(JSON.stringify({ tenantId: userAuth.tenantId }));
  //   };

  //   ws.onmessage = async (event) => {
  //     let data;
  //     try {
  //       if (event.data instanceof Blob) {
  //         // Blobの場合、テキストに変換してからパース
  //         const text = await event.data.text();
  //         if (!text.trim()) {
  //           // テキストが空の場合
  //           return;
  //         }

  //         data = JSON.parse(text);
  //       } else {
  //         // 既にテキストの場合、直接パース
  //         data = JSON.parse(event.data);
  //       }

  //       const newComment = data;
  //       setNowViewComment(newComment)

  //     } catch (error) {
  //       console.error('WebSocket message processing error:', error);
  //     }
  //   };

  //   return () => {
  //     ws.close()
  //   }
  // }, [userAuth.tenantId, pathname])



  // SSR 
  const comments: Comments[] = await commentListsFetch()
  const headersList = headers()
  const headersTenantId = headersList.get('X-Tenant-ID')
  const headersMaster = headersList.get('X-Master')
  const headersId = headersList.get('X-Id')

  // 日付を変換。
  const formatDate = (date: Date | null) => {
    if (date) {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } else {
      return
    }
  }


  return (
    <>
      {/* {loading && <HorizontailCalendarLoadingBar />} */}
      <h1 className='formPageH1'>チーム内チャット</h1>
      <div className='inner'>
        <ul className={styles.commentsList}>
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <li key={comment._id} id={comment._id} className={headersId === comment.userId ? styles.self : styles.other}>
                <p className={styles.name}>{comment.name}</p>
                <p className={styles.date}>{formatDate(comment.createdAt)}</p>
                <p className={styles.comment}>{comment.comment}</p>
                {headersId === comment.userId && (
                  <div className={styles.deleteButtonContainer}>
                    <ItemDeleteButton _id={comment._id} deleteSubmit="commentDelete" commentUserId={comment.userId} />
                  </div>
                )}
              </li>
            ))
          ) : (
            <li className={styles.emptyList}>コメントは0件です。</li>
          )}
        </ul>
      </div>
      <CommentPostForm />
    </>
  )
}

export default Chat