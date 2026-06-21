import { useState, useRef, useEffect } from "react"

// Typewriter component — reveals text gradually
function TypewriterText({ content, onDone, speed = 14 }) {
  const [shown, setShown] = useState("")

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      i += 2
      setShown(content.slice(0, i))
      if (i >= content.length) {
        clearInterval(timer)
        onDone && onDone()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [content])

  return shown.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      {i < shown.split("\n").length - 1 && <br />}
    </span>
  ))
}

function AIChat({ userData }) {
  const firstName = userData?.fullName?.split(" ")[0] || "there"

  const welcomeText = `Hi ${firstName} 🤍\n\nI'm Metova — your personal health companion. I'm here to help you understand what's happening in your body — clearly, confidently, and personally.\n\nI can help you make sense of your symptoms, understand your cycle, figure out what to eat for your hormones, or just talk through what you're feeling.\n\nWhat's on your mind today?`

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: welcomeText,
      animate: true,
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const generateResponse = (userMessage) => {
    const msg = userMessage.toLowerCase()
    const name = firstName
    const phase = userData?.lastPeriod ? getPhase() : null
    const diet = userData?.dietType || "no_restriction"

    function getPhase() {
      if (!userData?.lastPeriod) return null
      const lastPeriod = new Date(userData.lastPeriod)
      const today = new Date()
      const cycleDay =
        Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1
      if (cycleDay <= 5) return "menstrual"
      if (cycleDay <= 13) return "follicular"
      if (cycleDay <= 16) return "ovulatory"
      return "luteal"
    }

    const proteinSuggestion =
      diet === "Vegetarian" || diet === "Vegan"
        ? "dal, rajma, paneer, or tofu"
        : "eggs, dal, chicken, or fish"

    if (msg.includes("period") && msg.includes("late")) {
      return `That sounds stressful, ${name} — a late period when you have PCOS can send you into a spiral of worry, and that's completely understandable.\n\nHere's what's likely happening: with PCOS, your ovulation doesn't always follow a predictable schedule. When ovulation is delayed — which cortisol, blood sugar spikes, or even a change in sleep can cause — your period follows suit.\n\nA few things that could be contributing right now:\n• Stress raises cortisol, which directly delays ovulation\n• Blood sugar fluctuations signal your body to hold off\n• Changes in sleep, exercise, or eating patterns\n\nHere's what I'd suggest starting today:\n1. Track your stress levels in your symptom log — patterns often emerge\n2. Try 2 cups of spearmint tea daily — it's clinically shown to balance androgens\n3. If your period is more than 90 days late, it's worth a visit to your doctor\n\nWant me to add this to your health log so we can watch the pattern? 🤍`
    }

    if (msg.includes("acne") || msg.includes("breakout") || msg.includes("skin")) {
      return `Ugh, breakouts are one of the most emotionally draining parts of PCOS — especially when skincare alone doesn't fix it. That's because for most of us, it's not a skincare problem at all.\n\nWhat's actually happening: elevated androgens increase sebum production in your skin. This is why PCOS acne tends to cluster along the jawline and chin — those areas have more androgen receptors.\n\nThe good news is this is very addressable:\n1. Spearmint tea (2 cups daily) — has clinical evidence for reducing free testosterone\n2. Cut dairy for 3 weeks — the IGF-1 in milk directly stimulates androgens\n3. Log your breakout zones in your symptom tracker — I can start identifying your personal pattern\n\nOne question: is your acne mostly on your jawline, or is it spread across your face? That tells us a lot about what's driving it. 🤍`
    }

    if (msg.includes("eat") || msg.includes("food") || msg.includes("diet") || msg.includes("nutrition")) {
      return `Food is genuinely one of the most powerful tools you have with PCOS — and the good news is you don't need to overhaul everything.\n\nThe core principle: insulin resistance affects about 70% of women with PCOS, which means how you eat matters as much as what you eat.\n\nFor your body right now, here's what actually works:\n1. Eat protein first — start every meal with ${proteinSuggestion} before the carbs. This alone reduces your insulin spike significantly\n2. Dal before rice, not after — a simple switch that makes a real difference\n3. Add a fat to every carb — ghee on roti, coconut chutney with idli — it slows glucose absorption\n\n${phase === "luteal" ? "You're in your luteal phase right now, so your body is craving carbs more than usual — that's progesterone talking. Honour it with complex carbs like oats or sweet potato rather than fighting it.\n\n" : ""}What does a typical day of eating look like for you? I can give you more specific suggestions. 🤍`
    }

    if (msg.includes("supplement") || msg.includes("inositol") || msg.includes("vitamin")) {
      return `Great that you're thinking about supplements — they can make a real difference with PCOS when used correctly.\n\nHere's my honest breakdown of the evidence:\n\n✦ Inositol (Myo + D-Chiro, 40:1 ratio) — Grade A evidence. The most studied PCOS supplement. Improves insulin sensitivity, supports ovulation, and reduces androgens.\n\n✦ Vitamin D — Grade A evidence, especially for South Asian women. Most of us are deficient, and low Vitamin D directly worsens insulin resistance.\n\n✦ Spearmint tea — Grade B evidence. Two cups daily shown to reduce free testosterone within 30 days.\n\n✦ Magnesium — Grade B evidence. Helps with insulin resistance and reduces PMS symptoms.\n\nOne important note: supplements work alongside lifestyle, not instead of it. And always check with your doctor before starting, especially if you're on Metformin or birth control.\n\nAre you currently taking anything? I can tell you if there are any interactions to be aware of. 🤍`
    }

    if (msg.includes("pcos") && (msg.includes("what") || msg.includes("explain") || msg.includes("mean"))) {
      return `PCOS — Polycystic Ovary Syndrome — is honestly one of the most misunderstood conditions out there, so let me break it down in a way that actually makes sense.\n\nThink of it like this: your body has a communication glitch between your brain, ovaries, and pancreas. Instead of a smooth hormonal conversation, there's static — and that static shows up as symptoms.\n\nThe three main things happening:\n1. Your ovaries produce more androgens than they should — causing acne, hair thinning, and irregular cycles\n2. Many women with PCOS have insulin resistance — your cells don't respond to insulin properly, so your pancreas makes more, which triggers more androgens\n3. Your follicles don't always mature and release an egg — which is why cycles become irregular\n\nHere's what PCOS is NOT: it's not your fault, it's not just a "period problem," and it's absolutely manageable.\n\nDo you want me to explain any of these parts in more detail? 🤍`
    }

    if (msg.includes("lab") || msg.includes("result") || msg.includes("blood test") || msg.includes("report")) {
      return `Lab results can feel like reading a foreign language — numbers with no context. I'm here to help translate.\n\nFor PCOS specifically, the most important markers to understand are:\n\n✦ LH:FSH ratio — ideally close to 1:1. A ratio above 2:1 is a classic PCOS signal\n\n✦ AMH — above 4.7 ng/mL often indicates PCOS. It reflects how many follicles your ovaries have\n\n✦ HOMA-IR — your insulin resistance score. Above 2.5 means insulin resistance is likely playing a role\n\n✦ Free testosterone — even slightly elevated levels cause significant symptoms\n\nIf you share your specific values with me, I can walk you through exactly what they mean for your body. Just type them out and I'll explain each one in plain English.\n\nAnd remember — always discuss results with your doctor. I'm here to help you understand, not diagnose. 🤍`
    }

    if (msg.includes("hair") && (msg.includes("loss") || msg.includes("thin") || msg.includes("fall"))) {
      return `Hair loss with PCOS is one of the most emotionally difficult symptoms — it's visible, it's daily, and it feels deeply personal. What you're feeling makes complete sense.\n\nWhat's happening: elevated DHT (a potent androgen) shrinks hair follicles over time, causing the characteristic thinning at the crown and temples.\n\nThe honest truth is that hair recovery takes time — usually 6-12 months of consistent treatment. But here's what actually works:\n\n1. Address the root cause — reducing androgens is the most effective approach. Spearmint tea, inositol, and reducing refined carbs all help\n2. Scalp massage — 4 minutes daily. A 2016 study showed it measurably increased hair thickness after 24 weeks\n3. Check your ferritin — low iron is a massive contributor to hair loss that gets missed constantly. Ask your doctor for a ferritin test specifically\n\nHave you noticed where the thinning is most concentrated? That helps narrow down the cause. 🤍`
    }

    if (msg.includes("stress") || msg.includes("anxious") || msg.includes("anxiety") || msg.includes("overwhelm")) {
      return `I hear you — and I want you to know that the stress-PCOS connection is very real, not just in your head.\n\nHere's the actual mechanism: when you're stressed, your body releases cortisol. Cortisol raises blood sugar, which raises insulin, which raises androgens. So stress doesn't just feel bad — it physiologically worsens your PCOS symptoms.\n\nThis also works the other way: PCOS symptoms cause stress, which worsens PCOS. It can feel like a cycle with no exit.\n\nBut there are exits:\n1. The single most evidence-backed stress reducer for PCOS is consistent sleep — even one extra hour makes a measurable hormonal difference\n2. 20-minute walks reduce cortisol significantly\n3. Magnesium before bed — genuinely calming and well-studied for anxiety\n\nWhat's making things feel most overwhelming right now? Sometimes just naming it helps — and I'm genuinely here to listen. 🤍`
    }

    if (msg.includes("weight") || msg.includes("lose weight") || msg.includes("fat")) {
      return `I want to be really thoughtful here, ${name}, because this topic deserves honesty — not just a list of tips.\n\nWith PCOS, weight is genuinely more complicated than "eat less, move more." Insulin resistance means your body holds onto fat differently. It's not a willpower issue. It's a metabolic one.\n\nWhat actually moves the needle:\n1. Focusing on insulin — reducing refined carbs and eating protein first has more impact than calorie counting alone\n2. Strength training over cardio — building muscle improves insulin sensitivity more effectively\n3. Sleep — consistently under 7 hours raises hunger hormones and worsens insulin resistance\n\nI'd also gently ask: what's driving this for you right now? Health, energy, how you feel? Understanding the goal helps me give you better support. 🤍`
    }

    return `Thank you for sharing that with me, ${name} 🤍\n\nI want to make sure I give you the most helpful response — could you tell me a little more about what you're experiencing? The more specific you are, the better I can connect what you're feeling to what might actually be happening hormonally.\n\nI'm here and I'm listening.`
  }

  const sendMessage = (text) => {
    if (!text.trim()) return

    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text.trim(),
      animate: false,
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: "assistant",
        content: generateResponse(text.trim()),
        animate: true,
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
      setIsTyping(false)
      setMessages((prev) => [...prev, aiResponse])
    }, 1500 + Math.random() * 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const quickPrompts = [
    "Why is my period late?",
    "Analyse my symptoms",
    "What should I eat today?",
    "Explain my lab results",
    "Is this supplement right?",
  ]

  const formatStatic = (content) =>
    content.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </span>
    ))

  return (
    <div style={{
      height: "100vh",
      backgroundColor: "#FAF7F2",
      fontFamily: "DM Sans, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{
        padding: "52px 24px 16px",
        backgroundColor: "#FAF7F2",
        borderBottom: "0.5px solid #E8E4F0",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#E8E4F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontFamily: "Cormorant Garamond, serif",
            color: "#3D3935",
            flexShrink: 0,
          }}>
            M
          </div>
          <div>
            <div style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#0D0D0D",
            }}>
              Chat with {firstName}
            </div>
            <div style={{
              fontSize: "11px",
              color: "#6B6560",
            }}>
              Your intelligent health companion
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: msg.role === "user"
                ? "flex-end"
                : "flex-start",
            }}
          >
            {msg.role === "assistant" ? (
              // AI message — NO BOX, free flowing text
              <div style={{
                display: "flex",
                gap: "10px",
                maxWidth: "92%",
              }}>
                <div style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "#E8E4F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#3D3935",
                  flexShrink: 0,
                  marginTop: "2px",
                }}>
                  M
                </div>
                <div style={{
                  fontSize: "14px",
                  color: "#0D0D0D",
                  lineHeight: "1.75",
                  paddingTop: "4px",
                }}>
                  {msg.animate ? (
                    <TypewriterText content={msg.content} />
                  ) : (
                    formatStatic(msg.content)
                  )}
                </div>
              </div>
            ) : (
              // User message — PINK BOX
              <div style={{
                maxWidth: "80%",
                padding: "12px 16px",
                borderRadius: "18px 18px 4px 18px",
                backgroundColor: "#F2C4CE",
                fontSize: "14px",
                color: "#0D0D0D",
                lineHeight: "1.6",
              }}>
                {formatStatic(msg.content)}
              </div>
            )}

            <div style={{
              fontSize: "10px",
              color: "#6B6560",
              marginTop: "6px",
              paddingLeft: msg.role === "assistant" ? "38px" : "0",
            }}>
              {msg.time}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#E8E4F0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontFamily: "Cormorant Garamond, serif",
              color: "#3D3935",
            }}>
              M
            </div>
            <div style={{
              display: "flex",
              gap: "4px",
            }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#CFC1BA",
                    animation: `pulse 1.2s ease-in-out ${i * 0.4}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div style={{
        padding: "8px 16px",
        overflowX: "auto",
        display: "flex",
        gap: "8px",
        flexShrink: 0,
        borderTop: "0.5px solid #E8E4F0",
      }}>
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            style={{
              whiteSpace: "nowrap",
              padding: "8px 14px",
              borderRadius: "100px",
              border: "0.5px solid #E8E4F0",
              backgroundColor: "#FDF0EC",
              color: "#0D0D0D",
              fontSize: "12px",
              fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div style={{
        padding: "12px 16px 96px",
        backgroundColor: "#FAF7F2",
        borderTop: "0.5px solid #E8E4F0",
        display: "flex",
        gap: "10px",
        alignItems: "flex-end",
        flexShrink: 0,
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Metova anything..."
          rows={1}
          style={{
            flex: 1,
            backgroundColor: "#FDF0EC",
            border: "0.5px solid #E8E4F0",
            borderRadius: "20px",
            padding: "12px 16px",
            fontSize: "14px",
            fontFamily: "DM Sans, sans-serif",
            color: "#0D0D0D",
            outline: "none",
            resize: "none",
            lineHeight: "1.5",
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            backgroundColor: input.trim() ? "#0D0D0D" : "#E8E4F0",
            border: "none",
            cursor: input.trim() ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "background-color 0.2s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke={input.trim() ? "#FAF7F2" : "#6B6560"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={input.trim() ? "#FAF7F2" : "#6B6560"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}

export default AIChat