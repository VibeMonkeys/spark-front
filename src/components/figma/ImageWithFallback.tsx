import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Array of cute default profile images
const DEFAULT_PROFILE_IMAGES = [
  'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=150&h=150&fit=crop&crop=center', // cute dog
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&crop=center', // cute cat
  'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop&crop=center', // hamster
  'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=150&h=150&fit=crop&crop=center', // rabbit
  'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=150&h=150&fit=crop&crop=center', // bird
  'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=150&h=150&fit=crop&crop=center', // panda
]

// Generate consistent random index based on user ID or alt text
const getRandomProfileImage = (identifier?: string) => {
  if (!identifier) {
    return DEFAULT_PROFILE_IMAGES[0]
  }
  
  // Simple hash function to get consistent random index
  let hash = 0
  for (let i = 0; i < identifier.length; i++) {
    const char = identifier.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % DEFAULT_PROFILE_IMAGES.length
  return DEFAULT_PROFILE_IMAGES[index]
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, ...rest } = props
  
  // Get random profile image based on alt text (which often contains user name/id)
  const defaultImage = getRandomProfileImage(alt)
  
  // Use default profile image if src is empty/null or if there was an error
  const imageSrc = (!src || src.trim() === '' || didError) ? defaultImage : src

  return didError && (!src || src.trim() === '') ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={defaultImage} alt={alt || "Profile"} className={className} style={style} {...rest} />
      </div>
    </div>
  ) : (
    <img src={imageSrc} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  )
}
