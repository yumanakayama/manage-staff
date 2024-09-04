'use client'
import authHook from '@/hooks/authHook'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import styles from './newChatPoint.module.scss'
import { usePathname } from 'next/navigation'
import SettingsIcon from '@mui/icons-material/Settings';
const NewChatPoint = () => {
  const userAuth = authHook()
  const pathname = usePathname()

  // 2024/08/29追加。チャット最新投稿通知。
  const [hasNewComment, setHasNewComment] = useState(false)
  useEffect(() => {
    // WebSocket 接続の設定
    const port = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
    const ws = new WebSocket('wss://manage-staff.vercel.app/');// デプロイご正式なドメインに変更する。例「wss://your-domain.com:8080」

    // WebSocket接続時にテナントIDをサーバーに送信
    ws.onopen = () => {
      ws.send(JSON.stringify({ tenantId: userAuth.tenantId }));
    };

    ws.onmessage = async (event) => {
      let data;
      try {
        if (event.data instanceof Blob) {
          // Blobの場合、テキストに変換してからパース
          const text = await event.data.text();
          if (!text.trim()) {
            // テキストが空の場合
            return;
          }

          data = JSON.parse(text);
        } else {
          // 既にテキストの場合、直接パース
          data = JSON.parse(event.data);
        }

        // 新しいコメントの処理、最新投稿の日付をローカルストレージに登録する。
        const newComment = data;


        if (newComment.name !== userAuth.userName) {
          // 自分の投稿ではない場合の処理。
          const setNewCommentDate = new Date(newComment.createdAt);
          localStorage.setItem('setOtherNewComment', setNewCommentDate.toISOString());
          localStorage.setItem('commentNoCheck', 'true');
          setHasNewComment(true)// マークを点灯させる。
        } else {
          // 自分の投稿だった場合
          const setNewCommentDate = new Date(newComment.createdAt);
          localStorage.setItem('setOtherNewComment', setNewCommentDate.toISOString());
          localStorage.setItem('commentNoCheck', 'false');
        }

      } catch (error) {
        console.error('WebSocket message processing error:', error);
      }
    };

    return () => {
      ws.close()
    }
  }, [userAuth.tenantId, pathname])


  // ページ遷移時にローカルストレージの状態を監視してマークの点灯消灯を選択する。
  useEffect(() => {
    // チャットページに訪れた場合、2種のコメントの日付を比較する。
    const localLastCommentDate = localStorage.getItem('lastCommentDate');
    const localOtherNewComment = localStorage.getItem('setOtherNewComment');
    const commentNoCheck = localStorage.getItem('commentNoCheck');

    if (localLastCommentDate && localOtherNewComment) {
      // 対象が存在する場合以下の処理を実行する。
      const lastCommentDate = new Date(localLastCommentDate);
      const newCommentDate = new Date(localOtherNewComment);

      // 差分がない（チャットページに訪れてローカルの値が更新されたとき以下の処理が実行）
      if (lastCommentDate.getTime() === newCommentDate.getTime()) {// getTime()がないと比較できなくなり機能しなくなる。
        localStorage.setItem('commentNoCheck', 'false');// 差分がなくなったときにローカルのcommentNoCheckをfalseに変更。
        return setHasNewComment(false)// commentNoCheckがfalse（確認済み）で消灯。
      }

      if (commentNoCheck === "true") {
        return setHasNewComment(true)// commentNoCheckがtrue（未確認）で点灯する。
      }

      if (commentNoCheck === "false") {
        return setHasNewComment(false)// commentNoCheckがfalse（未確認）で消灯する。
      }

      // 最新投稿の日付がローカルのものより古い場合の処理。
      if (lastCommentDate.getTime() > newCommentDate.getTime()) {
        localStorage.setItem('commentNoCheck', 'false');// 差分があるときにローカルのcommentNoCheckをfalseに変更。
        if (commentNoCheck === "false") {
          return setHasNewComment(false)// commentNoCheckがtrue（未確認）で消灯。
        }
      } else {
        return setHasNewComment(false)
      }

    } else {
      return;
    }
  }, [pathname, hasNewComment])

  return (
    <>
      {hasNewComment ? <span className=""></span> : <></>}
    </>
  )
}

export default NewChatPoint