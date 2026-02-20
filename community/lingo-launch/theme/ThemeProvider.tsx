'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type Theme = 'light' | 'dark'

const ThemeContext = createContext({
    theme: 'light' as Theme,
    toggleTheme: () => { }
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<Theme>("light")

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme || 'light'
        setTheme(savedTheme)
    }, [])

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)