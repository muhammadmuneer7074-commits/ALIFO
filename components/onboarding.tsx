"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, MessageSquare, Code2, Zap, Bot, Sparkles, Infinity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AlifoLogo } from "@/components/alifo-logo"

const onboardingSlides = [
  {
    id: 1,
    title: "ALIFO AI",
    subtitle: "Your All-in-One AI Operating System.",
    features: ["Smart", "Powerful", "Limitless"],
    icon: null,
    dark: false,
  },
  {
    id: 2,
    title: "Chat With AI",
    highlight: "Like Never Before",
    description: "Ask anything. Get intelligent, accurate, and instant answers powered by advanced AI models.",
    icon: MessageSquare,
    dark: true,
  },
  {
    id: 3,
    title: "Build Anything",
    highlight: "With AI",
    description: "Generate websites, apps, code, dashboards, and more in seconds using simple instructions.",
    icon: Code2,
    dark: false,
  },
  {
    id: 4,
    title: "Automate Your",
    highlight: "Workflows",
    description: "Create powerful automations with AI assistance. Connect apps, triggers, and actions effortlessly.",
    icon: Zap,
    dark: false,
  },
  {
    id: 5,
    title: "Create Your",
    highlight: "AI Agents",
    description: "Build custom AI agents for coding, research, marketing, support, and any task you imagine.",
    icon: Bot,
    dark: false,
  },
  {
    id: 6,
    title: "The Future",
    highlight: "Is Here",
    description: "ALIFO AI is your intelligent partner for today and the future. Let's build the impossible together.",
    icon: null,
    dark: true,
    final: true,
  },
]

interface OnboardingProps {
  onComplete: () => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const slide = onboardingSlides[currentSlide]

  return (
    <div className={`min-h-screen flex flex-col ${slide.dark ? 'bg-[#030014]' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <span className={`text-sm ${slide.dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {currentSlide + 1}/{onboardingSlides.length}
        </span>
        {currentSlide < onboardingSlides.length - 1 && (
          <button 
            onClick={onComplete}
            className={`text-sm font-medium ${slide.dark ? 'text-violet-400 hover:text-violet-300' : 'text-violet-600 hover:text-violet-700'}`}
          >
            Skip
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            {/* Slide 1: Logo */}
            {currentSlide === 0 && (
              <>
                <AlifoLogo size="large" className="mb-8" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent mb-4">
                  ALIFO AI
                </h1>
                <p className="text-slate-600 text-lg mb-6">{slide.subtitle}</p>
                <div className="flex gap-3 mb-8">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Smart
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Powerful
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm flex items-center gap-1">
                    <Infinity className="w-3 h-3" /> Limitless
                  </span>
                </div>
              </>
            )}

            {/* Slides 2-5: Features */}
            {currentSlide > 0 && currentSlide < 5 && slide.icon && (
              <>
                <div className={`w-32 h-32 rounded-3xl ${slide.dark ? 'bg-[#0a0a1f]' : 'bg-violet-50'} flex items-center justify-center mb-8`}>
                  <slide.icon className={`w-16 h-16 ${slide.dark ? 'text-violet-400' : 'text-violet-600'}`} />
                </div>
                <h2 className={`text-3xl font-bold mb-2 ${slide.dark ? 'text-white' : 'text-slate-800'}`}>
                  {slide.title}
                </h2>
                <h2 className="text-3xl font-bold text-violet-500 mb-4">
                  {slide.highlight}
                </h2>
                <p className={`text-lg leading-relaxed ${slide.dark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {slide.description}
                </p>
              </>
            )}

            {/* Slide 6: Final */}
            {currentSlide === 5 && (
              <>
                <AlifoLogo size="large" className="mb-8" />
                <h2 className="text-3xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                <h2 className="text-3xl font-bold text-violet-500 mb-4">
                  {slide.highlight}
                </h2>
                <p className="text-lg leading-relaxed text-slate-400 mb-8">
                  {slide.description}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-6">
        <Button
          onClick={nextSlide}
          className={`w-full h-14 rounded-full text-lg font-medium ${
            slide.dark 
              ? 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400' 
              : 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400'
          } text-white`}
        >
          {currentSlide === onboardingSlides.length - 1 ? "Let's Go" : "Get Started"}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-violet-500 w-6' 
                  : slide.dark ? 'bg-slate-600' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
