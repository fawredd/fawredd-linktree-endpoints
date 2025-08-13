'use client'
import { createContext, useState } from 'react'

interface MyContextType {
  heroImageURL: string
  setHeroImageURL: (url: string) => void
  logoImageUrl: string
  setLogoImageUrl: (url: string) => void
}

export const TheContext = createContext<MyContextType>({
  heroImageURL: '/heroImage.jpg',
  setHeroImageURL: () => {},
  logoImageUrl: '/fawreddProfileImage.jpeg',
  setLogoImageUrl: () => {},
})


export default function GeneralContext({children}: {children: React.ReactNode}) {
  const [heroImageURL, setHeroImageURL] = useState('')
  const [logoImageUrl, setLogoImageUrl] = useState('')

  return (
    <TheContext.Provider value={{
      heroImageURL,
      setHeroImageURL,
      logoImageUrl,
      setLogoImageUrl
    }}>
      {children}
    </TheContext.Provider>
  )
}