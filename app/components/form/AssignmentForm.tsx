'use client'
import authHook from '@/hooks/authHook'
import React, { useState, useEffect } from 'react'
import styles from './css/assignForm.module.scss'
import { useRouter } from 'next/navigation'
import { CircularProgress } from '@mui/material'

interface EmployeesClients {
  employeesClients: {
    employees: {
      _id: string;
      name: string;
    }[],
    clients: {
      _id: string;
      name: string;
    }[]
  }
}

const AssignmentForm = ({ employeesClients }: EmployeesClients) => {
  const userAuth = authHook()// メンバー一覧とクライアント一覧を取得する際にCSRで取得する。
  const router = useRouter()

  const { employees, clients } = employeesClients;// 親がSSRで取得した情報を使用する。




  const [startDate, setStartDate] = useState({
    year: new Date().getFullYear(),// 現在の西暦
    month: new Date().getMonth() + 1,// 現在の月
    day: 1
  })
  const [endDate, setEndDate] = useState({
    year: new Date().getFullYear(),// 現在の西暦
    month: new Date().getMonth() + 1,// 現在の月
    day: 31
  })

  // 選択可能範囲の指定。フロントでmap関数で展開する。
  const years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 1 + i)// 「length: 7」とすると「+ i」の効果で12個の選択肢が出現。「new Date().getFullYear()」で現在を起点として7年分選択可能。-1として1年前から選択可能。現在から-1年分の西暦を含めて7個の選択肢を表示。
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  // 現在の年月を取得。現在を中心にフォーカスを当てる。
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  // フォームで選択された「いつから」の日付を更新する。
  const startUpdateYear = (e: string) => {
    setStartDate(prev => {
      return { ...prev, year: parseInt(e) }
    })
  }
  const startUpdateMonth = (e: string) => {
    setStartDate(prev => {
      return { ...prev, month: parseInt(e) }
    })
  }
  const startUpdateDay = (e: string) => {
    setStartDate(prev => {
      return { ...prev, day: parseInt(e) }
    })
  }

  // フォームで選択された「いつまで」の日付を更新する。
  const endUpdateYear = (e: string) => {
    setEndDate(prev => {
      return { ...prev, year: parseInt(e) }
    })
  }
  const endUpdateMonth = (e: string) => {
    setEndDate(prev => {
      return { ...prev, month: parseInt(e) }
    })
  }
  const endUpdateDay = (e: string) => {
    setEndDate(prev => {
      return { ...prev, day: parseInt(e) }
    })
  }

  const getDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  // 月を2月、4月、6月、9月、11月、に選択したときに日付を31以下のものに変更する。
  useEffect(() => {
    const startDaysInMonth = getDaysInMonth(startDate.year, startDate.month);
    const endDaysInMonth = getDaysInMonth(endDate.year, endDate.month);

    if (startDate.day > startDaysInMonth) {
      setStartDate(prev => ({ ...prev, day: startDaysInMonth }));
    }
    if (endDate.day > endDaysInMonth) {
      setEndDate(prev => ({ ...prev, day: endDaysInMonth }));
    }
  }, [startDate.year, startDate.month, endDate.year, endDate.month])




  // 登録時の送信データ処理。
  const [selectEmployee, setSelectEmployee] = useState<string>("")
  const [selectClient, setSelectClient] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [pending, setPending] = useState(false)// ボタンpendingアイコン

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (selectEmployee === '') {
      alert("メンバーを選択してください。")
      return;
    }

    if (selectClient === '') {
      alert("取引先を選択してください。")
      return;
    }

    // 日付オブジェクトを文字列に変換
    const sinceDate = `${startDate.year}-${startDate.month.toString().padStart(2, '0')}-${startDate.day.toString().padStart(2, '0')}`
    const untilDate = `${endDate.year}-${endDate.month.toString().padStart(2, '0')}-${endDate.day.toString().padStart(2, '0')}`

    try {
      setPending(true)

      const response = await fetch(`/api/assign/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee: selectEmployee,
          client: selectClient,
          since: sinceDate,
          until: untilDate,
          description: description,
          admin: userAuth.admin,
          tenantId: userAuth.tenantId
        }),
      })

      const data = await response.json()
      if (response.ok) {
        alert(data.message)
        setDescription("")
        setSelectEmployee("")
        setSelectClient("")
        router.refresh()
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("登録に失敗しました。")
    } finally {
      setPending(false)
    }
  }



  // フォームを展開するボタン。
  const [assignFormControl, setAssignFormControl] = useState(false)

  return (
    <div className={`${styles.assignFormContainer} ${assignFormControl ? styles.assignFormOn : ""}`}>
      <button className={styles.openButton} onClick={() => setAssignFormControl(!assignFormControl)}>{assignFormControl ? "閉じる" : "配属登録する"}</button>


      <form className={styles.signForm} onSubmit={handleSubmit}>
        <div className={styles.formInner}>
          <div className={styles.leftBox}>
            {/* 期間設定 */}
            <div className={styles.dateRangePicker}>

              {/* いつから */}
              <select
                value={startDate.year}
                onChange={(e) => startUpdateYear(e.target.value)}// map関数で展開後のoptionの値で選択された値がupdateDate()に渡ってくる
                className={styles.dateSelect}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className={styles.dateLabel}>年</span>

              <select
                value={startDate.month}
                onChange={(e) => startUpdateMonth(e.target.value)}
                className={styles.dateSelect}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month.toString().padStart(2, '0')}</option> // padStartで数字を2桁に揃える。一桁の数字は10の位を'0'表示にする。
                ))}
              </select>
              <span className={styles.dateLabel}>月</span>

              <select
                value={startDate.day}
                onChange={(e) => startUpdateDay(e.target.value)}
                className={styles.dateSelect}
              >
                {getDays(startDate.year, startDate.month).map(day => (
                  <option key={day} value={day}>{day.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <span className={styles.dateLabel}>日</span>

              <span className={styles.dateSeparator}>〜<br className='sp' /></span>


              {/* いつまで */}
              <select
                value={endDate.year}
                onChange={(e) => endUpdateYear(e.target.value)}
                className={styles.dateSelect}
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <span className={styles.dateLabel}>年</span>

              <select
                value={endDate.month}
                onChange={(e) => endUpdateMonth(e.target.value)}
                className={styles.dateSelect}
              >
                {months.map(month => (
                  <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <span className={styles.dateLabel}>月</span>

              <select
                value={endDate.day}
                onChange={(e) => endUpdateDay(e.target.value)}
                className={styles.dateSelect}
              >
                {getDays(endDate.year, endDate.month).map(day => (
                  <option key={day} value={day}>{day.toString().padStart(2, '0')}</option>
                ))}
              </select>
              <span className={styles.dateLabel}>日</span>
            </div>

            <div>
              {startDate.year}月{startDate.month}日{startDate.day} から {endDate.year}月{endDate.month}日{endDate.day}まで。
            </div>

            <div>
              <select
                value={selectEmployee}
                onChange={(e: any) => setSelectEmployee(e.target.value)}// map関数で展開後のoptionの値で選択された値がupdateDate()に渡ってくる
                className={styles.employeeSelect}
              >
                <option className="" value="" disabled>メンバーを選択してください</option>
                {employees && employees.map(employee => {
                  return (
                    <option value={employee.name} key={employee._id}>{employee.name}</option>
                  )
                })}
              </select>

              <select
                value={selectClient}
                onChange={(e: any) => setSelectClient(e.target.value)}// map関数で展開後のoptionの値で選択された値がupdateDate()に渡ってくる
                className={styles.clientSelect}
              >
                <option className="" value="" disabled>取引先を選択してください</option>
                {clients && clients.map(client => {
                  return (
                    <option value={client.name} key={client._id}>{client.name}</option>
                  )
                })}
              </select>
            </div>
          </div>
          <div className={styles.rightBox}>
            <p>補足情報</p>
            <textarea className={styles.textarea} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>

        <button type='submit' className={styles.submitButton}>
          {pending ? <CircularProgress size={16} className="customCircularWhite" /> : "登録する"}
        </button>
      </form>
    </div>
  )
}

export default AssignmentForm