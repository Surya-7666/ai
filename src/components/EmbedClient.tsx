'use client'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"

function EmbedClient({ ownerId }: { ownerId: string }) {

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

    // ✅ MATCHING YOUR FINAL THEME
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

    const [copied, setCopied] = useState(false)

    const embedCode = `<script src="${process.env.NEXT_PUBLIC_APP_URL}/chatBot.js" data-owner-id="${ownerId}"></script>`

    const copyCode = () => {
        navigator.clipboard.writeText(embedCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`min-h-screen transition-all duration-500 ${themeStyles.bg} ${themeStyles.text}`}>

            {/* 🔥 UPDATED NAVBAR */}
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
                                onClick={() => navigate.push("/dashboard")}
                                className='px-5 py-2 rounded-full bg-green-500 text-sm font-medium hover:opacity-90 transition'
                            >
                                Dashboard
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
                    className={`w-full max-w-4xl p-10 rounded-2xl ${themeStyles.glass}`}
                >

                    <h1 className='text-2xl font-semibold mb-2'>Embed Your Chatbot</h1>
                    <p className={`text-sm ${themeStyles.sub} mb-6`}>
                        Add this script to your website and launch AI support instantly.
                    </p>

                    {/* CODE BLOCK */}
                    <div className='relative rounded-xl p-5 text-sm font-mono mb-10 bg-black text-green-400 border border-white/10'>
                        <pre className='overflow-x-auto'>{embedCode}</pre>
                        <button
                            onClick={copyCode}
                            className='absolute top-3 right-3 text-xs px-3 py-1.5 rounded-lg bg-green-500 text-black hover:opacity-90'
                        >
                            {copied ? "Copied ✓" : "Copy"}
                        </button>
                    </div>

                    {/* STEPS */}
                    <ol className={`space-y-3 text-sm ${themeStyles.sub} list-decimal list-inside`}>
                        <li>Copy the script</li>
                        <li>Paste before &lt;/body&gt;</li>
                        <li>Reload your website</li>
                    </ol>

                    {/* PREVIEW */}
                    <div className='mt-14'>
                        <h2 className='text-lg font-medium mb-2'>Live Preview</h2>
                        <p className={`text-sm ${themeStyles.sub} mb-6`}>
                            How it appears on your website
                        </p>

                        <div className={`rounded-xl overflow-hidden ${themeStyles.glass}`}>

                            <div className='flex items-center gap-2 px-4 h-9 border-b border-white/10'>
                                <span className='w-2.5 h-2.5 rounded-full bg-red-400' />
                                <span className='w-2.5 h-2.5 rounded-full bg-yellow-400' />
                                <span className='w-2.5 h-2.5 rounded-full bg-green-400' />
                                <span className={`ml-4 text-xs ${themeStyles.sub}`}>yourwebsite.com</span>
                            </div>

                            <div className={`relative h-64 p-6 text-sm ${themeStyles.sub}`}>

                                Your website content

                                <div className={`absolute bottom-24 right-6 w-64 rounded-xl overflow-hidden ${themeStyles.glass}`}>
                                    <div className='bg-green-500 text-white text-xs px-3 py-2 flex justify-between'>
                                        <span>Support</span>
                                        <span>×</span>
                                    </div>

                                    <div className='p-3 space-y-2'>
                                        <div className='bg-white/10 px-3 py-2 rounded-lg text-xs'>Hi, how can I help?</div>
                                        <div className='bg-green-500 text-white px-3 py-2 rounded-lg text-xs ml-auto'>Return policy?</div>
                                    </div>
                                </div>

                                <motion.div
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ repeat: Infinity, duration: 2.5 }}
                                    className='absolute bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl'
                                >
                                    🤖
                                </motion.div>

                            </div>
                        </div>

                    </div>

                </motion.div>
            </div>
        </div>
    )
}

export default EmbedClient