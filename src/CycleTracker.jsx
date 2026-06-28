import { useState } from "react"
import { supabase } from "./supabase"

function CycleTracker({ userData }) {
  const [showLogSheet, setShowLogSheet] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState("")
  const [painLevel, setPainLevel] = useState(0)
  const [clotting, setClotting] = useState(false)
  const [loggedDays, setLoggedDays] = useState([])
  const [view, setView] = useState("ring")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const calculateCycleInfo = () => {
    if (!userData?.lastPeriod) {
      return { cycleDay: 1, phase: "unknown", daysUntilPeriod: 28, phaseColor: "#E8E4F0", progress: 0 }
    }
    const lastPeriod = new Date(userData.lastPeriod)
    const today = new Date()
    const cycleDay = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1
    const cycleLength = 28
    let phase = "follicular"
    let phaseColor = "#E8E4F0"
    if (cycleDay <= 5) { phase = "menstrual"; phaseColor = "#F2C4CE" }
    else if (cycleDay <= 13) { phase = "follicular"; phaseColor = "#E8E4F0" }
    else if (cycleDay <= 16) { phase = "ovulatory"; phaseColor = "#E8C87A" }
    else { phase = "luteal"; phaseColor = "#CFC1BA" }
    const daysUntilPeriod = Math.max(0, cycleLength - cycleDay)
    const progress = Math.min((cycleDay / cycleLength) * 100, 100)
    return { cycleDay, phase, daysUntilPeriod, phaseColor, progress }
  }

  const { cycleDay, phase, daysUntilPeriod, phaseColor, progress } = calculateCycleInfo()

  const phaseDescriptions = {
    menstrual: "Your period is here. Rest, nourish, and be gentle with yourself.",
    follicular: "Energy is building. Oestrogen is rising — you'll feel more motivated.",
    ovulatory: "Peak energy and confidence. Your best window for big decisions.",
    luteal: "Progesterone rises. You may feel more inward — honour that.",
    unknown: "Log your last period to see your cycle insights.",
  }

  const phaseLabel = {
    menstrual: "Menstrual",
    follicular: "Follicular",
    ovulatory: "Ovulatory",
    luteal: "Luteal",
    unknown: "Unknown",
  }

  const size = 220
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const monthName = today.toLocaleString("default", { month: "long" })
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const handleLogPeriod = async () => {
    if (!selectedFlow) {
      alert("Please select a flow intensity.")
      return
    }

    setSaving(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        alert("Not logged in")
        setSaving(false)
        return
      }

      const todayStr = today.toISOString().split("T")[0]

      const { error } = await supabase
        .from("period_logs")
        .upsert({
          user_id: session.user.id,
          start_date: todayStr,
          pain_level: painLevel,
          clotting: clotting,
          flow_days: { [todayStr]: selectedFlow.toLowerCase() },
        }, { onConflict: "user_id, start_date" })

      if (error) {
        console.error("Period log error:", error)
        alert("Failed to save. Try again!")
      } else {
        setLoggedDays([...loggedDays, {
          date: todayStr,
          flow: selectedFlow,
          pain: painLevel,
          clotting,
        }])
        setSaved(true)
        setTimeout(() => {
          setShowLogSheet(false)
          setSelectedFlow("")
          setPainLevel(0)
          setClotting(false)
          setSaved(false)
        }, 1500)
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Something went wrong!")
    }

    setSaving(false)
  }

  const flowOptions = [
    { label: "Light", emoji: "💧" },
    { label: "Medium", emoji: "💧💧" },
    { label: "Heavy", emoji: "💧💧💧" },
    { label: "Spotting", emoji: "·" },
  ]

  const phases = [
    { name: "Menstrual", days: "Days 1–5", color: "#F2C4CE" },
    { name: "Follicular", days: "Days 6–13", color: "#E8E4F0" },
    { name: "Ovulatory", days: "Days 14–16", color: "#E8C87A" },
    { name: "Luteal", days: "Days 17–28", color: "#CFC1BA" },
  ]

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF7F2",
      fontFamily: "DM Sans, sans-serif",
      paddingBottom: "100px",
    }}>

      {/* Header */}
      <div style={{ padding: "52px 24px 0", maxWidth: "480px", margin: "0 auto" }}>
        <h1 className="fade-up-1" style={{
          fontSize: "28px", fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500", color: "#0D0D0D", margin: "0 0 4px",
        }}>
          Cycle tracker
        </h1>
        <p className="fade-up-2" style={{ fontSize: "13px", color: "#6B6560", margin: "0 0 24px" }}>
          {phaseLabel[phase]} phase · Day {cycleDay}
        </p>

        {/* View toggle */}
        <div className="fade-up-3" style={{
          display: "flex", backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0", borderRadius: "100px",
          padding: "4px", marginBottom: "28px", width: "fit-content",
        }}>
          {["ring", "calendar"].map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "8px 20px", borderRadius: "100px", border: "none",
              backgroundColor: view === v ? "#0D0D0D" : "transparent",
              color: view === v ? "#FAF7F2" : "#6B6560",
              fontSize: "13px", fontFamily: "DM Sans, sans-serif",
              cursor: "pointer", fontWeight: view === v ? "500" : "400",
              transition: "all 0.2s ease",
            }}>
              {v === "ring" ? "Ring view" : "Calendar"}
            </button>
          ))}
        </div>
      </div>

      {/* RING VIEW */}
      {view === "ring" && (
        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 24px" }}>
          <div className="fade-up-4" style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", marginBottom: "24px",
          }}>
            <div style={{ position: "relative", width: size, height: size }}>
              <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#E8E4F0" strokeWidth={strokeWidth} />
                <circle
                  cx={size/2} cy={size/2} r={radius} fill="none"
                  stroke={phaseColor} strokeWidth={strokeWidth}
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
              </svg>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", textAlign: "center",
              }}>
                <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Day</div>
                <div style={{ fontSize: "48px", fontFamily: "Cormorant Garamond, serif", fontWeight: "400", color: "#0D0D0D", lineHeight: "1" }}>{cycleDay}</div>
                <div style={{ fontSize: "11px", color: "#6B6560", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{phaseLabel[phase]}</div>
              </div>
            </div>
            {daysUntilPeriod > 0 && (
              <div style={{ marginTop: "12px", fontSize: "13px", color: "#6B6560" }}>
                Next period in{" "}
                <span style={{ color: "#0D0D0D", fontWeight: "500" }}>~{daysUntilPeriod} days</span>
              </div>
            )}
          </div>

          <div className="fade-up-5" style={{
            backgroundColor: "#FDF0EC", border: "0.5px solid #E8E4F0",
            borderLeft: `3px solid ${phaseColor}`, borderRadius: "0 16px 16px 0",
            padding: "16px 20px", marginBottom: "20px",
          }}>
            <div style={{ fontSize: "10px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>What's happening</div>
            <div style={{ fontSize: "14px", color: "#0D0D0D", lineHeight: "1.6" }}>{phaseDescriptions[phase]}</div>
          </div>

          <div className="fade-up-6" style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Your cycle phases
          </div>

          <div className="fade-up-7" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "24px" }}>
            {phases.map((p) => (
              <div key={p.name} style={{
                backgroundColor: "#FDF0EC", border: "0.5px solid #E8E4F0",
                borderRadius: "12px", padding: "12px 14px",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: p.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "500", color: "#0D0D0D" }}>{p.name}</div>
                  <div style={{ fontSize: "11px", color: "#6B6560" }}>{p.days}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="fade-up-8">
            <button onClick={() => setShowLogSheet(true)} style={{
              width: "100%", backgroundColor: "#0D0D0D", color: "#FAF7F2",
              border: "none", borderRadius: "100px", padding: "16px",
              fontSize: "15px", fontFamily: "DM Sans, sans-serif",
              fontWeight: "500", cursor: "pointer",
            }}>
              Log period today
            </button>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" && (
        <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 24px" }}>
          <div className="fade-up-1" style={{
            fontSize: "20px", fontFamily: "Cormorant Garamond, serif",
            fontWeight: "500", color: "#0D0D0D", marginBottom: "16px",
          }}>
            {monthName} {year}
          </div>

          <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: "11px", color: "#6B6560", padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          <div className="fade-up-3" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "24px" }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isToday = day === today.getDate()
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              const isLogged = loggedDays.some((l) => l.date === dateStr)
              return (
                <div key={day} onClick={() => isToday && setShowLogSheet(true)} style={{
                  aspectRatio: "1", display: "flex", alignItems: "center",
                  justifyContent: "center", borderRadius: "50%",
                  fontSize: "13px", fontFamily: "DM Sans, sans-serif",
                  cursor: isToday ? "pointer" : "default",
                  backgroundColor: isToday ? "#0D0D0D" : isLogged ? "#F2C4CE" : "transparent",
                  color: isToday ? "#FAF7F2" : "#0D0D0D",
                  fontWeight: isToday ? "500" : "400",
                  border: isLogged && !isToday ? "0.5px solid #F2C4CE" : "none",
                }}>{day}</div>
              )
            })}
          </div>

          <div className="fade-up-4" style={{
            backgroundColor: "#FDF0EC", border: "0.5px solid #E8E4F0",
            borderRadius: "16px", padding: "16px 20px", marginBottom: "20px",
          }}>
            <div style={{ fontSize: "10px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Next period predicted</div>
            <div style={{ fontSize: "18px", fontFamily: "Cormorant Garamond, serif", color: "#0D0D0D" }}>In ~{daysUntilPeriod} days</div>
            <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>Based on your last logged period</div>
          </div>

          <div className="fade-up-5">
            <button onClick={() => setShowLogSheet(true)} style={{
              width: "100%", backgroundColor: "#0D0D0D", color: "#FAF7F2",
              border: "none", borderRadius: "100px", padding: "16px",
              fontSize: "15px", fontFamily: "DM Sans, sans-serif",
              fontWeight: "500", cursor: "pointer",
            }}>
              Log period today
            </button>
          </div>
        </div>
      )}

      {/* LOG PERIOD BOTTOM SHEET */}
      {showLogSheet && (
        <div onClick={() => setShowLogSheet(false)} style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(13,13,13,0.4)",
          display: "flex", alignItems: "flex-end", zIndex: 100,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", backgroundColor: "#FAF7F2",
            borderRadius: "24px 24px 0 0", padding: "24px 24px 48px",
            maxWidth: "480px", margin: "0 auto",
          }}>
            <div style={{ width: "40px", height: "4px", backgroundColor: "#E8E4F0", borderRadius: "100px", margin: "0 auto 24px" }} />

            <h3 className="fade-up-1" style={{
              fontSize: "22px", fontFamily: "Cormorant Garamond, serif",
              fontWeight: "500", color: "#0D0D0D", margin: "0 0 8px",
            }}>
              Log your period
            </h3>
            <p className="fade-up-2" style={{ fontSize: "13px", color: "#6B6560", margin: "0 0 24px" }}>
              How is your flow today?
            </p>

            <div className="fade-up-3" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "24px" }}>
              {flowOptions.map((f) => (
                <button key={f.label} onClick={() => setSelectedFlow(f.label)} style={{
                  padding: "12px 8px", borderRadius: "12px",
                  border: selectedFlow === f.label ? "1px solid #0D0D0D" : "0.5px solid #E8E4F0",
                  backgroundColor: selectedFlow === f.label ? "#E8E4F0" : "#FDF0EC",
                  color: "#0D0D0D", fontSize: "11px",
                  fontFamily: "DM Sans, sans-serif", cursor: "pointer", textAlign: "center",
                }}>
                  <div style={{ fontSize: "16px", marginBottom: "4px" }}>{f.emoji}</div>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="fade-up-4" style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
                Pain level — {painLevel}/10
              </div>
              <input type="range" min="0" max="10" value={painLevel}
                onChange={(e) => setPainLevel(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#0D0D0D" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B6560", marginTop: "4px" }}>
                <span>No pain</span><span>Severe</span>
              </div>
            </div>

            <div className="fade-up-5" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              backgroundColor: "#FDF0EC", border: "0.5px solid #E8E4F0",
              borderRadius: "12px", padding: "14px 16px", marginBottom: "24px", cursor: "pointer",
            }} onClick={() => setClotting(!clotting)}>
              <div style={{ fontSize: "14px", color: "#0D0D0D" }}>Clotting present</div>
              <div style={{
                width: "44px", height: "24px", borderRadius: "100px",
                backgroundColor: clotting ? "#0D0D0D" : "#E8E4F0",
                position: "relative", transition: "background-color 0.2s ease",
              }}>
                <div style={{
                  position: "absolute", top: "2px", left: clotting ? "22px" : "2px",
                  width: "20px", height: "20px", borderRadius: "50%",
                  backgroundColor: "#FAF7F2", transition: "left 0.2s ease",
                }} />
              </div>
            </div>

            <div className="fade-up-6">
              <button onClick={handleLogPeriod} disabled={saving} style={{
                width: "100%",
                backgroundColor: saved ? "#D4E4D8" : "#0D0D0D",
                color: saved ? "#2A5A3A" : "#FAF7F2",
                border: "none", borderRadius: "100px", padding: "16px",
                fontSize: "15px", fontFamily: "DM Sans, sans-serif",
                fontWeight: "500", cursor: saving ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
              }}>
                {saving ? "Saving..." : saved ? "Logged ✓" : "Save log"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CycleTracker