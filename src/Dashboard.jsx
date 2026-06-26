import { useState, useEffect } from "react"

function Dashboard({ userData }) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeSheet, setActiveSheet] = useState(null)
  
  // Period log state
  const [periodFlow, setPeriodFlow] = useState(null)
  const [periodPain, setPeriodPain] = useState(0)
  const [periodSaved, setPeriodSaved] = useState(false)

  // Food log state
  const [foodText, setFoodText] = useState("")
  const [mealType, setMealType] = useState(null)
  const [foodSaved, setFoodSaved] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const calculateCycleInfo = () => {
    if (!userData?.lastPeriod) {
      return { cycleDay: null, phase: "unknown", daysUntilPeriod: null, phaseColor: "#E8E4F0" }
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
    const daysUntilPeriod = cycleLength - cycleDay
    const progress = (cycleDay / cycleLength) * 100
    return { cycleDay, phase, daysUntilPeriod, phaseColor, progress }
  }

  const { cycleDay, phase, daysUntilPeriod, phaseColor, progress } = calculateCycleInfo()

  const phaseLabel = {
    menstrual: "Menstrual phase",
    follicular: "Follicular phase",
    ovulatory: "Ovulatory phase",
    luteal: "Luteal phase",
    unknown: "Add your period date",
  }

  const insightCards = [
    {
      label: "Cycle insight",
      title: phase === "luteal" ? "Progesterone is rising"
        : phase === "ovulatory" ? "Peak energy window"
        : phase === "menstrual" ? "Rest and restore"
        : "Building momentum",
      body: phase === "luteal" ? "You may feel more tired and crave carbs — totally normal. Prioritise protein today."
        : phase === "ovulatory" ? "Your energy and focus are at their peak. Great time for workouts and social plans."
        : phase === "menstrual" ? "Iron-rich foods like dal and spinach will help restore your energy today."
        : "Oestrogen is rising — your mood and energy will improve over the next few days.",
      accent: phaseColor,
    },
    {
      label: "Nutrition",
      title: "What your body needs today",
      body: userData?.dietType === "vegetarian" || userData?.dietType === "vegan"
        ? "Dal, rajma, or paneer with your meals will keep your blood sugar stable today."
        : "Include protein with every meal — eggs, dal, or chicken with sabzi works perfectly.",
      accent: "#D4E4D8",
    },
    {
      label: "Symptom watch",
      title: "Track today's patterns",
      body: "Log your skin, energy, and mood daily — Metova needs 7 days of data to start detecting your personal patterns.",
      accent: "#E8E4F0",
    },
  ]

  const size = 220
const strokeWidth = 12
const radius = (size - strokeWidth) / 2
const circumference = 2 * Math.PI * radius
const strokeDashoffset = circumference - ((progress || 0) / 100) * circumference

// Outer black countdown arc
const outerSize = 220
const outerStrokeWidth = 3
const outerRadius = (outerSize / 2) - outerStrokeWidth
const outerCircumference = 2 * Math.PI * outerRadius
const daysRemaining = daysUntilPeriod || 0
const totalDays = 28
const outerProgress = daysRemaining / totalDays
const outerDashoffset = outerCircumference - (outerProgress * outerCircumference)

  const handlePeriodSave = () => {
    if (!periodFlow) return
    setPeriodSaved(true)
    setTimeout(() => {
      setActiveSheet(null)
      setPeriodSaved(false)
      setPeriodFlow(null)
      setPeriodPain(0)
    }, 1500)
  }

  const handleFoodSave = () => {
    if (!foodText.trim() || !mealType) return
    setFoodSaved(true)
    setTimeout(() => {
      setActiveSheet(null)
      setFoodSaved(false)
      setFoodText("")
      setMealType(null)
    }, 1500)
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF7F2",
      fontFamily: "DM Sans, sans-serif",
      paddingBottom: "100px",
    }}>

      {/* Top bar */}
      <div className="fade-up-1" style={{
        padding: "52px 24px 0",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <div style={{
          fontSize: "26px",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500",
          color: "#0D0D0D",
        }}>
          Hello, {userData?.fullName?.split(" ")[0] || "there"}
        </div>
        <div style={{ fontSize: "13px", color: "#6B6560", marginTop: "4px" }}>
          {phaseLabel[phase]}
        </div>
      </div>

      {/* Cycle ring */}
      <div className="fade-up-2" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "32px 0 24px",
      }}>
        <div style={{ position: "relative", width: size, height: size }}>
          <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
  {/* Base track */}
  <circle
    cx={size / 2} cy={size / 2} r={radius}
    fill="none" stroke="#E8E4F0" strokeWidth={strokeWidth}
  />
  {/* Phase color arc */}
  <circle
    cx={size / 2} cy={size / 2} r={radius}
    fill="none" stroke={phaseColor} strokeWidth={strokeWidth}
    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
    strokeLinecap="round"
    style={{ transition: "stroke-dashoffset 0.6s ease" }}
  />
  {/* Outer black countdown arc */}
  <circle
    cx={outerSize / 2} cy={outerSize / 2} r={outerRadius}
    fill="none" stroke="#0D0D0D" strokeWidth={outerStrokeWidth}
    strokeDasharray={outerCircumference}
    strokeDashoffset={outerDashoffset}
    strokeLinecap="round"
    style={{ transition: "stroke-dashoffset 0.6s ease" }}
  />
