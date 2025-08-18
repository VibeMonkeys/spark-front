import React from 'react'

// 사용자 이름의 첫 글자를 추출하는 함수
const getInitial = (name?: string) => {
  if (!name || name.trim() === '') return '?'
  return name.trim().charAt(0).toUpperCase()
}

// 연한 회색으로 고정된 색상을 반환하는 함수
const getConsistentColor = (name?: string) => {
  // 모든 경우에 연한 회색으로 통일
  return 'bg-gray-200'
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, style, className, ...rest } = props
  
  // alt 텍스트에서 사용자 이름 추출 (대부분 사용자 이름이 들어있음)
  const userName = alt || ''
  const initial = getInitial(userName)
  const bgColor = getConsistentColor(userName)
  
  // 항상 첫 글자 아바타를 사용
  return (
    <div
      className={`inline-flex items-center justify-center text-gray-600 font-bold text-lg ${bgColor} ${className ?? ''}`}
      style={style}
      {...rest}
    >
      {initial}
    </div>
  )
}
