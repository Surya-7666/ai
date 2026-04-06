'use client'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion"
import axios from 'axios'
import { useRouter } from 'next/navigation'

function HomeClient({ email }: { email: string }) {

    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
        if (savedTheme) setTheme(savedTheme)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

    const [loading, setLoading] = useState(false)
    const handleLogin = () => {
        setLoading(true)
        window.location.href = "/api/auth/login"
    }

    const firstLetter = email ? email[0].toUpperCase() : ""
    const [open, setOpen] = useState(false)
    const popupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const navigate = useRouter()

    const features = [
        { title: "Instant Setup", desc: "Deploy in minutes without complexity." },
        { title: "Precision AI", desc: "Answers powered by your own data." },
        { title: "Always Available", desc: "Support that never sleeps." }
    ]

    const handleLogOut = async () => {
        try {
            await axios.get("/api/auth/logout")
            window.location.href = "/"
        } catch (error) {
            console.log(error)
        }
    }

    const themeStyles = theme === 'dark'
        ? {
            bg: 'bg-[#0f0f0f]',
            text: 'text-[#f5f5f5]',
            glass: 'bg-white/5 border border-white/10 backdrop-blur-xl',
            sub: 'text-zinc-400'
        }
        : {
            bg: 'bg-gradient-to-br from-white to-green-50',
            text: 'text-zinc-900',
            glass: 'bg-white/70 border border-green-200 backdrop-blur-xl',
            sub: 'text-zinc-600'
        }

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const rotateX = useSpring(y, { stiffness: 100, damping: 20 })
    const rotateY = useSpring(x, { stiffness: 100, damping: 20 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const mouseX = e.clientX - centerX
        const mouseY = e.clientY - centerY

        x.set(mouseX / 20)
        y.set(-mouseY / 20)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <div className={`min-h-screen transition-all duration-700 overflow-hidden ${themeStyles.bg} ${themeStyles.text}`}>

            {/* 🔥 NEW NAVBAR */}
            <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-4 left-0 right-0 z-50"
            >
                
                <div className="max-w-6xl mx-auto px-4">
                    <div className={`flex items-center justify-between px-6 py-3 rounded-2xl shadow-lg ${themeStyles.glass}`}>

                        {/* LOGO */}
                        <h1 className='text-3xl  font-semibold tracking-wide'>
                            Nexo<span className='text-green-500'>ra</span>
                        </h1>

                        {/* RIGHT SIDE */}
                        <div className='flex items-center gap-4'>

                            {/* TOGGLE */}
                            <div
                                onClick={toggleTheme}
                                className="w-14 h-7 flex items-center bg-zinc-700 rounded-full p-1 cursor-pointer"
                            >
                                <motion.div
                                    animate={{ x: theme === 'dark' ? 24 : 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className="w-5 h-5 bg-white rounded-full shadow-md"
                                />
                            </div>

                            {/* USER / LOGIN */}
                            {email ? (
                                <div className='relative' ref={popupRef}>
                                    <button
                                        onClick={() => setOpen(!open)}
                                        className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-semibold'
                                    >
                                        {firstLetter}
                                    </button>

                                    <AnimatePresence>
                                        {open && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className={`absolute right-0 mt-3 w-44 rounded-xl ${themeStyles.glass}`}
                                            >
                                                <button className='w-full  px-4 py-3 text-sm text-left hover:bg-white/10' onClick={() => navigate.push("/dashboard")}>Dashboard</button>
                                                <button className='w-full px-4 py-3 text-sm text-red-400 text-left hover:bg-white/10' onClick={handleLogOut}>Logout</button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button
                                    onClick={handleLogin}
                                    className='px-6 py-2 rounded-full bg-green-500 text-sm font-medium hover:opacity-90 transition'
                                >
                                    {loading ? "Loading..." : "Login"}
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </motion.div>

            {/* HERO */}
            <section className='relative pt-40 pb-28 px-6'>
                {/* Decorative Background Element */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-125 h-125 bg-green-500/10 blur-[120px] rounded-full -z-10" />
                
                <div className='max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center'>

                    <motion.div 
                        initial={{ opacity: 0, x: -40 }} 
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.h1 
                            className='text-5xl md:text-6xl font-bold leading-tight'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Intelligent Support
                            <span className='block text-green-500 mt-2 bg-clip-text'>
                                Designed for Growth
                            </span>
                        </motion.h1>

                        <motion.p 
                            className={`mt-6 text-lg max-w-lg ${themeStyles.sub}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Build a smarter customer experience with AI that understands your business. No complex coding required.
                        </motion.p>

                        <motion.div 
                            className='mt-10 flex items-center gap-6'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <button
                                onClick={() => email ? navigate.push("/dashboard") : handleLogin()}
                                className='px-8 py-4 rounded-xl bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 text-white font-semibold transition-all active:scale-95'
                            >
                                {email ? "Go to Dashboard" : "Get Started Free"}
                            </button>
                            <div className="hidden sm:flex items-center gap-2 text-sm font-medium opacity-70">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                100+ active bots today
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        style={{ rotateX, rotateY, transformPerspective: 1000 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className={`relative p-8 rounded-3xl ${themeStyles.glass} shadow-2xl`}
                    >
                        {/* Mockup Header */}
                        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            <div className={`ml-4 text-xs font-mono ${themeStyles.sub}`}>nexora-ai-preview.js</div>
                        </div>

                        <div className='space-y-4'>
                            <motion.div
                                initial={{ x: 40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className='ml-auto bg-green-500 text-white px-5 py-3 rounded-2xl rounded-tr-sm text-sm shadow-md'
                            >
                                Do you support COD?
                            </motion.div>

                            <motion.div
                                initial={{ x: -40, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.8, duration: 0.5 }}
                                className='bg-zinc-800/50 border border-white/5 px-5 py-3 rounded-2xl rounded-tl-sm text-sm'
                            >
                                <span className="text-green-400 font-bold mr-2">Nexora:</span>
                                Yes, we support Cash on Delivery for all domestic orders!
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.5 }}
                                className="flex justify-center pt-4"
                            >
                                <span className={`text-[10px] uppercase tracking-widest font-bold opacity-30`}>AI is typing...</span>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* FEATURES */}
            <section className='py-24 px-6'>
                <div className='max-w-7xl mx-auto grid md:grid-cols-3 gap-10'>
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className={`p-8 rounded-2xl ${themeStyles.glass}`}
                        >
                            <h3 className='font-semibold text-lg'>{f.title}</h3>
                            <p className={`text-sm mt-2 ${themeStyles.sub}`}>{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
            <section className='py-24 px-6'>
  <div className='max-w-6xl mx-auto text-center'>
    <h2 className='text-3xl font-semibold'>How It Works</h2>

    <div className='mt-16 grid md:grid-cols-3 gap-10'>

      {[
        { title: "Connect", desc: "Integrate our script into your website easily." },
        { title: "Train", desc: "Add your business knowledge and FAQs." },
        { title: "Deploy", desc: "Your AI starts helping customers instantly." }
      ].map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
          className={`p-8 rounded-2xl ${themeStyles.glass}`}
        >
          <h3 className='font-semibold text-lg text-green-500'>{step.title}</h3>
          <p className={`text-sm mt-2 ${themeStyles.sub}`}>{step.desc}</p>
        </motion.div>
      ))}

    </div>
  </div>
</section>
            <section className='py-24 px-6'>
                <div className="text-center mb-16">
  <h2 className="text-3xl font-semibold">
    Trusted by Growing Businesses
  </h2>
  <p className="mt-3 text-sm text-zinc-400">
    Powering thousands of conversations with reliable AI support.
  </p>
</div>
  <div className='max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center'>

    {[
      { num: "10K+", label: "Conversations Handled" },
      { num: "99.9%", label: "Uptime Reliability" },
      { num: "24/7", label: "AI Availability" }
    ].map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2 }}
        className={`p-8 rounded-2xl ${themeStyles.glass}`}
      >
        <h2 className='text-3xl font-bold text-green-500'>{item.num}</h2>
        <p className={`mt-2 text-sm ${themeStyles.sub}`}>{item.label}</p>
      </motion.div>
    ))}

  </div>
</section>

<section className='py-28 px-6 text-center'>
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    className={`max-w-3xl mx-auto p-12 rounded-2xl ${themeStyles.glass}`}
  >
    <h2 className='text-3xl font-bold'>
      Ready to Upgrade Your Support?
    </h2>

    <p className={`mt-4 ${themeStyles.sub}`}>
      Start building smarter customer experiences with Nexora AI today.
    </p>

    <button
      onClick={() => email ? navigate.push("/dashboard") : handleLogin()}
      className='mt-8 px-10 py-4 rounded-lg bg-green-500 text-white font-medium hover:opacity-90 transition'
    >
      Get Started Now
    </button>
  </motion.div>
</section>  

            <footer className={`py-10 text-center ${themeStyles.sub}`}>
                © {new Date().getFullYear()} Nexora. All rights reserved.
            </footer>
        </div>
    )
}

export default HomeClient