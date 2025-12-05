'use client'

import { useEffect, useRef, useState } from 'react'
import anime from 'animejs'

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

interface ReportCardProps {
  report: Report
  index: number
}

const getRatingValue = (rating: string): number => {
  const ratingMap: Record<string, number> = {
    'Tốt': 4,
    'Khá': 3,
    'Trung bình': 2,
    'Yếu': 1,
    'Cần cải thiện': 1,
  }
  return ratingMap[rating] || 2
}

const getRatingBadgeClass = (rating: string): string => {
  const badgeMap: Record<string, string> = {
    'Tốt': 'badge-tot',
    'Khá': 'badge-kha',
    'Trung bình': 'badge-trung-binh',
    'Yếu': 'badge-can-cai-thien',
    'Cần cải thiện': 'badge-can-cai-thien',
  }
  return badgeMap[rating] || 'badge-trung-binh'
}

const getRatingColor = (rating: string): string => {
  const colorMap: Record<string, string> = {
    'Tốt': '#10b981',
    'Khá': '#3b82f6',
    'Trung bình': '#f59e0b',
    'Yếu': '#ef4444',
    'Cần cải thiện': '#ef4444',
  }
  return colorMap[rating] || '#64748b'
}

export default function ReportCard({ report, index }: ReportCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)
  const ratingBarsRef = useRef<(HTMLDivElement | null)[]>([])

  const criteria = [
    { key: 'adaptability', label: 'Thích ứng' },
    { key: 'quality', label: 'Chất lượng' },
    { key: 'responsibility', label: 'Trách nhiệm' },
    { key: 'communication', label: 'Giao tiếp' },
    { key: 'leadership', label: 'Lãnh đạo' },
    { key: 'documentation', label: 'Tài liệu' },
    { key: 'negotiation', label: 'Đàm phán' },
    { key: 'english', label: 'Tiếng Anh' },
  ]

  useEffect(() => {
    if (isExpanded && detailsRef.current) {
      anime({
        targets: detailsRef.current,
        maxHeight: [0, detailsRef.current.scrollHeight],
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutCubic',
      })
    } else if (!isExpanded && detailsRef.current) {
      anime({
        targets: detailsRef.current,
        maxHeight: [detailsRef.current.scrollHeight, 0],
        opacity: [1, 0],
        duration: 400,
        easing: 'easeInCubic',
      })
    }
  }, [isExpanded])

  useEffect(() => {
    const timer = setTimeout(() => {
      ratingBarsRef.current.forEach((bar, idx) => {
        if (bar) {
          const rating = criteria[idx]?.key
          if (rating) {
            const value = getRatingValue(report[rating as keyof Report] as string)
            const width = (value / 4) * 100
            
            const currentWidth = bar.style.width || '0%'
            bar.style.width = currentWidth
            
            anime({
              targets: bar,
              width: [currentWidth, `${width}%`],
              duration: 800,
              delay: idx * 50,
              easing: 'easeOutCubic',
            })
          }
        }
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const toggleDetails = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="report-card">
      <div className="card-header">
        <div className="card-title">
          <h2>Báo Cáo Đánh Giá</h2>
          <span className="date">Mốc thời gian: {report.period || new Date().toLocaleDateString('vi-VN')}</span>
        </div>
        <button className="toggle-button" onClick={toggleDetails}>
          <span>{isExpanded ? 'Thu gọn' : 'Xem chi tiết'}</span>
        </button>
      </div>

      <div className="rating-grid">
        {criteria.map((criterion, idx) => {
          const rating = report[criterion.key as keyof Report] as string
          const value = getRatingValue(rating)
          const width = (value / 4) * 100

          return (
            <div key={criterion.key} className="rating-item">
              <span className="rating-label">{criterion.label}</span>
              <div className="rating-bar-container">
                <div
                  ref={(el) => {
                    ratingBarsRef.current[idx] = el
                  }}
                  className="rating-bar"
                  style={{
                    width: `${width}%`,
                    backgroundColor: getRatingColor(rating),
                  }}
                />
              </div>
              <span className={`rating-badge ${getRatingBadgeClass(rating)}`}>
                {rating}
              </span>
            </div>
          )
        })}
      </div>

      <div
        ref={detailsRef}
        className={`card-details ${isExpanded ? 'open' : ''}`}
      >
        <div className="detail-section">
          <h3>Tóm tắt</h3>
          <p>{report.summary}</p>
        </div>

        <div className="detail-section">
          <h3>Kết quả đạt được</h3>
          <p>{report.result}</p>
        </div>

        <div className="detail-section">
          <h3>Kế hoạch</h3>
          <p>{report.plan}</p>
        </div>

        <div className="detail-section">
          <h3>Nguyện vọng</h3>
          <p>{report.desire}</p>
        </div>

        <div className="detail-section">
          <h3>Chi tiết đánh giá</h3>
          <ul>
            {criteria.map((criterion) => {
              const noteKey = `${criterion.key}_note` as keyof Report
              const note = report[noteKey] as string
              return (
                <li key={criterion.key}>
                  <strong>{criterion.label}:</strong> {note}
                </li>
              )
            })}
          </ul>
        </div>

        {report.preferredCoworkers && report.preferredCoworkers.length > 0 && (
          <div className="detail-section">
            <h3>Đồng nghiệp ưa thích</h3>
            <div className="coworkers-list">
              {report.preferredCoworkers.map((coworker, idx) => (
                <span key={idx} className="coworker-tag">
                  {coworker}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

