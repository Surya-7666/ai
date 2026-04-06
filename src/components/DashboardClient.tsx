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

    // 🔥 NEW STATES
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState({
        businessName: false,
        supportEmail: false,
        knowledge: false
    })

    // 🔥 EMAIL VALIDATION
    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    // 🔥 LIVE VALIDATION
    useEffect(() => {
        setFieldErrors({
            businessName: !businessName.trim(),
            supportEmail: !supportEmail.trim() || !isValidEmail(supportEmail),
            knowledge: !knowledge.trim()
        })
    }, [businessName, supportEmail, knowledge])

    const isFormValid =
        businessName.trim() &&
        supportEmail.trim() &&
        knowledge.trim() &&
        isValidEmail(supportEmail)

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

    // 🔥 UPDATED EMBED CLICK
    const handleEmbedClick = async () => {
        if (!isFormValid) {
            setError("⚠️ Please fill all fields correctly before proceeding.")
            return
        }

        setError("")
        setLoading(true)

        try {
            // ✅ AUTO SAVE BEFORE REDIRECT
            await axios.post("/api/settings", { ownerId, businessName, supportEmail, knowledge })
            navigate.push("/embed")
        } catch (err) {
            console.log(err)
        } finally {
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

                            {/* 🔥 DISABLED BUTTON */}
                            <button
                                onClick={handleEmbedClick}
                                disabled={!isFormValid || loading}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition
                                ${isFormValid ? "bg-green-500 hover:opacity-90" : "bg-gray-500 cursor-not-allowed"}`}
                            >
                                {loading ? "Processing..." : "Embed"}
                            </button>

                        </div>
                    </div>
                </div>
            </motion.div>

            <div className='flex justify-center px-4 pt-32 pb-20'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`w-full max-w-3xl p-10 rounded-2xl ${themeStyles.glass}`}
                >

                    <div className='mb-10'>
                        <h1 className='text-2xl font-semibold'>Chatbot Configuration</h1>
                        <p className={`text-sm ${themeStyles.sub} mt-2`}>
                            Define how your AI responds using your business data.
                        </p>
                    </div>

                    {/* 🔥 ERROR MESSAGE */}
                    {error && (
                        <div className="mb-6 text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className='mb-10'>
                        <h2 className='text-lg font-medium mb-4'>Business Details</h2>
                        <div className='space-y-4'>
                            <input
                                type="text"
                                placeholder='Business Name'
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl text-sm outline-none ${themeStyles.glass}
                                ${fieldErrors.businessName ? "border-red-500" : ""}`}
                            />
                            <input
                                type="text"
                                placeholder='Support Email'
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl text-sm outline-none ${themeStyles.glass}
                                ${fieldErrors.supportEmail ? "border-red-500" : ""}`}
                            />
                        </div>
                    </div>

                    <div className='mb-10'>
                        <h2 className='text-lg font-medium mb-4'>Knowledge Base</h2>

                        <textarea
                            value={knowledge}
                            onChange={(e) => setKnowledge(e.target.value)}
                            className={`w-full h-52 px-4 py-3 rounded-xl text-sm outline-none ${themeStyles.glass}
                            ${fieldErrors.knowledge ? "border-red-500" : ""}`}
                        />
                    </div>

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