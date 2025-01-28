"use client"

import * as React from "react"
import { Toaster as Sonner } from "sonner"

export function Toaster() {
  return (
    <Sonner 
      className="toaster group" 
      toastOptions={{ duration: 3000 }}
    />
  )
}