'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import axios from 'axios'

function DashboardClient({ ownerId }: { ownerId: string }) {
    const navigate = useRouter()

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

    // ✅ MATCH YOUR FINAL THEME
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

    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setSupportEmail] = useState("")
    const [knowledge, setKnowledge] = useState("")
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    const handleSettings = async () => {
        setLoading(true)
        try {
            await axios.post("/api/settings", { ownerId, businessName, supportEmail, knowledge })
            setLoading(false)
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (ownerId) {
            const handleGetDetails = async () => {
                try {
                    const result = await axios.post("/api/settings/get", { ownerId })
                    setBusinessName(result.data.businessName)
                    setSupportEmail(result.data.supportEmail)
                    setKnowledge(result.data.knowledge)
                } catch (error) {
                    console.log(error)
                }
            }
            handleGetDetails()
        }
    }, [ownerId])

    return (
        <div className={`min-h-screen transition-all duration-500 ${themeStyles.bg} ${themeStyles.text}`}>

            {/* 🔥 MATCHED NAVBAR */}
            <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-4 left-0 right-0 z-50"
            >
                <div className="max-w-6xl mx-auto px-4">
                    <div className={`flex items-center justify-between px-6 py-3 rounded-2xl shadow-lg ${themeStyles.glass}`}>

                        <h1
                            onClick={() => navigate.push("/")}
                            className='cursor-pointer text-3xl font-semibold tracking-wide'
                        >
                            Nexo<span className='text-green-500'>ra</span>
                        </h1>

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

                            <button
                                onClick={() => navigate.push("/embed")}
                                className='px-5 py-2 rounded-full bg-green-500 text-sm font-medium hover:opacity-90 transition'
                            >
                                Embed
                            </button>

                        </div>
                    </div>
                </div>
            </motion.div>

            {/* MAIN */}
            <div className='flex justify-center px-4 pt-32 pb-20'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`w-full max-w-3xl p-10 rounded-2xl ${themeStyles.glass}`}
                >

                    {/* HEADER */}
                    <div className='mb-10'>
                        <h1 className='text-2xl font-semibold'>Chatbot Configuration</h1>
                        <p className={`text-sm ${themeStyles.sub} mt-2`}>
                            Define how your AI responds using your business data.
                        </p>
                    </div>

                    {/* BUSINESS */}
                    <div className='mb-10'>
                        <h2 className='text-lg font-medium mb-4'>Business Details</h2>
                        <div className='space-y-4'>
                            <input
                                type="text"
                                placeholder='Business Name'
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl text-sm outline-none ${themeStyles.glass}`}
                            />
                            <input
                                type="text"
                                placeholder='Support Email'
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl text-sm outline-none ${themeStyles.glass}`}
                            />
                        </div>
                    </div>

                    {/* KNOWLEDGE */}
                    <div className='mb-10'>
                        <h2 className='text-lg font-medium mb-4'>Knowledge Base</h2>
                        <p className={`text-sm ${themeStyles.sub} mb-4`}>
                            Add FAQs, delivery info, refund policy, and support details.
                        </p>

                        <textarea
                            value={knowledge}
                            onChange={(e) => setKnowledge(e.target.value)}
                            className={`w-full h-52 px-4 py-3 rounded-xl text-sm outline-none ${themeStyles.glass}`}
                            placeholder={`Example:\n• Refund: 7 days\n• Delivery: 3-5 days\n• COD available`}
                        />
                    </div>

                    {/* ACTION */}
                    <div className='flex items-center gap-5'>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSettings}
                            disabled={loading}
                            className='px-7 py-3 rounded-xl bg-green-500 text-white text-sm font-medium hover:opacity-90 transition'
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </motion.button>

                        {saved && (
                            <motion.span
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='text-sm text-green-400'
                            >
                                ✓ Saved successfully
                            </motion.span>
                        )}
                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default DashboardClient