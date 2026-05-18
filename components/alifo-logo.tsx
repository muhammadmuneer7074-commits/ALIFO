"use client"

import { motion } from "framer-motion"

export function AlifoLogo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-16 h-16",
    default: "w-32 h-32",
    large: "w-48 h-48"
  }

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]} ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <img 
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-05-17%20at%206.58.14%20PM%20%281%29-4GEBUV0IB4I1oaWY9vp3g1hCyDhPnt.jpeg"
        alt="ALIFO AI Logo"
        className="w-full h-full object-contain"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-transparent to-cyan-500/20 rounded-full blur-xl -z-10" />
    </motion.div>
  )
}
