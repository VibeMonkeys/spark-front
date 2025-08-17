import React from 'react'

// 사용자 이름의 첫 글자를 추출하는 함수
const getInitial = (name?: string) => {
  if (!name || name.trim() === '') return '?'
  return name.trim().charAt(0).toUpperCase()
}

// 일관된 색상을 생성하는 함수
const getConsistentColor = (name?: string) => {
  if (!name) return 'bg-gray-500'
  
  const colors = [
    'bg-blue-500',
    'bg-green-500', 
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500'
  ]
  
  // 이름을 기반으로 해시값 생성
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % colors.length
  return colors[index]
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
      className={`inline-flex items-center justify-center text-white font-semibold ${bgColor} ${className ?? ''}`}
      style={style}
      {...rest}
    >
      {initial}
    </div>
  )
}
