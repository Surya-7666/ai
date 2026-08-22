(async function () {
  // =========================================================
  // API CONFIGURATION
  // =========================================================

  // For local development:
  // Change https://ai-ten-nu-93.vercel.app
  // to http://localhost:3000

  const API_BASE_URL = "https://ai-ten-nu-93.vercel.app";

  const apiUrl = `${API_BASE_URL}/api/chat`;
  const configApiUrl = `${API_BASE_URL}/api/chatbot-config`;

  // =========================================================
  // GET SCRIPT TAG + OWNER ID
  // =========================================================

  const scriptTag = document.currentScript;

  if (!scriptTag) {
    console.error("Chatbot script tag not found");
    return;
  }

  const ownerId = scriptTag.getAttribute("data-owner-id");

  if (!ownerId) {
    console.error("Owner ID not found");
    return;
  }

  // =========================================================
  // INITIALIZATION
  // =========================================================

  try {
    // =======================================================
    // GET CHATBOT CONFIGURATION
    // =======================================================

    const configResponse = await fetch(
      `${configApiUrl}?ownerId=${encodeURIComponent(ownerId)}`
    );

    if (!configResponse.ok) {
      throw new Error("Failed to fetch chatbot configuration");
    }

    const config = await configResponse.json();

    console.log("Chatbot Config:", config);

    // =======================================================
    // CONFIG VALUES
    // =======================================================

    const chatBubbleColor = config.chatBubbleColor || "#6366f1";

    const widgetPosition = config.widgetPosition || "right";

    const borderRadius = Number(config.borderRadius) || 18;

    const botIcon = config.botIcon || null;

    // =======================================================
    // CREATE UNIQUE STYLE ELEMENT
    // =======================================================

    const style = document.createElement("style");

    style.textContent = `
      @keyframes chatbotBlink {
        0%, 80%, 100% {
          opacity: 0.3;
          transform: translateY(0);
        }

        40% {
          opacity: 1;
          transform: translateY(-3px);
        }
      }

      @keyframes chatbotFadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes chatbotSlideUp {
        from {
          opacity: 0;
          transform: translateY(15px) scale(0.97);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .chatbot-widget-message {
        animation: chatbotFadeIn 0.25s ease;
      }

      .chatbot-widget-typing-dot {
        display: inline-block;
        animation: chatbotBlink 1.2s infinite;
      }

      .chatbot-widget-typing-dot:nth-child(2) {
        animation-delay: 0.15s;
      }

      .chatbot-widget-typing-dot:nth-child(3) {
        animation-delay: 0.3s;
      }

      .chatbot-widget-scroll::-webkit-scrollbar {
        width: 5px;
      }

      .chatbot-widget-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      .chatbot-widget-scroll::-webkit-scrollbar-thumb {
        background: rgba(107, 114, 128, 0.35);
        border-radius: 10px;
      }

      .chatbot-widget-scroll {
        scrollbar-width: thin;
        scrollbar-color: rgba(107, 114, 128, 0.35) transparent;
      }

      .chatbot-widget-input::placeholder {
        color: #9ca3af;
      }

      .chatbot-widget-input:focus {
        box-shadow:
          0 0 0 2px rgba(99, 102, 241, 0.15),
          0 5px 15px rgba(0, 0, 0, 0.08) !important;
      }

      .chatbot-widget-send:hover {
        transform: scale(1.05);
      }

      .chatbot-widget-send:active {
        transform: scale(0.95);
      }

      .chatbot-widget-button:hover {
        transform: scale(1.08);
      }

      @media (max-width: 480px) {
        .chatbot-widget-box {
          width: calc(100vw - 28px) !important;
          height: min(70vh, 520px) !important;
          bottom: 90px !important;
        }

        .chatbot-widget-button {
          width: 56px !important;
          height: 56px !important;
        }
      }
    `;

    document.head.appendChild(style);

    // =========================================================
    // FLOATING CHAT BUTTON
    // =========================================================

    const button = document.createElement("div");

    button.className = "chatbot-widget-button";

    // Custom bot icon or default emoji
    if (botIcon) {
      const img = document.createElement("img");

      img.src = botIcon;
      img.alt = "Chatbot";

      Object.assign(img.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "inherit",
        display: "block",
      });

      button.appendChild(img);
    } else {
      button.textContent = "🤖";
    }

    Object.assign(button.style, {
      position: "fixed",
      bottom: "28px",

      width: "60px",
      height: "60px",

      borderRadius: `${borderRadius}px`,

      // Gradient instead of solid color
      background: `linear-gradient(
        135deg,
        ${chatBubbleColor},
        ${chatBubbleColor}
      )`,

      color: "#fff",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      cursor: "pointer",

      fontSize: "24px",

      boxShadow: `0 10px 30px ${chatBubbleColor}80`,

      transition: "all 0.3s ease",

      zIndex: "999999",

      overflow: "hidden",

      userSelect: "none",
    });

    // =========================================================
    // BUTTON POSITION
    // =========================================================

    if (widgetPosition === "left") {
      button.style.left = "28px";
    } else {
      button.style.right = "28px";
    }

    // =========================================================
    // BUTTON HOVER
    // =========================================================

    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.08)";
      button.style.boxShadow = `0 14px 35px ${chatBubbleColor}99`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
      button.style.boxShadow = `0 10px 30px ${chatBubbleColor}80`;
    });

    document.body.appendChild(button);

    // =========================================================
    // CHAT BOX
    // =========================================================

    const box = document.createElement("div");

    box.className = "chatbot-widget-box";

    Object.assign(box.style, {
      position: "fixed",

      bottom: "100px",

      width: "340px",
      height: "460px",

      borderRadius: `${borderRadius}px`,

      // =====================================================
      // GLASSMORPHISM
      // =====================================================

      background: "rgba(255, 255, 255, 0.72)",

      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",

      boxShadow: "0 30px 80px rgba(0, 0, 0, 0.25)",

      display: "none",

      flexDirection: "column",

      overflow: "hidden",

      zIndex: "999999",

      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

      border: "1px solid rgba(255,255,255,0.35)",

      animation: "chatbotSlideUp 0.25s ease",

      transition: "all 0.3s ease",
    });

    // =========================================================
    // CHAT BOX POSITION
    // =========================================================

    if (widgetPosition === "left") {
      box.style.left = "28px";
    } else {
      box.style.right = "28px";
    }

    // =========================================================
    // CHATBOX HTML
    // =========================================================

    box.innerHTML = `

      <!-- ============================================= -->
      <!-- HEADER -->
      <!-- ============================================= -->

      <div
        class="chatbot-widget-header"
        style="
          padding:14px 16px;

          font-size:14px;

          display:flex;

          justify-content:space-between;

          align-items:center;

          background:
            linear-gradient(
              135deg,
              ${chatBubbleColor},
              ${chatBubbleColor}
            );

          color:#fff;

          flex-shrink:0;
        "
      >

        <div
          style="
            display:flex;
            align-items:center;
            gap:9px;
          "
        >

          ${
            botIcon
              ? `
                <img
                  src="${botIcon}"
                  alt="Bot"
                  style="
                    width:28px;
                    height:28px;
                    border-radius:50%;
                    object-fit:cover;
                    border:2px solid rgba(255,255,255,0.5);
                  "
                />
              `
              : `
                <div
                  style="
                    width:28px;
                    height:28px;
                    border-radius:50%;
                    background:rgba(255,255,255,0.2);
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:16px;
                  "
                >
                  🤖
                </div>
              `
          }

          <div>

            <div
              style="
                font-size:14px;
                font-weight:600;
                line-height:1.2;
              "
            >
              Support
            </div>

            <div
              style="
                font-size:10px;
                opacity:0.8;
                margin-top:2px;
              "
            >
              Online
            </div>

          </div>

        </div>


        <!-- CLOSE BUTTON -->

        <span
          id="chat-close"
          style="
            cursor:pointer;
            font-size:16px;
            width:28px;
            height:28px;
            border-radius:50%;
            display:flex;
            align-items:center;
            justify-content:center;
            transition:background 0.2s ease;
          "
        >
          ✕
        </span>

      </div>


      <!-- ============================================= -->
      <!-- MESSAGES -->
      <!-- ============================================= -->

      <div
        id="chat-messages"
        class="chatbot-widget-scroll"
        style="
          flex:1;

          padding:14px;

          overflow-y:auto;

          overflow-x:hidden;

          display:flex;

          flex-direction:column;

          gap:6px;

          min-height:0;

          scroll-behavior:smooth;
        "
      ></div>


      <!-- ============================================= -->
      <!-- INPUT AREA -->
      <!-- ============================================= -->

      <div
        style="
          padding:10px;

          display:flex;

          gap:8px;

          background:rgba(255,255,255,0.6);

          backdrop-filter:blur(10px);

          -webkit-backdrop-filter:blur(10px);

          border-top:1px solid rgba(255,255,255,0.35);

          flex-shrink:0;
        "
      >

        <!-- INPUT -->

        <input
          id="chat-input"
          class="chatbot-widget-input"
          type="text"

          style="
            flex:1;

            min-width:0;

            padding:10px 14px;

            border:none;

            border-radius:999px;

            font-size:13px;

            outline:none;

            background:#fff;

            box-shadow:
              0 5px 15px rgba(0,0,0,0.08);

            transition:
              box-shadow 0.2s ease;
          "

          placeholder="Ask anything..."
        />


        <!-- SEND BUTTON -->

        <button
          id="chat-send"
          class="chatbot-widget-send"

          style="
            width:42px;

            height:42px;

            padding:0;

            border:none;

            background:
              linear-gradient(
                135deg,
                ${chatBubbleColor},
                ${chatBubbleColor}
              );

            color:#fff;

            border-radius:50%;

            cursor:pointer;

            display:flex;

            align-items:center;

            justify-content:center;

            font-size:16px;

            flex-shrink:0;

            transition:
              transform 0.2s ease,
              box-shadow 0.2s ease;

            box-shadow:
              0 5px 15px ${chatBubbleColor}55;
          "
        >
          ➤
        </button>

      </div>
    `;

    document.body.appendChild(box);

    // =========================================================
    // GET ELEMENTS FROM THIS CHATBOX
    // =========================================================

    const closeBtn = box.querySelector("#chat-close");

    const input = box.querySelector("#chat-input");

    const sendBtn = box.querySelector("#chat-send");

    const messageArea = box.querySelector("#chat-messages");

    // =========================================================
    // TOGGLE CHAT
    // =========================================================

    button.addEventListener("click", (event) => {
      event.stopPropagation();

      if (box.style.display === "none") {
        box.style.display = "flex";

        // Focus input when opening
        setTimeout(() => {
          input.focus();
        }, 100);
      } else {
        box.style.display = "none";
      }
    });

    // =========================================================
    // CLOSE CHAT
    // =========================================================

    closeBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      box.style.display = "none";
    });

    // =========================================================
    // CLOSE WHEN CLICKING OUTSIDE
    // =========================================================

    document.addEventListener("click", (event) => {
      if (
        !box.contains(event.target) &&
        !button.contains(event.target)
      ) {
        box.style.display = "none";
      }
    });

    // =========================================================
    // ADD MESSAGE
    // =========================================================

    function addMessage(text, from) {
      const bubble = document.createElement("div");

      // SAFE TEXT RENDERING
      bubble.textContent = String(text);

      bubble.className = "chatbot-widget-message";

      Object.assign(bubble.style, {
        maxWidth: "75%",

        padding: "10px 14px",

        borderRadius: `${borderRadius}px`,

        fontSize: "13px",

        lineHeight: "1.5",

        marginBottom: "6px",

        alignSelf:
          from === "user"
            ? "flex-end"
            : "flex-start",

        background:
          from === "user"
            ? `linear-gradient(
                135deg,
                ${chatBubbleColor},
                ${chatBubbleColor}
              )`
            : "rgba(255,255,255,0.85)",

        color:
          from === "user"
            ? "#fff"
            : "#111",

        boxShadow:
          "0 5px 15px rgba(0,0,0,0.08)",

        wordBreak: "break-word",

        overflowWrap: "anywhere",
      });

      messageArea.appendChild(bubble);

      // =====================================================
      // AUTO SCROLL
      // =====================================================

      messageArea.scrollTo({
        top: messageArea.scrollHeight,
        behavior: "smooth",
      });
    }

    // =========================================================
    // TYPING / LOADING INDICATOR
    // =========================================================

    function showTyping() {
      // Prevent duplicate typing indicators
      removeTyping();

      const typing = document.createElement("div");

      typing.id = "chatbot-typing";

      Object.assign(typing.style, {
        alignSelf: "flex-start",

        padding: "8px 13px",

        borderRadius: `${borderRadius}px`,

        background: "rgba(255,255,255,0.85)",

        color: "#6b7280",

        boxShadow:
          "0 5px 15px rgba(0,0,0,0.08)",

        fontSize: "18px",

        letterSpacing: "3px",

        lineHeight: "1",

        marginBottom: "6px",
      });

      typing.innerHTML = `
        <span
          class="chatbot-widget-typing-dot"
        >
          •
        </span>

        <span
          class="chatbot-widget-typing-dot"
        >
          •
        </span>

        <span
          class="chatbot-widget-typing-dot"
        >
          •
        </span>
      `;

      messageArea.appendChild(typing);

      // Auto scroll to typing indicator
      messageArea.scrollTo({
        top: messageArea.scrollHeight,
        behavior: "smooth",
      });
    }

    // =========================================================
    // REMOVE TYPING INDICATOR
    // =========================================================

    function removeTyping() {
      const typing =
        messageArea.querySelector("#chatbot-typing");

      if (typing) {
        typing.remove();
      }
    }

    // =========================================================
    // SEND BUTTON
    // =========================================================

    sendBtn.addEventListener("click", sendMessage);

    // =========================================================
    // ENTER KEY
    // =========================================================

    input.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();

        sendMessage();
      }
    });

    // =========================================================
    // SEND MESSAGE
    // =========================================================

    async function sendMessage() {
      const text = input.value.trim();

      if (!text) return;

      // =====================================================
      // ADD USER MESSAGE
      // =====================================================

      addMessage(text, "user");

      // Clear input
      input.value = "";

      // Keep focus
      input.focus();

      // =====================================================
      // SHOW LOADING / TYPING
      // =====================================================

      showTyping();

      // Disable send button while waiting
      sendBtn.disabled = true;

      sendBtn.style.opacity = "0.6";

      sendBtn.style.cursor = "not-allowed";

      try {
        // ===================================================
        // API REQUEST
        // ===================================================

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

        // ===================================================
        // CHECK RESPONSE
        // ===================================================

        if (!response.ok) {
          throw new Error(
            `API request failed: ${response.status}`
          );
        }

        const data = await response.json();

        // ===================================================
        // REMOVE TYPING
        // ===================================================

        removeTyping();

        // ===================================================
        // GET AI RESPONSE
        // ===================================================

        let aiMessage = data;

        // If API returns an object
        if (
          typeof data === "object" &&
          data !== null
        ) {
          aiMessage =
            data.message ||
            data.response ||
            data.reply ||
            data.answer ||
            JSON.stringify(data);
        }

        // ===================================================
        // ADD AI MESSAGE
        // ===================================================

        addMessage(
          aiMessage || "Something went wrong.",
          "ai"
        );
      } catch (error) {
        console.error(
          "Chatbot message error:",
          error
        );

        removeTyping();

        addMessage(
          "Server error. Please try again.",
          "ai"
        );
      } finally {
        // ===================================================
        // ENABLE SEND BUTTON
        // ===================================================

        sendBtn.disabled = false;

        sendBtn.style.opacity = "1";

        sendBtn.style.cursor = "pointer";
      }
    }

  } catch (error) {
    console.error(
      "Chatbot initialization error:",
      error
    );
  }
})();
