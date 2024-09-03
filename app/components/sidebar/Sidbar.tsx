'use client'
import Link from 'next/link'
import styles from './sidebar.module.scss'

import SettingsIcon from '@mui/icons-material/Settings';
import { headers } from 'next/headers'
import NewChatPoint from '../newChatPoint/NewChatPoint';
import authHook from '@/hooks/authHook';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingBar from '../LoadingBar/LoadingBar';

const Sidebar = () => {
  // const headersList = headers()
  // const pathname = headersList.get('X-Pathname')
  // const master = headersList.get('X-Master')
  // const nameEscaped = headersList.get('X-Name')
  // const name = decodeURIComponent(nameEscaped as string)// ヘッダーから値を取得し、デコードして表示する

  const userAuth = authHook()
  const pathname = usePathname()




  // クリック時のロードアイコン
  const [clickLoading, setClickLoading] = useState(false)
  const handleClick = () => {
    setClickLoading(true)
  }
  useEffect(() => {
    if (clickLoading) {
      // 遷移が完了した後にローディングをリセットする
      setClickLoading(false);
    }
  }, [pathname]);



  // spメニューボタン
  const [spMenu, setSpMenu] = useState(false)
  const onClickMenu = () => {
    setSpMenu(!spMenu)
  }

  return (
    <>

      <button className={`pcNone ${styles.humButton} ${spMenu ? styles.spMenuOn : ""}`} onClick={onClickMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`${styles.menuBar} ${spMenu ? styles.spMenuOn : ""}`} >
        {userAuth.tenantId && (
          <>
            {userAuth.userName && (
              <li className={`pcNone ${styles.loginUser}`}>
                <p className={styles.para}>ログイン中のユーザー</p>
                <p className={styles.userName}><span className={styles.icon}>👤</span>{userAuth.userName}</p>
              </li>
            )}
            <li onClick={() => { setSpMenu(false), handleClick() }}><Link href="/tenant-page" className={pathname === "/tenant-page" ? styles.current : ""} ><span className={`${styles.icon}`}>　🏢</span>トップ</Link></li>
            {userAuth.master && (
              <li onClick={() => { setSpMenu(false), handleClick() }}><Link href="/employee/sign-up" className={pathname === "/employee/sign-up" ? styles.current : ""} ><span className={`${styles.icon}`}><small>➕</small>👤</span>メンバー登録</Link></li>
            )}
            {userAuth.master && (
              <li onClick={() => { setSpMenu(false), handleClick() }}><Link href="/tenant-page/client-register" className={pathname === "/tenant-page/client-register" ? styles.current : ""} ><span className={`${styles.icon}`}><small>➕</small>💼</span>取引先新規登録</Link></li>
            )}
            <li onClick={() => { setSpMenu(false), handleClick() }}><Link href="/tenant-page/employee-lists" className={pathname === "/tenant-page/employee-lists" ? styles.current : ""} ><span className={`${styles.icon}`}>　👥</span>メンバー一覧</Link></li>
            <li onClick={() => { setSpMenu(false), handleClick() }}><Link href="/tenant-page/client-lists" className={pathname === "/tenant-page/client-lists" ? styles.current : ""} ><span className={`${styles.icon}`}>　💼</span>取引先一覧</Link></li>
            <li onClick={() => { setSpMenu(false), handleClick() }}>
              <Link href="/tenant-page/chat" className={`${styles.menuItem} ${pathname === "/tenant-page/chat" ? styles.current : ""}`} >
                <span className={`${styles.icon}`}>　💬</span>チーム内チャット
                <NewChatPoint />
              </Link>
            </li>
            {userAuth.master && (
              <li onClick={() => { setSpMenu(false), handleClick() }}><Link href="/tenant/edit" className={pathname === "/tenant/edit" ? styles.current : ""} ><span className={`${styles.icon}`}>　<SettingsIcon style={{ fontSize: "20px" }} /></span>プロフィール編集</Link></li>
            )}
            {!userAuth.master && (
              <li onClick={() => { setSpMenu(false), handleClick() }}><Link href="/employee/edit" className={pathname === "/employee/edit" ? styles.current : ""} ><span className={`${styles.icon}`}>　<SettingsIcon style={{ fontSize: "20px" }} /></span>プロフィール編集</Link></li>
            )}

          </>
        )}
      </ul>
      {clickLoading && (
        <LoadingBar />
      )}
      {spMenu && <div className={styles.spMenuBg} onClick={() => setSpMenu(false)}></div>}

    </>
  )
}

export default Sidebar