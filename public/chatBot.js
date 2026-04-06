(function () {

  const api_Url = "http://localhost:3000/api/chat"

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id")

  if (!ownerId) {
    console.log("owner id not found")
    return
  }

  // 🔥 FLOATING BUTTON (GRADIENT ORB)
  const button = document.createElement("div")
  button.innerHTML = "🤖"

  Object.assign(button.style, {
    position: "fixed",
    bottom: "28px",
    right: "28px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "24px",
    boxShadow: "0 10px 30px rgba(99,102,241,0.5)",
    transition: "all 0.3s ease",
    zIndex: "999999",
  })

  button.onmouseenter = () => button.style.transform = "scale(1.1)"
  button.onmouseleave = () => button.style.transform = "scale(1)"

  document.body.appendChild(button)

  // 🔥 CHAT BOX (GLASS UI)
  const box = document.createElement("div")

  Object.assign(box.style, {
    position: "fixed",
    bottom: "100px",
    right: "28px",
    width: "340px",
    height: "460px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
    display: "none",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: "999999",
    fontFamily: "Inter, sans-serif",
    border: "1px solid rgba(255,255,255,0.3)",
    transition: "all 0.3s ease"
  })

  box.innerHTML = `

  <!-- HEADER -->
  <div style="
    padding:14px;
    font-size:14px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    color:#fff;
  ">
    <span>Support</span>
    <span id="chat-close" style="cursor:pointer;font-size:16px">✕</span>
  </div>

  <!-- MESSAGES -->
  <div id="chat-messages" style="
    flex:1;
    padding:14px;
    overflow-y:auto;
    display:flex;
    flex-direction:column;
    gap:6px;
  "></div>

  <!-- INPUT -->
  <div style="
    padding:10px;
    display:flex;
    gap:8px;
    background:rgba(255,255,255,0.6);
    backdrop-filter:blur(10px);
  ">
    <input id="chat-input" type="text"
      style="
        flex:1;
        padding:10px 14px;
        border:none;
        border-radius:999px;
        font-size:13px;
        outline:none;
        background:#fff;
        box-shadow:0 5px 15px rgba(0,0,0,0.1);
      "
      placeholder="Ask anything..." />

    <button id="chat-send"
      style="
        padding:10px 16px;
        border:none;
        background:linear-gradient(135deg,#6366f1,#8b5cf6);
        color:#fff;
        border-radius:999px;
        cursor:pointer;
      ">
      ➤
    </button>
  </div>
  `

  document.body.appendChild(box)

  // 🔥 TOGGLE
  button.onclick = () => {
    box.style.display = box.style.display === "none" ? "flex" : "none"
    box.style.transform = "translateY(0)"
  }

  document.addEventListener("click", (e) => {
    if (!box.contains(e.target) && !button.contains(e.target)) {
      box.style.display = "none"
    }
  })

  document.querySelector("#chat-close").onclick = () => {
    box.style.display = "none"
  }

  const input = document.querySelector("#chat-input")
  const sendBtn = document.querySelector("#chat-send")
  const messageArea = document.querySelector("#chat-messages")

  // 🔥 ADD MESSAGE
  function addMessage(text, from) {
    const bubble = document.createElement("div")
    bubble.innerHTML = text

    Object.assign(bubble.style, {
      maxWidth: "75%",
      padding: "10px 14px",
      borderRadius: "16px",
      fontSize: "13px",
      marginBottom: "6px",
      alignSelf: from === "user" ? "flex-end" : "flex-start",
      background: from === "user"
        ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
        : "rgba(255,255,255,0.85)",
      color: from === "user" ? "#fff" : "#111",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
    })

    messageArea.appendChild(bubble)
    messageArea.scrollTop = messageArea.scrollHeight
  }

  // 🔥 TYPING ANIMATION
  function showTyping() {
    const typing = document.createElement("div")
    typing.id = "typing"

    typing.innerHTML = "•••"

    Object.assign(typing.style, {
      fontSize: "20px",
      color: "#6b7280",
      marginBottom: "8px",
      alignSelf: "flex-start",
      letterSpacing: "3px",
      animation: "blink 1s infinite"
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