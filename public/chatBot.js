(function () {

  const api_Url = "https://ai-ten-nu-93.vercel.app/api/chat"

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id")

  if (!ownerId) {
    console.log("owner id not found")
    return
  }

  // 🔥 THEME TOKENS (portfolio palette)
  const THEME = {
    primaryGreen: "#5B8C3B",
    secondaryGreen: "#88B85C",
    background: "#F8F8F2",
    lightBackground: "#EEF4E6",
    border: "#C9D9B7",
    text: "#355322",
    shadow: "rgba(91,140,59,.18)"
  }

  // 🔥 GLOBAL STYLES (animations, scrollbar, fonts) — injected once
  const styleTag = document.createElement("style")
  styleTag.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    @keyframes surya-pulse {
      0% { box-shadow: 0 0 0 0 ${THEME.shadow}; }
      70% { box-shadow: 0 0 0 16px rgba(91,140,59,0); }
      100% { box-shadow: 0 0 0 0 rgba(91,140,59,0); }
    }

    @keyframes surya-fade-scale-in {
      0% { opacity: 0; transform: translateY(16px) scale(0.94); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    @keyframes surya-fade-scale-out {
      0% { opacity: 1; transform: translateY(0) scale(1); }
      100% { opacity: 0; transform: translateY(16px) scale(0.94); }
    }

    @keyframes surya-slide-up {
      0% { opacity: 0; transform: translateY(10px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes surya-blink {
      0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
      40% { opacity: 1; transform: translateY(-3px); }
    }

    #surya-chat-messages::-webkit-scrollbar {
      width: 7px;
    }
    #surya-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }
    #surya-chat-messages::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, ${THEME.secondaryGreen}, ${THEME.primaryGreen});
      border-radius: 10px;
    }
    #surya-chat-messages::-webkit-scrollbar-thumb:hover {
      background: ${THEME.primaryGreen};
    }
    #surya-chat-messages {
      scrollbar-width: thin;
      scrollbar-color: ${THEME.secondaryGreen} transparent;
    }

    #surya-chat-input::placeholder {
      color: #8AA37A;
      font-weight: 400;
    }

    #surya-chat-send:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 22px ${THEME.shadow};
    }
    #surya-chat-send:active {
      transform: scale(0.96);
    }

    @media (max-width: 480px) {
      #surya-chat-box {
        width: 90vw !important;
        height: 75vh !important;
        right: 5vw !important;
        bottom: 96px !important;
      }
    }
  `
  document.head.appendChild(styleTag)

  // 🔥 FLOATING BUTTON (GREEN GRADIENT ORB)
  const button = document.createElement("div")
  button.innerHTML = "🌿"

  Object.assign(button.style, {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${THEME.primaryGreen}, ${THEME.secondaryGreen})`,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "26px",
    boxShadow: `0 10px 30px ${THEME.shadow}`,
    transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
    zIndex: "999999",
    animation: "surya-pulse 2.4s infinite",
    fontFamily: "Inter, sans-serif"
  })

  button.onmouseenter = () => button.style.transform = "scale(1.1)"
  button.onmouseleave = () => button.style.transform = "scale(1)"

  document.body.appendChild(button)

  // 🔥 CHAT BOX (PREMIUM GLASS UI)
  const box = document.createElement("div")
  box.id = "surya-chat-box"

  Object.assign(box.style, {
    position: "fixed",
    bottom: "100px",
    right: "28px",
    width: "360px",
    height: "480px",
    borderRadius: "22px",
    background: `linear-gradient(180deg, rgba(248,248,242,0.9), rgba(238,244,230,0.85))`,
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
    boxShadow: `0 30px 80px ${THEME.shadow}, 0 4px 16px rgba(0,0,0,0.06)`,
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "999999",
    fontFamily: "'Inter', sans-serif",
    border: `1px solid ${THEME.border}`,
    transition: "all 0.3s ease"
  })

  box.innerHTML = `

  <!-- HEADER -->
  <div style="
    padding:16px 18px;
    font-size:15px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    background:linear-gradient(135deg, ${THEME.primaryGreen}, ${THEME.secondaryGreen});
    color:#fff;
    font-family:'Inter', sans-serif;
  ">
    <div style="display:flex; align-items:center; gap:10px;">
      <div style="
        width:34px;
        height:34px;
        border-radius:50%;
        background:rgba(255,255,255,0.2);
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:18px;
      ">🌿</div>
      <div style="display:flex; flex-direction:column; line-height:1.25;">
        <span style="font-weight:600; font-size:14px;">Surya AI Assistant</span>
        <span style="display:flex; align-items:center; gap:5px; font-size:11px; opacity:0.9; font-weight:400;">
          <span style="width:7px;height:7px;border-radius:50%;background:#9CFFA0;display:inline-block;box-shadow:0 0 6px #9CFFA0;"></span>
          Online
        </span>
      </div>
    </div>
    <span id="chat-close" style="
      cursor:pointer;
      font-size:16px;
      width:26px;
      height:26px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      transition:background 0.2s ease;
    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='transparent'">✕</span>
  </div>

  <!-- MESSAGES -->
  <div id="surya-chat-messages" style="
    flex:1;
    padding:16px;
    overflow-y:auto;
    display:flex;
    flex-direction:column;
    gap:8px;
    background:transparent;
  "></div>

  <!-- INPUT -->
  <div style="
    padding:12px;
    display:flex;
    gap:8px;
    background:rgba(255,255,255,0.5);
    backdrop-filter:blur(12px);
    border-top:1px solid ${THEME.border};
  ">
    <input id="surya-chat-input" type="text"
      style="
        flex:1;
        padding:11px 16px;
        border:1.5px solid transparent;
        border-radius:999px;
        font-size:13px;
        outline:none;
        background:#fff;
        box-shadow:0 4px 14px rgba(0,0,0,0.06);
        color:${THEME.text};
        font-family:'Inter', sans-serif;
        transition:border-color 0.2s ease, box-shadow 0.2s ease;
      "
      placeholder="Ask me about projects, skills, experience..." />

    <button id="surya-chat-send"
      style="
        padding:11px 18px;
        border:none;
        background:linear-gradient(135deg, ${THEME.primaryGreen}, ${THEME.secondaryGreen});
        color:#fff;
        border-radius:999px;
        cursor:pointer;
        font-size:14px;
        box-shadow:0 6px 16px ${THEME.shadow};
        transition:transform 0.2s ease, box-shadow 0.2s ease;
      ">
      ➤
    </button>
  </div>
  `

  document.body.appendChild(box)

  // 🔥 INPUT FOCUS STYLING (kept as DOM behavior, not inline CSS pseudo-class)
  const inputFocusEl = box.querySelector("#surya-chat-input")
  inputFocusEl.addEventListener("focus", () => {
    inputFocusEl.style.borderColor = THEME.primaryGreen
    inputFocusEl.style.boxShadow = `0 4px 14px ${THEME.shadow}`
  })
  inputFocusEl.addEventListener("blur", () => {
    inputFocusEl.style.borderColor = "transparent"
    inputFocusEl.style.boxShadow = "0 4px 14px rgba(0,0,0,0.06)"
  })

  // 🔥 TOGGLE
  let hasGreeted = false
  let isOpen = false

  button.onclick = () => {
    if (!isOpen) {
      box.style.display = "flex"
      box.style.animation = "surya-fade-scale-in 0.3s ease forwards"
      isOpen = true

      // show welcome message once, on first open
      if (!hasGreeted) {
        showWelcomeMessage()
        hasGreeted = true
      }
    } else {
      closeBox()
    }
  }

  function closeBox() {
    box.style.animation = "surya-fade-scale-out 0.25s ease forwards"
    setTimeout(() => {
      box.style.display = "none"
    }, 240)
    isOpen = false
  }

  document.addEventListener("click", (e) => {
    if (!box.contains(e.target) && !button.contains(e.target)) {
      if (isOpen) closeBox()
    }
  })

  document.querySelector("#chat-close").onclick = () => {
    closeBox()
  }

  const input = document.querySelector("#surya-chat-input")
  const sendBtn = document.querySelector("#surya-chat-send")
  const messageArea = document.querySelector("#surya-chat-messages")

  // 🔥 WELCOME MESSAGE
  function showWelcomeMessage() {
    const welcomeHtml = `
      👋 Hello!<br>
      I'm Surya's AI Assistant.<br>
      I can answer questions about:
      <ul style="margin:8px 0 0 18px; padding:0;">
        <li>Projects</li>
        <li>Skills</li>
        <li>Experience</li>
        <li>Education</li>
        <li>Certifications</li>
        <li>Contact Information</li>
      </ul>
      Ask me anything!
    `
    addMessage(welcomeHtml, "ai")
  }

  // 🔥 ADD MESSAGE
  function addMessage(text, from) {
    const bubble = document.createElement("div")
    bubble.innerHTML = text

    Object.assign(bubble.style, {
      maxWidth: "78%",
      padding: "11px 15px",
      borderRadius: from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      fontSize: "13px",
      lineHeight: "1.5",
      marginBottom: "6px",
      alignSelf: from === "user" ? "flex-end" : "flex-start",
      background: from === "user"
        ? `linear-gradient(135deg, ${THEME.primaryGreen}, ${THEME.secondaryGreen})`
        : THEME.background,
      color: from === "user" ? "#fff" : THEME.text,
      boxShadow: from === "user"
        ? `0 6px 16px ${THEME.shadow}`
        : `0 4px 14px rgba(0,0,0,0.06)`,
      border: from === "user" ? "none" : `1px solid ${THEME.border}`,
      fontFamily: "'Inter', sans-serif",
      animation: "surya-slide-up 0.25s ease"
    })

    messageArea.appendChild(bubble)
    messageArea.scrollTop = messageArea.scrollHeight
  }

  // 🔥 TYPING ANIMATION
  function showTyping() {
    const typing = document.createElement("div")
    typing.id = "typing"

    typing.innerHTML = `
      <span style="display:inline-block; animation:surya-blink 1.2s infinite; animation-delay:0s;">•</span>
      <span style="display:inline-block; animation:surya-blink 1.2s infinite; animation-delay:0.15s;">•</span>
      <span style="display:inline-block; animation:surya-blink 1.2s infinite; animation-delay:0.3s;">•</span>
    `

    Object.assign(typing.style, {
      fontSize: "18px",
      color: THEME.primaryGreen,
      marginBottom: "6px",
      alignSelf: "flex-start",
      padding: "10px 15px",
      background: THEME.background,
      borderRadius: "16px 16px 16px 4px",
      border: `1px solid ${THEME.border}`,
      boxShadow: `0 4px 14px rgba(0,0,0,0.06)`,
      letterSpacing: "2px"
    })

    messageArea.appendChild(typing)
    messageArea.scrollTop = messageArea.scrollHeight
  }

  function removeTyping() {
    const typing = document.getElementById("typing")
    if (typing) typing.remove()
  }

  // 🔥 SEND MESSAGE
  sendBtn.onclick = sendMessage
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage()
  })

  async function sendMessage() {
    const text = input.value.trim()
    if (!text) return

    addMessage(text, "user")
    input.value = ""

    showTyping()

    try {
      const response = await fetch(api_Url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId,
          message: text
        })
      })

      const data = await response.json()

      removeTyping()
      addMessage(data || "Something went wrong", "ai")

    } catch (error) {
      removeTyping()
      addMessage("Server error. Try again.", "ai")
    }
  }

})()
