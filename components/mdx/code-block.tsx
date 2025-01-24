'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
}

const getLanguageIcon = (language?: string) => {
  const icons: Record<string, string> = {
    typescript: '📘',
    javascript: '📒',
    python: '🐍',
    rust: '⚙️',
    default: '📄'
  }
  return icons[language?.toLowerCase() || ''] || icons.default
}

export function CodeBlock({ children, className, language }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle scroll in maximized mode
  useEffect(() => {
    if (isMaximized) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMaximized])

  const handleClose = () => {
    containerRef.current?.remove()
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    setIsMaximized(false)
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    setIsMinimized(false)
  }

  const copyToClipboard = async () => {
    if (preRef.current) {
      await navigator.clipboard.writeText(preRef.current.textContent || '')
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  if (isMinimized) return null

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative my-6 group",
        isMaximized && "fixed inset-4 z-50 bg-zinc-900/95 backdrop-blur-sm",
        "rounded-lg overflow-hidden border border-zinc-800"
      )}
    >
      {/* Window Controls */}
      <div className="flex items-center px-4 py-3 bg-zinc-800/90 border-b border-zinc-700">
        <div className="flex gap-2">
          <button 
            onClick={handleClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
          />
          <button
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
          />
          <button
            onClick={handleMaximize}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
          />
        </div>
        <div className="flex-1 text-center text-xs text-zinc-400">
          {language || 'code'}
        </div>
        <button
          onClick={copyToClipboard}
          className="text-xs text-zinc-400 hover:text-zinc-300"
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Code Container */}
      <div 
        className={cn(
          "transition-all duration-300 origin-top",
          isMinimized ? "h-0" : "h-auto",
          isMaximized && "overflow-auto max-h-[calc(100vh-8rem)]"
        )}
      >
        <div className="relative bg-zinc-900 flex">
          {/* Line Numbers */}
          <div className="flex-none w-[50px] py-4 bg-zinc-800/50 select-none">
            {children.split('\n').map((_, i) => (
              <div 
                key={i} 
                className="text-xs text-zinc-500 text-center leading-relaxed"
              >
                {i + 1}
              </div>
            ))}
          </div>

          {/* Code Content */}
          <div className="flex-1 min-w-0 overflow-x-auto">
            <pre
              ref={preRef}
              className={cn(
                "p-4",
                "text-zinc-50",
                "font-mono text-sm leading-relaxed",
                className
              )}
            >
              <code>{children}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}