</svg>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", textAlign: "center",
          }}>
            {cycleDay ? (
              <>
                <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Day</div>
                <div style={{ fontSize: "42px", fontFamily: "Cormorant Garamond, serif", fontWeight: "400", color: "#0D0D0D", lineHeight: "1" }}>{cycleDay}</div>
                <div style={{ fontSize: "11px", color: "#6B6560", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{phase}</div>
              </>
            ) : (
              <div style={{ fontSize: "12px", color: "#6B6560", textAlign: "center", maxWidth: "80px", lineHeight: "1.4" }}>
                Log your period to start
              </div>
            )}
          </div>
        </div>

        {daysUntilPeriod !== null && daysUntilPeriod > 0 && (
          <div style={{ marginTop: "12px", fontSize: "13px", color: "#6B6560" }}>
            Next period in{" "}
            <span style={{ color: "#0D0D0D", fontWeight: "500" }}>~{daysUntilPeriod} days</span>
          </div>
        )}
      </div>

      {/* Quick log buttons — Period + Food only */}
      <div className="fade-up-3" style={{
        padding: "0 24px",
        maxWidth: "480px",
        margin: "0 auto 28px",
      }}>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          {[
            { label: "Log Period", emoji: "🩸", key: "period" },
            { label: "Log Food", emoji: "🍱", key: "food" },
          ].map((log) => (
            <div
              key={log.key}
              onClick={() => setActiveSheet(log.key)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                backgroundColor: "#FDF0EC",
                border: "0.5px solid #E8E4F0",
                borderRadius: "16px",
                padding: "16px 12px",
              }}
            >
              <div style={{ fontSize: "24px" }}>{log.emoji}</div>
              <div style={{ fontSize: "12px", color: "#0D0D0D", fontWeight: "500" }}>{log.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's insights */}
      <div className="fade-up-4" style={{ padding: "0 24px", maxWidth: "480px", margin: "0 auto" }}>
        <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
          Today's insights
        </div>
      </div>

      {insightCards.map((card, i) => (
        <div key={i} className={`fade-up-${i + 5}`} style={{ padding: "0 24px", maxWidth: "480px", margin: "0 auto" }}>
          <div style={{
            backgroundColor: "#FDF0EC",
            border: "0.5px solid #E8E4F0",
            borderLeft: `3px solid ${card.accent}`,
            borderRadius: "0 16px 16px 0",
            padding: "16px 20px",
            marginBottom: "12px",
          }}>
            <div style={{ fontSize: "10px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>{card.label}</div>
            <div style={{ fontSize: "15px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D", marginBottom: "6px" }}>{card.title}</div>
            <div style={{ fontSize: "13px", color: "#6B6560", lineHeight: "1.6" }}>{card.body}</div>
          </div>
        </div>
      ))}

      {/* Hormone Horoscope teaser */}
      <div className="fade-up-8" style={{ padding: "0 24px", maxWidth: "480px", margin: "16px auto 0" }}>
        <div style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderRadius: "20px",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: "10px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>This week</div>
            <div style={{ fontSize: "17px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D" }}>Your Hormone Horoscope ✦</div>
            <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>Ready every Sunday</div>
          </div>
          <div style={{ fontSize: "24px" }}>🌙</div>
        </div>
      </div>

      {/* PERIOD LOG BOTTOM SHEET */}
      {activeSheet === "period" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "flex-end",
        }}
          onClick={() => setActiveSheet(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fade-up-1"
            style={{
              width: "100%",
              backgroundColor: "#FAF7F2",
              borderRadius: "24px 24px 0 0",
              padding: "28px 24px 48px",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            <div style={{ width: "36px", height: "4px", backgroundColor: "#E8E4F0", borderRadius: "2px", margin: "0 auto 24px" }} />
            
            <div style={{ fontSize: "20px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D", marginBottom: "4px" }}>
              Log your period
            </div>
            <div style={{ fontSize: "13px", color: "#6B6560", marginBottom: "24px" }}>
              How is your flow today?
            </div>

            {/* Flow intensity */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
              {["Light", "Medium", "Heavy", "Spotting"].map((flow) => (
                <div
                  key={flow}
                  onClick={() => setPeriodFlow(flow)}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    borderRadius: "12px",
                    border: `1px solid ${periodFlow === flow ? "#F2C4CE" : "#E8E4F0"}`,
                    backgroundColor: periodFlow === flow ? "#FDF0EC" : "transparent",
                    textAlign: "center",
                    cursor: "pointer",
                    fontSize: "11px",
                    fontWeight: periodFlow === flow ? "500" : "400",
                    color: periodFlow === flow ? "#0D0D0D" : "#6B6560",
                    transition: "all 0.2s ease",
                  }}
                >
                  {flow}
                </div>
              ))}
            </div>

            {/* Pain level */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "13px", color: "#0D0D0D", fontWeight: "500", marginBottom: "12px" }}>
                Pain level <span style={{ color: "#6B6560", fontWeight: "400" }}>({periodPain}/10)</span>
              </div>
              <input
                type="range" min="0" max="10" value={periodPain}
                onChange={(e) => setPeriodPain(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#F2C4CE" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B6560", marginTop: "4px" }}>
                <span>No pain</span>
                <span>Severe</span>
              </div>
            </div>

            {/* Save button */}
            <div
              onClick={handlePeriodSave}
              style={{
                backgroundColor: periodSaved ? "#D4E4D8" : "#0D0D0D",
                color: "#FAF7F2",
                borderRadius: "100px",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
            >
              {periodSaved ? "Logged ✓" : "Save log"}
            </div>
          </div>
        </div>
      )}

      {/* FOOD LOG BOTTOM SHEET */}
      {activeSheet === "food" && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 100,
          backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "flex-end",
        }}
          onClick={() => setActiveSheet(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fade-up-1"
            style={{
              width: "100%",
              backgroundColor: "#FAF7F2",
              borderRadius: "24px 24px 0 0",
              padding: "28px 24px 48px",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            <div style={{ width: "36px", height: "4px", backgroundColor: "#E8E4F0", borderRadius: "2px", margin: "0 auto 24px" }} />

            <div style={{ fontSize: "20px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D", marginBottom: "4px" }}>
              Log your meal
            </div>
            <div style={{ fontSize: "13px", color: "#6B6560", marginBottom: "24px" }}>
              What did you eat?
            </div>

            {/* Meal type */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {["Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
                <div
                  key={type}
                  onClick={() => setMealType(type)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "100px",
                    border: `1px solid ${mealType === type ? "#0D0D0D" : "#E8E4F0"}`,
                    backgroundColor: mealType === type ? "#0D0D0D" : "transparent",
                    color: mealType === type ? "#FAF7F2" : "#6B6560",
                    fontSize: "12px",
                    fontWeight: mealType === type ? "500" : "400",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {type}
                </div>
              ))}
            </div>

            {/* Food text input */}
            <textarea
              placeholder="e.g. Idli with sambar and coconut chutney..."
              value={foodText}
              onChange={(e) => setFoodText(e.target.value)}
              rows={3}
              style={{
                width: "100%",
                backgroundColor: "#FDF0EC",
                border: "0.5px solid #E8E4F0",
                borderRadius: "16px",
                padding: "14px 16px",
                fontSize: "14px",
                color: "#0D0D0D",
                fontFamily: "DM Sans, sans-serif",
                resize: "none",
                outline: "none",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
            />

            <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "20px" }}>
              ✦ AI meal analysis coming soon — we'll tell you the insulin impact of your meal!
            </div>

            {/* Save button */}
            <div
              onClick={handleFoodSave}
              style={{
                backgroundColor: foodSaved ? "#D4E4D8" : "#0D0D0D",
                color: "#FAF7F2",
                borderRadius: "100px",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
            >
              {foodSaved ? "Logged ✓" : "Save meal"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard