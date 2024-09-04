'use client'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styles from './horizontalCalendar.module.scss'
import authHook from '@/hooks/authHook';
import { useRouter } from 'next/navigation';
import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';
import HorizontailCalendarLoadingBar from './LoadingBar/HorizontailCalendarLoadingBar';


interface Assign {
  _id: string;
  employee: string;
  client: string;
  since: string;
  until: string;
  description?: string;
}

interface CalenderData {
  date: number;
  day: string;
}

const HorizontalCalendar = ({ assignLists }: { assignLists: Assign[] }) => {
  const userAuth = authHook()
  const router = useRouter()
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [calendarData, setCalendarData] = useState<CalenderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateCalendarData(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const generateCalendarData = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = [];

    for (let i = 1; i <= daysInMonth; i++) {
      data.push({
        date: i,
        day: new Date(year, month, i).toLocaleDateString('ja-JP', { weekday: 'short' })
      });
    }

    setCalendarData(data);
    setLoading(false)
  };

  const getAssignmentsForDay = (employee: string, date: number) => {
    const fullDate = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    return assignLists.filter(assign =>
      assign.employee === employee &&
      new Date(assign.since) <= new Date(fullDate) &&
      new Date(assign.until) >= new Date(fullDate)
    );
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i);




  // モーダル関連。
  const [modalControl, setModalControl] = useState(false)
  const [modalData, setModalData] = useState<Assign | null>(null)
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  // モーダルの中の日付をデフォルトからカスタマイズする。
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      // year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).replace(/\//g, '月').replace(/(\d+)月(\d+)/, '$1月$2日');// 「月」「日」に変更する。
  };
  // クリックしたアイテムのモーダルを開く。
  const handleClick = (e: React.MouseEvent<HTMLDivElement>, assignment: Assign) => {
    setModalData(assignment);
    setModalControl(true);// モーダル開閉

    // モーダルの展開位置の処理
    const rect = e.currentTarget.getBoundingClientRect(); // クリックした対象を判定
    const isSmallScreen = window.innerWidth <= 780;

    setModalPosition({
      top: rect.top + window.scrollY + (isSmallScreen ? 20 : 20), // 画面幅が780px以下の場合は少し上に表示
      left: rect.left + window.scrollX + (isSmallScreen ? -70 : -200) // 画面幅が780px以下の場合は真下より少し右に表示
    });
  }

  const closeModal = () => {
    setModalControl(false);
    setModalData(null);
  }

  // スクロールするとモーダルが閉じる
  useEffect(() => {
    const handleScroll = () => {
      if (modalControl) {
        setModalControl(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.addEventListener('scroll', handleScroll);
      document.addEventListener('wheel', handleScroll);

    };
  }, [modalControl])

  // アサインを削除する。
  const handleDelete = (_id: string) => {
    if (window.confirm("削除しますか？")) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/assign/delete`, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              _id: _id,
              admin: userAuth.admin,
              tenantId: userAuth.tenantId
            }),
          })
          if (response.ok) {
            router.refresh()
          }
        } catch (error) {
          alert("削除に失敗しました。")
        }
      }
      fetchData()
    }
  }





  // カスタムドラッグスクロール。
  const simpleBarRef = useRef<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [isMouseDown, setIsMouseDown] = useState(false);// マウスをハンドに変更する。

  const handleMouseDown = (e: React.MouseEvent) => {
    if (simpleBarRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - simpleBarRef.current!.getScrollElement().offsetLeft);
      setScrollLeft(simpleBarRef.current!.getScrollElement().scrollLeft);

      // マウスダウン後、一定時間経過したらドラッグ開始とみなす
      setIsMouseDown(true);
      setTimeout(() => {
        if (isMouseDown) {
          setIsDragging(true);
        }
      }, 150); // 150ミリ秒後にドラッグ開始と判定
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsMouseDown(false);// マウスをポインターに戻す。
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsMouseDown(false);// マウスをポインターに戻す。
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - simpleBarRef.current!.getScrollElement().offsetLeft;
    const walk = (x - startX) * 2; // スクロール速度を調整
    simpleBarRef.current!.getScrollElement().scrollLeft = scrollLeft - walk;

    // マウスが動いた場合、即座にドラッグ開始とみなす
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  // カーソルスタイルを動的に設定する関数
  const getCursorStyle = () => {
    if (isDragging) return 'grabbing';
    if (isMouseDown) return 'grab';
    return 'default';
  };


  return (
    <>
      {/* {loading && <HorizontailCalendarLoadingBar />} */}
      {/* 日付選択 */}
      <div className={styles.dateSelecter}>
        <select value={selectedYear} onChange={handleYearChange}>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
        <span></span>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {monthOptions.map((month) => (
            <option key={month} value={month}>
              {month + 1}月
            </option>
          ))}
        </select>
        <span></span>
      </div>

      {/* 表 */}
      <SimpleBar className={`${styles.calendarContainer} calendarSimpleBar`} ref={simpleBarRef}>
        <div
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ cursor: getCursorStyle() }}// ハンドに変更する。
        >
          <table className={styles.calendarTable}>
            <thead className={styles.tHead}>
              <tr>
                <th className={styles.employeeHeader}>{selectedYear}年{selectedMonth + 1}月</th>
                {calendarData.map((day, index) => (
                  <th key={index} className={styles.dateHeader}>
                    <p className={styles.dateHeaderDate}>
                      {day.date}
                    </p>
                    <p className={styles.dateHeaderDay}>
                      <span style={{ color: day.day === "日" ? "red" : "inherit" }}>{day.day}</span>
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assignLists.reduce<{ employee: string }[]>((acc, assign) => {
                if (!acc.some((item) => item.employee === assign.employee)) {
                  acc.push({ employee: assign.employee });
                }
                return acc;
              }, []).map((employeeData, empIndex) => (
                <tr key={empIndex}>
                  <td className={styles.employeeName}>{employeeData.employee}</td>
                  {calendarData.map((day, dayIndex) => {
                    const assignments = getAssignmentsForDay(employeeData.employee, day.date);
                    return (
                      <td key={dayIndex} className={styles.assignmentCell}>
                        {assignments.map((assignment: Assign, assignIndex) => (
                          <div key={assignIndex} className={styles.assignment} onClick={(e) => handleClick(e, assignment)}>
                            {assignment.client}
                          </div>
                        ))}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SimpleBar>

      {/* モーダル */}
      {modalControl && modalData && (
        <>
          <div className={styles.modal} style={{ top: `${modalPosition.top}px`, left: `${modalPosition.left}px`, position: "absolute" }} onClick={closeModal} >
            <div className={styles.modalContent}>
              <div className={styles.header}>
                <h2 className={styles.title}>{modalData.client}</h2>
              </div>
              <div className={styles.content}>
                <p className={styles.date}>配属期間：{formatDate(modalData.since)} 〜 {formatDate(modalData.until)}</p>
                <p className={styles.date}>担当者：{modalData.employee}</p>
                <p className={styles.description}>{modalData.description}</p>
              </div>
              <div className={styles.footer}>
                <button className={styles.button}>閉じる</button>
                {userAuth.admin && (
                  <button onClick={(_id) => handleDelete(modalData._id)} className={styles.deleteButton}>削除する</button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default HorizontalCalendar;