"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlifoLogo } from "@/components/alifo-logo"
import { Onboarding } from "@/components/onboarding"
import { Dashboard } from "@/components/dashboard"
import { AnimatedBackground } from "@/components/animated-background"

export default function HomePage() {
  const [appState, setAppState] = useState<"splash" | "onboarding" | "dashboard">("splash")

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem("alifo-onboarding-complete")
    
    // Show splash for 3 seconds
    const splashTimer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        setAppState("dashboard")
      } else {
        setAppState("onboarding")
      }
    }, 3000)

    return () => clearTimeout(splashTimer)
  }, [])

  const handleOnboardingComplete = () => {
    localStorage.setItem("alifo-onboarding-complete", "true")
    setAppState("dashboard")
  }

  return (
    <AnimatePresence mode="wait">
      {appState === "splash" && (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SplashScreen />
        </motion.div>
      )}
      
      {appState === "onboarding" && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Onboarding onComplete={handleOnboardingComplete} />
        </motion.div>
      )}
      
      {appState === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-screen"
        >
          <Dashboard />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SplashScreen() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mb-8"
      >
        <AlifoLogo size="large" />
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-4">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            ALIFO AI
          </span>
        </h1>
        <p className="text-slate-400 text-lg">Your AI. Your Everything.</p>
      </motion.div>

      {/* Loading spinner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-20 z-10 flex flex-col items-center"
      >
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4" />
        <span className="text-slate-500 text-sm">Loading...</span>
      </motion.div>
    </div>
  )
}
