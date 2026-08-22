(async function () {
  //For running locally, change the URL:https://ai-ten-nu-93.vercel.app into https://localhost:3000
  const apiUrl = "https://ai-ten-nu-93.vercel.app/api/chat";
  const configApiUrl = "https://ai-ten-nu-93.vercel.app/api/chatbot-config";

  const scriptTag = document.currentScript;
  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.log("Owner ID not found");
    return;
  }

  try {
    // Get chatbot settings
    const configResponse = await fetch(`${configApiUrl}?ownerId=${ownerId}`);

    const config = await configResponse.json();

    console.log("Chatbot Config:", config);
    const chatBubbleColor = config.chatBubbleColor || "#6366f1";

    const widgetPosition = config.widgetPosition || "right";

    const borderRadius = config.borderRadius || 18;

    // =====================
    // FLOATING BUTTON
    // =====================

    const button = document.createElement("div");

    if (config.botIcon) {
      button.innerHTML = `
    <img 
      src="${config.botIcon}" 
      style="
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
      "
    />
  `;
    } else {
      button.innerHTML = "🤖";
    }
    Object.assign(button.style, {
      position: "fixed",
      bottom: "28px",

      width: "60px",
      height: "60px",

      borderRadius: `${borderRadius}px`,

      background: chatBubbleColor,

      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      cursor: "pointer",
      fontSize: "24px",

      boxShadow: "0 10px 30px rgba(0,0,0,0.25)",

      transition: "all 0.3s ease",

      zIndex: "999999",
    });

    // =====================
    // LEFT / RIGHT POSITION
    // =====================

    if (widgetPosition === "left") {
      button.style.left = "28px";
    } else {
      button.style.right = "28px";
    }

    button.onmouseenter = () => {
      button.style.transform = "scale(1.1)";
    };

    button.onmouseleave = () => {
      button.style.transform = "scale(1)";
    };

    document.body.appendChild(button);

    // =====================
    // CHAT BOX
    // =====================

    const box = document.createElement("div");

    Object.assign(box.style, {
      position: "fixed",

      bottom: "100px",

      width: "340px",
      height: "460px",

      borderRadius: `${borderRadius}px`,

      background: "#ffffff",

      boxShadow: "0 30px 80px rgba(0,0,0,0.25)",

      display: "none",

      flexDirection: "column",

      overflow: "hidden",

      zIndex: "999999",

      fontFamily: "Inter, sans-serif",
    });

    // CHAT BOX POSITION
    if (widgetPosition === "left") {
      box.style.left = "28px";
    } else {
      box.style.right = "28px";
    }

    box.innerHTML = `

      <div style="
        padding:14px;
        font-size:14px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        background:${chatBubbleColor};
        color:#fff;
      ">
        <span>Support</span>

        <span
          id="chat-close"
          style="cursor:pointer;font-size:16px"
        >
          ✕
        </span>

      </div>


      <div
        id="chat-messages"
        style="
          flex:1;
          min-height:0;
          overflow-x:0;
          padding:14px;
          overflow-y:auto;
          display:flex;
          flex-direction:column;
          gap:6px;
        "
      ></div>


      <div style="
        padding:10px;
        display:flex;
        gap:8px;
      ">

        <input
          id="chat-input"
          type="text"

          style="
            flex:1;
            padding:10px 14px;
            border:1px solid #ddd;
            border-radius:999px;
            font-size:13px;
            outline:none;
          "

          placeholder="Ask anything..."
        />


        <button
          id="chat-send"

          style="
            padding:10px 16px;
            border:none;
            background:${chatBubbleColor};
            color:#fff;
            border-radius:999px;
            cursor:pointer;
          "
        >
          ➤
        </button>

      </div>
    `;

    document.body.appendChild(box);

    // =====================
    // TOGGLE CHAT
    // =====================

    button.onclick = () => {
      box.style.display = box.style.display === "none" ? "flex" : "none";
    };

    document.addEventListener("click", (e) => {
      if (!box.contains(e.target) && !button.contains(e.target)) {
        box.style.display = "none";
      }
    });

    document.querySelector("#chat-close").onclick = () => {
      box.style.display = "none";
    };

    const input = document.querySelector("#chat-input");

    const sendBtn = document.querySelector("#chat-send");

    const messageArea = document.querySelector("#chat-messages");

    // =====================
    // ADD MESSAGE
    // =====================

    function addMessage(text, from) {
      const bubble = document.createElement("div");

      bubble.textContent = text;

      Object.assign(bubble.style, {
        maxWidth: "75%",

        padding: "10px 14px",

        borderRadius: `${borderRadius}px`,

        fontSize: "13px",

        marginBottom: "6px",

        alignSelf: from === "user" ? "flex-end" : "flex-start",

        background: from === "user" ? chatBubbleColor : "#f3f4f6",

        color: from === "user" ? "#fff" : "#111",

        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",

        //new update
        wordBreak: "break-word",
  overflowWrap: "break-word",
  flexShrink: "0",
      });

      messageArea.appendChild(bubble);

      messageArea.scrollTop = messageArea.scrollHeight;
    }

    // =====================
    // SEND MESSAGE
    // =====================

    sendBtn.onclick = sendMessage;

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    async function sendMessage() {
      const text = input.value.trim();

      if (!text) return;

      addMessage(text, "user");

      input.value = "";

      try {
        const response = await fetch(apiUrl, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ownerId,
            message: text,
          }),
        });

        const data = await response.json();

        addMessage(data || "Something went wrong", "ai");
      } catch (error) {
        addMessage("Server error. Try again.", "ai");
      }
    }
  } catch (error) {
    console.error("Chatbot initialization error:", error);
  }
})();
