'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion"
import { useRouter } from 'next/navigation'
import axios from 'axios'

function DashboardClient({ ownerId }: { ownerId: string }) {
    const navigate = useRouter()

    const [theme, setTheme] = useState<'dark' | 'light'>('dark')

    const [businessName, setBusinessName] = useState("")
    const [supportEmail, setSupportEmail] = useState("")
    const [knowledge, setKnowledge] = useState("")

    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    // 🔥 NEW: validation error state
    const [error, setError] = useState("")

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
        if (savedTheme) setTheme(savedTheme)
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
    }

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

    // 🔥 NEW: VALIDATION BEFORE REDIRECT
    const handleEmbedClick = () => {
        if (!businessName.trim() || !supportEmail.trim() || !knowledge.trim()) {
            setError("⚠️ Please fill all fields before proceeding to embed.")
            return
        }

        setError("")
        navigate.push("/embed")
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
        <div className={`min-h-screen transition-all duration-500`}>

            {/* NAVBAR */}
            <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-4 left-0 right-0 z-50"
            >
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center justify-between px-6 py-3 rounded-2xl shadow-lg bg-white/10 backdrop-blur-xl">

                        <h1
                            onClick={() => navigate.push("/")}
                            className='cursor-pointer text-3xl font-semibold tracking-wide'
                        >
                            Nexora
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
                                    className="w-5 h-5 bg-white rounded-full"
                                />
                            </div>

                            {/* 🔥 UPDATED BUTTON */}
                            <button
                                onClick={handleEmbedClick}
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
                    className="w-full max-w-3xl p-10 rounded-2xl bg-white/10 backdrop-blur-xl"
                >

                    <h1 className='text-2xl font-semibold mb-6'>Chatbot Configuration</h1>

                    {/* 🔥 ERROR MESSAGE */}
                    {error && (
                        <div className="mb-6 text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className='space-y-4'>
                        <input
                            type="text"
                            placeholder='Business Name'
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl"
                        />

                        <input
                            type="text"
                            placeholder='Support Email'
                            value={supportEmail}
                            onChange={(e) => setSupportEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl"
                        />

                        <textarea
                            value={knowledge}
                            onChange={(e) => setKnowledge(e.target.value)}
                            className="w-full h-40 px-4 py-3 rounded-xl"
                            placeholder='Knowledge base...'
                        />
                    </div>

                    <div className='mt-6 flex gap-4'>
                        <button
                            onClick={handleSettings}
                            className='px-6 py-3 rounded-xl bg-green-500 text-white'
                        >
                            Save
                        </button>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default DashboardClient