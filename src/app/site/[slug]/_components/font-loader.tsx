'use client'

import { useEffect } from 'react'

export function FontLoader({ fontUrl }: { fontUrl: string }) {
    useEffect(() => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = fontUrl
        document.head.appendChild(link)
    }, [fontUrl])

    return null
}