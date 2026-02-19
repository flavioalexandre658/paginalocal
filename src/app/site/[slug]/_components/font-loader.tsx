'use client'

import { useEffect } from 'react'

export function FontLoader({
    fontUrl,
    id = 'dynamic-font',
    onLoadedClass = 'font-loaded',
}: {
    fontUrl: string
    id?: string
    onLoadedClass?: string
}) {
    useEffect(() => {
        if (!fontUrl) return

        // reutiliza se já existe
        let link = document.getElementById(id) as HTMLLinkElement | null

        if (!link) {
            link = document.createElement('link')
            link.id = id
            link.rel = 'stylesheet'
            link.href = fontUrl
            link.crossOrigin = 'anonymous'
            document.head.appendChild(link)
        } else if (link.href !== fontUrl) {
            link.href = fontUrl
        }

        const handleLoad = async () => {
            // tenta aguardar as fontes realmente “prontas”
            try {
                // isso ajuda quando o CSS carrega mas a fonte ainda está baixando
                await (document as any).fonts?.ready
            } catch { }
            document.documentElement.classList.add(onLoadedClass)
        }

        const handleError = () => {
            // se falhar, garanta que não fica “no limbo”
            document.documentElement.classList.remove(onLoadedClass)
        }

        link.addEventListener('load', handleLoad)
        link.addEventListener('error', handleError)

        return () => {
            link?.removeEventListener('load', handleLoad)
            link?.removeEventListener('error', handleError)
            // opcional: não remover para evitar re-download ao navegar
            // link?.remove()
        }
    }, [fontUrl, id, onLoadedClass])

    return null
}
