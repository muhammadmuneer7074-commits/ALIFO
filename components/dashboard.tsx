"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, 
  Code2, 
  Zap, 
  Bot, 
  Settings, 
  Home,
  Menu,
  X,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatInterface } from "@/components/chat-interface"
import { AlifoLogo } from "@/components/alifo-logo"

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "build", label: "Build", icon: Code2 },
  { id: "automate", label: "Automate", icon: Zap },
  { id: "agents", label: "Agents", icon: Bot },
  { id: "settings", label: "Settings", icon: Settings },
]

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatInterface />
      case "build":
        return <BuildSection />
      case "automate":
        return <AutomateSection />
      case "agents":
        return <AgentsSection />
      case "settings":
        return <SettingsSection />
      default:
        return <HomeSection onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="flex h-screen bg-[#030014]">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-violet-600 text-white"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== "undefined" && window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed lg:relative z-40 w-64 h-full bg-[#0a0a1f] border-r border-violet-500/20 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
              <AlifoLogo size="small" />
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                ALIFO AI
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                    activeTab === item.id
                      ? "bg-violet-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-violet-500/10"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Pro Badge */}
            <div className="p-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="font-semibold text-white">Upgrade to Pro</span>
                </div>
                <p className="text-sm text-slate-400 mb-3">Unlock unlimited features</p>
                <Button className="w-full bg-violet-600 hover:bg-violet-500">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

function HomeSection({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const features = [
    {
      id: "chat",
      icon: MessageSquare,
      title: "Chat with AI",
      description: "Get intelligent answers instantly",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      id: "build",
      icon: Code2,
      title: "Build Anything",
      description: "Generate code and apps",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      id: "automate",
      icon: Zap,
      title: "Automate Workflows",
      description: "Connect apps and actions",
      gradient: "from-orange-500 to-pink-600",
    },
    {
      id: "agents",
      icon: Bot,
      title: "AI Agents",
      description: "Create custom AI assistants",
      gradient: "from-green-500 to-teal-600",
    },
  ]

  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Welcome to ALIFO AI
          </h1>
          <p className="text-slate-400 text-lg">
            Your AI. Your Everything.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <motion.button
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onNavigate(feature.id)}
              className="group relative p-6 rounded-2xl bg-[#0a0a1f] border border-violet-500/20 text-left hover:border-violet-500/50 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-hover:text-violet-400 transition-colors" />
            </motion.button>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="p-4 rounded-xl bg-[#0a0a1f] border border-violet-500/20 text-center">
            <div className="text-2xl font-bold text-violet-400">0</div>
            <div className="text-sm text-slate-400">Chats</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0a1f] border border-violet-500/20 text-center">
            <div className="text-2xl font-bold text-cyan-400">0</div>
            <div className="text-sm text-slate-400">Projects</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0a0a1f] border border-violet-500/20 text-center">
            <div className="text-2xl font-bold text-pink-400">0</div>
            <div className="text-sm text-slate-400">Agents</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function BuildSection() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6">
          <Code2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Build with AI</h2>
        <p className="text-slate-400 mb-6">
          Generate websites, apps, code, and dashboards in seconds using simple instructions.
        </p>
        <Button className="bg-violet-600 hover:bg-violet-500">
          Start Building
        </Button>
      </div>
    </div>
  )
}

function AutomateSection() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mx-auto mb-6">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Automate Workflows</h2>
        <p className="text-slate-400 mb-6">
          Create powerful automations with AI assistance. Connect apps, triggers, and actions effortlessly.
        </p>
        <Button className="bg-violet-600 hover:bg-violet-500">
          Create Automation
        </Button>
      </div>
    </div>
  )
}

function AgentsSection() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mx-auto mb-6">
          <Bot className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Create AI Agents</h2>
        <p className="text-slate-400 mb-6">
          Build custom AI agents for coding, research, marketing, support, and any task you imagine.
        </p>
        <Button className="bg-violet-600 hover:bg-violet-500">
          Create Agent
        </Button>
      </div>
    </div>
  )
}

function SettingsSection() {
  return (
    <div className="h-full overflow-y-auto p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
        
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0a0a1f] border border-violet-500/20">
            <h3 className="font-semibold text-white mb-2">Account</h3>
            <p className="text-slate-400 text-sm">Manage your account settings and preferences</p>
          </div>
          
          <div className="p-4 rounded-xl bg-[#0a0a1f] border border-violet-500/20">
            <h3 className="font-semibold text-white mb-2">Appearance</h3>
            <p className="text-slate-400 text-sm">Customize the look and feel of ALIFO AI</p>
          </div>
          
          <div className="p-4 rounded-xl bg-[#0a0a1f] border border-violet-500/20">
            <h3 className="font-semibold text-white mb-2">API Keys</h3>
            <p className="text-slate-400 text-sm">Manage your API keys and integrations</p>
          </div>
          
          <div className="p-4 rounded-xl bg-[#0a0a1f] border border-violet-500/20">
            <h3 className="font-semibold text-white mb-2">Billing</h3>
            <p className="text-slate-400 text-sm">View and manage your subscription</p>
          </div>
        </div>
      </div>
    </div>
  )
}
