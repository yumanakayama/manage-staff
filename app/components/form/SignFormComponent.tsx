'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './css/signForm.module.scss'
import { CircularProgress } from '@mui/material'

interface signFormComponentData {
  submit: string
  nameText?: string
  buttonText: string
  userAuth?: any
  profileBeforeEditing?: {
    name: string
    email: string
    password: string
  }
}

const SignFormComponent = ({ submit, buttonText, nameText, userAuth, profileBeforeEditing }: signFormComponentData) => {
  const router = useRouter()
  const [userName, setUserName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [clientDescription, setClientDescription] = useState<string>("")

  // validation msseage
  const [userNameValMessage, setUserNameValMessage] = useState<boolean>(false)
  const [emailValMessage, setEmailValMessage] = useState<boolean>(false)
  const [emailValMessage2, setEmailValMessage2] = useState<boolean>(false)
  const [passwordValMessage, setPasswordValMessage] = useState<boolean>(false)

  // ボタンpendingアイコン
  const [pending, setPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // validation check
    if (userName.trim().length < 2 || userName.trim().length > 20) {
      setUserNameValMessage(true)
    } else {
      setUserNameValMessage(false)
    }
    if (email.trim().length < 5 || email.trim().length > 50) {
      setEmailValMessage(true)
    } else {
      setEmailValMessage(false)
    }
    if (password.trim().length < 8 || password.trim().length > 100) {
      setPasswordValMessage(true)
    } else {
      setPasswordValMessage(false)
    }
    if (email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setEmailValMessage2(true)
      } else {
        setEmailValMessage2(false)
      }
    }

    // tenant/sign-up
    if (submit === "tenantSignUp") {
      try {
        setPending(true)
        const response = await fetch(`/api/tenant/register`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: userName,
            email: email,
            password: password
          }),
        })
        const data = await response.json()
        if (response.ok) {
          alert(data.message)
          setUserName("")
          setEmail("")
          setPassword("")
          setUserNameValMessage(false)
          setEmailValMessage(false)
          setEmailValMessage2(false)
          setPasswordValMessage(false)
          router.push("/tenant/login")
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert("エラーが発生しました。")
      } finally {
        setPending(false)
      }
    }

    // tenant/login
    if (submit === "tenantLogin") {
      try {
        setPending(true)

        const response = await fetch(`/api/tenant/login`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password
          }),
        })
        const data = await response.json()
        if (response.ok) {
          alert(data.message)
          setEmail("")
          setPassword("")
          setEmailValMessage(false)
          setEmailValMessage2(false)
          setPasswordValMessage(false)
          window.location.href = "/tenant-page"
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert("エラーが発生しました。")
      } finally {
        setPending(false)
      }
    }

    // tenant/edit
    if (submit === 'tenantEdit') {
      if (window.confirm("更新しますか？")) {
        setPending(true)

        try {
          const response = await fetch(`/api/tenant/edit`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: userName,
              email: email,
              password: password,
              master: userAuth?.master,
              tenantId: userAuth?.tenantId
            }),
          })
          const data = await response.json()
          if (response.ok) {
            alert(data.message)
            setEmail("")
            setPassword("")
            setEmailValMessage(false)
            setEmailValMessage2(false)
            setPasswordValMessage(false)
            window.location.href = "/tenant-page"
          } else {
            alert(data.message)
          }
        } catch (error) {
          alert("エラーが発生しました。")
        } finally {
          setPending(false)
        }
      }
    }

    // employee/sign-up
    if (submit === 'employeeSignUp') {
      if (window.confirm("メンバーを新規登録しますか？")) {
        setPending(true)

        try {
          const response = await fetch(`/api/employee/register`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: userName,
              email: email,
              password: password,
              master: userAuth.master,
              tenantId: userAuth.tenantId,
            }),
          })
          const data = await response.json()
          if (response.ok) {
            alert(data.message)
            setUserName("")
            setEmail("")
            setPassword("")
            setUserNameValMessage(false)
            setEmailValMessage(false)
            setEmailValMessage2(false)
            setPasswordValMessage(false)
            router.refresh()
          } else {
            alert(data.message)
          }
        } catch (error) {
          alert("エラーが発生しました。")
        } finally {
          setPending(false)
        }
      }
    }

    // employee/login
    if (submit === 'employeeLogin') {
      try {
        setPending(true)

        const response = await fetch(`/api/employee/login`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        })
        const data = await response.json()
        if (response.ok) {
          alert(data.message)
          setEmail("")
          setPassword("")
          setEmailValMessage(false)
          setEmailValMessage2(false)
          setPasswordValMessage(false)
          window.location.href = "/tenant-page"
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert("エラーが発生しました。")
      } finally {
        setPending(false)
      }
    }

    // employee/edit
    if (submit === 'employeeEdit') {
      if (window.confirm("更新しますか？")) {
        setPending(true)

        try {
          const response = await fetch(`/api/employee/edit`, {
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              _id: userAuth._id,
              name: userName,
              email: email,
              password: password,
              tenantId: userAuth.tenantId
            }),
          })
          const data = await response.json()
          if (response.ok) {
            alert(data.message)
            setEmail("")
            setPassword("")
            setEmailValMessage(false)
            setEmailValMessage2(false)
            setPasswordValMessage(false)
            window.location.href = "/tenant-page"
          } else {
            alert(data.message)
          }
        } catch (error) {
          alert("エラーが発生しました。")
        } finally {
          setPending(false)
        }
      }
    }

    // tenant-page/client-register
    if (submit === 'clientRegister') {
      if (window.confirm("取引先を新規登録しますか？")) {
        setPending(true)

        try {
          const response = await fetch(`/api/client/register`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: userName,
              description: clientDescription,
              master: userAuth.master,
              tenantId: userAuth.tenantId,
            }),
          })
          const data = await response.json()
          if (response.ok) {
            alert(data.message)
            setUserName("")
            setUserNameValMessage(false)
            setClientDescription("")
            router.refresh()
          } else {
            alert(data.message)
          }
        } catch (error) {
          alert("エラーが発生しました。")
        } finally {
          setPending(false)
        }
      }
    }
  }

  // tenant/editページ、employee/editページでデータを取得する。
  useEffect(() => {
    if (submit === 'tenantEdit' && profileBeforeEditing || submit === 'employeeEdit' && profileBeforeEditing) {
      setUserName(profileBeforeEditing.name || "")
      setEmail(profileBeforeEditing.email || "")
    }
  }, [submit, profileBeforeEditing])

  return (
    <form className={styles.signForm} onSubmit={handleSubmit}>
      <>
        {nameText && (
          <div>
            <label className={styles.label} htmlFor="name">{nameText}</label>
            <input className={styles.input} type="text" id="name" name="name" value={userName} onChange={(e) => setUserName(e.target.value)} />
            {userNameValMessage && <p>名前は2文字以上、20文字以内で入力してください。</p>}
          </div>
        )}

        {/* 取引先新規登録以外 */}
        {submit !== 'clientRegister' && (
          <>
            <div>
              <label className={styles.label} htmlFor="email">メールアドレス</label>
              <input className={styles.input} type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              {emailValMessage && <p>メールアドレスは5文字以上、50文字以内で入力してください。</p>}
              {emailValMessage2 && <p>無効なメールアドレス形式です。</p>}
            </div>
            <div>
              <label className={styles.label} htmlFor="password">パスワード</label>
              <input className={styles.input} type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={`${submit === 'tenantEdit' ? "新しいパスワードを入力してください" : ""} ${submit === 'employeeEdit' ? "新しいパスワードを入力してください" : ""}`} />
              {passwordValMessage && <p>パスワードは8文字以上、100文字以内で入力してください。</p>}
            </div>
          </>
        )}

        {/* 取引先新規登録 */}
        {submit === 'clientRegister' && (
          <div>
            <label className={styles.label} htmlFor="clientDescription">補足事項</label>
            <textarea className={styles.textarea} id="clientDescription" name="clientDescription" value={clientDescription} onChange={(e) => setClientDescription(e.target.value)} />
          </div>
        )}

        <button type='submit' disabled={pending}>
          {pending ? <CircularProgress size={16} className="customCircularWhite" /> : buttonText}
        </button>
      </>
    </form>
  )
}

export default SignFormComponent