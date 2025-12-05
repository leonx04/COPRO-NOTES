'use client'

import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'
import ReportCard from '@/components/ReportCard'
import AnimatedBackground from '@/components/AnimatedBackground'

interface Report {
  period?: string
  adaptability: string
  adaptability_note: string
  quality: string
  quality_note: string
  responsibility: string
  responsibility_note: string
  communication: string
  communication_note: string
  leadership: string
  leadership_note: string
  documentation: string
  documentation_note: string
  negotiation: string
  negotiation_note: string
  english: string
  english_note: string
  summary: string
  plan: string
  result: string
  desire: string
  preferredCoworkers: string[]
}

interface ReportsData {
  date: string
  name: string
  reports: Report[]
}

export default function Home() {
  const [reports, setReports] = useState<Report[]>([])
  const [reportsData, setReportsData] = useState<ReportsData | null>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/reports')
        const data: ReportsData = await response.json()
        setReportsData(data)
        const sortedReports = [...data.reports].reverse()
        setReports(sortedReports)
      } catch (error) {
        console.error('Error loading reports:', error)
      }
    }
    fetchReports()
  }, [])

  useEffect(() => {
    if (reports.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = cardsRef.current.indexOf(entry.target as HTMLDivElement)
            if (cardIndex !== -1) {
              const cardElement = entry.target as HTMLElement
              cardElement.style.opacity = '0'
              cardElement.style.transform = 'translateY(30px)'
              
              anime({
                targets: cardElement,
                opacity: [0, 1],
                translateY: [30, 0],
                scale: [0.95, 1],
                duration: 800,
                easing: 'easeOutCubic',
                delay: cardIndex * 120,
                complete: () => {
                  cardElement.style.opacity = ''
                  cardElement.style.transform = ''
                }
              })
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        threshold: 0.05,
        rootMargin: '100px',
      }
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card)
      })
    }
  }, [reports])

  return (
    <>
      <AnimatedBackground />
      <div className="container">
        <header className="header">
          <h1>Báo Cáo Tiến Độ</h1>
          {reportsData && (
            <p>{reportsData.name} - {reportsData.date}</p>
          )}
        </header>

        <div className="reports-list">
          {reports.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            reports.map((report, index) => (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el
                }}
              >
                <ReportCard report={report} index={index} />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

