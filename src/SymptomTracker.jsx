import { useState } from "react"
import { supabase } from "./supabase"

function SymptomTracker({ userData }) {
  const [energyLevel, setEnergyLevel] = useState(5)
  const [moodScore, setMoodScore] = useState(5)
  const [stressLevel, setStressLevel] = useState(5)
  const [sleepHours, setSleepHours] = useState(7)
  const [sleepQuality, setSleepQuality] = useState(3)
  const [hairShedding, setHairShedding] = useState(1)
  const [waterIntake, setWaterIntake] = useState(0)
  const [exerciseDone, setExerciseDone] = useState(false)
  const [acneZones, setAcneZones] = useState({
    forehead: false,
    leftCheek: false,
    rightCheek: false,
    chin: false,
    jawline: false,
    nose: false,
  })
  const [moodTags, setMoodTags] = useState([])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const toggleZone = (zone) => {
    setAcneZones({ ...acneZones, [zone]: !acneZones[zone] })
  }

  const toggleMoodTag = (tag) => {
    if (moodTags.includes(tag)) {
      setMoodTags(moodTags.filter((t) => t !== tag))
    } else {
      setMoodTags([...moodTags, tag])
    }
  }

  const handleSave = async () => {
    console.log("1. Save clicked!")
    setSaving(true)
    setError(null)

    try {
      console.log("2. Getting session...")
      const { data: { session } } = await supabase.auth.getSession()
      console.log("3. Session:", session)

      if (!session?.user) {
        console.log("4. No user found!")
        setError("Not logged in")
        setSaving(false)
        return
      }

      console.log("5. User found:", session.user.id)
      const today = new Date().toISOString().split("T")[0]
      console.log("6. Saving for date:", today)

      const { error: symptomError } = await supabase
        .from("daily_symptom_logs")
        .upsert({
          user_id: session.user.id,
          log_date: today,
          energy_level: energyLevel,
          mood_score: moodScore,
          mood_tags: moodTags,
          sleep_hours: sleepHours,
          sleep_quality: sleepQuality,
          hair_shedding_scale: hairShedding,
          stress_level: stressLevel,
          exercise_done: exerciseDone,
          water_intake_ml: waterIntake * 250,
        }, { onConflict: "user_id, log_date" })

      console.log("7. Symptom error:", symptomError)

      const { error: skinError } = await supabase
        .from("skin_logs")
        .upsert({
          user_id: session.user.id,
          log_date: today,
          acne_zones: acneZones,
        }, { onConflict: "user_id, log_date" })

      console.log("8. Skin error:", skinError)

      if (!symptomError && !skinError) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError("Failed to save — check console")
      }

    } catch (err) {
      console.error("9. Catch error:", err)
      setError("Something went wrong")
    }

    setSaving(false)
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const labelStyle = {
    fontSize: "11px",
    fontFamily: "DM Sans, sans-serif",
    color: "#6B6560",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "12px",
    display: "block",
  }

  const cardStyle = {
    backgroundColor: "#FDF0EC",
    border: "0.5px solid #E8E4F0",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "12px",
  }

  const sliderStyle = {
    width: "100%",
    accentColor: "#0D0D0D",
    margin: "8px 0",
  }

  const moodTagOptions = [
    "Anxious", "Calm", "Irritable",
    "Focused", "Foggy", "Sad",
    "Energised", "Tired", "Happy",
  ]

  const hairLabels = ["None", "Minimal", "Moderate", "Notable", "Severe"]
  const sleepQualityLabels = ["Poor", "Fair", "Okay", "Good", "Great"]

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF7F2",
      fontFamily: "DM Sans, sans-serif",
      paddingBottom: "100px",
    }}>

      {/* Header */}
      <div style={{ padding: "52px 24px 24px", maxWidth: "480px", margin: "0 auto" }}>
        <h1 className="fade-up-1" style={{
          fontSize: "28px",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500",
          color: "#0D0D0D",
          margin: "0 0 4px",
        }}>
          Daily symptom log
        </h1>
        <p className="fade-up-2" style={{ fontSize: "13px", color: "#6B6560", margin: "0" }}>
          {today}
        </p>
      </div>

      <div style={{ padding: "0 24px", maxWidth: "480px", margin: "0 auto" }}>

        {/* SKIN */}
        <div className="fade-up-3" style={cardStyle}>
          <label style={labelStyle}>Skin — tap zones with acne</label>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{ position: "relative", width: "180px", height: "220px" }}>
              <svg viewBox="0 0 180 220" width="180" height="220"
                style={{ position: "absolute", top: 0, left: 0 }}>
                <ellipse cx="90" cy="115" rx="70" ry="90"
                  fill="#FDF0EC" stroke="#E8E4F0" strokeWidth="1" />
                <ellipse cx="65" cy="100" rx="8" ry="5" fill="#E8E4F0" />
                <ellipse cx="115" cy="100" rx="8" ry="5" fill="#E8E4F0" />
                <ellipse cx="90" cy="125" rx="5" ry="7" fill="#E8E4F0" />
                <path d="M 72 148 Q 90 160 108 148" fill="none"
                  stroke="#E8E4F0" strokeWidth="2" strokeLinecap="round" />
              </svg>

              {[
                { key: "forehead", label: "Forehead", style: { top: "18px", left: "50%", transform: "translateX(-50%)", width: "80px", height: "30px", borderRadius: "100px" } },
                { key: "leftCheek", label: "L", style: { top: "110px", left: "8px", width: "36px", height: "36px", borderRadius: "50%" } },
                { key: "rightCheek", label: "R", style: { top: "110px", right: "8px", width: "36px", height: "36px", borderRadius: "50%" } },
                { key: "nose", label: "N", style: { top: "118px", left: "50%", transform: "translateX(-50%)", width: "28px", height: "28px", borderRadius: "50%" } },
                { key: "chin", label: "Chin", style: { bottom: "30px", left: "50%", transform: "translateX(-50%)", width: "44px", height: "28px", borderRadius: "100px" } },
                { key: "jawline", label: "Jawline", style: { bottom: "8px", left: "50%", transform: "translateX(-50%)", width: "110px", height: "22px", borderRadius: "100px" } },
              ].map(({ key, label, style }) => (
                <div key={key} onClick={() => toggleZone(key)} style={{
                  position: "absolute", ...style,
                  backgroundColor: acneZones[key] ? "#F2C4CE" : "transparent",
                  border: acneZones[key] ? "1.5px solid #E8A0B0" : "1.5px dashed #E8E4F0",
                  cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "9px",
                  color: acneZones[key] ? "#8A3A4A" : "#6B6560",
                  fontFamily: "DM Sans, sans-serif", transition: "all 0.2s ease",
                }}>{label}</div>
              ))}
            </div>
          </div>

          {Object.values(acneZones).some(Boolean) && (
            <div style={{ fontSize: "12px", color: "#6B6560", textAlign: "center", marginTop: "8px" }}>
              Acne logged:{" "}
              <span style={{ color: "#0D0D0D", fontWeight: "500" }}>
                {Object.entries(acneZones)
                  .filter(([_, v]) => v)
                  .map(([k]) => k.replace(/([A-Z])/g, " $1").toLowerCase())
                  .join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* HAIR SHEDDING */}
        <div className="fade-up-4" style={cardStyle}>
          <label style={labelStyle}>Hair shedding — {hairLabels[hairShedding - 1]}</label>
          <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
            {[1, 2, 3, 4, 5].map((level) => (
              <button key={level} onClick={() => setHairShedding(level)} style={{
                flex: 1, padding: "12px 4px", borderRadius: "12px",
                border: hairShedding === level ? "1px solid #0D0D0D" : "0.5px solid #E8E4F0",
                backgroundColor: hairShedding === level ? "#E8E4F0" : "#FAF7F2",
                color: "#0D0D0D", fontSize: "13px",
                fontFamily: "DM Sans, sans-serif", cursor: "pointer",
                fontWeight: hairShedding === level ? "500" : "400",
              }}>{level}</button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6B6560", marginTop: "6px" }}>
            <span>None</span><span>Severe</span>
          </div>
        </div>

        {/* ENERGY */}
        <div className="fade-up-5" style={cardStyle}>
          <label style={labelStyle}>Energy level — {energyLevel}/10</label>
          <input type="range" min="1" max="10" value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))} style={sliderStyle} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6B6560" }}>
            <span>Exhausted</span><span>Energised</span>
          </div>
        </div>

        {/* MOOD */}
        <div className="fade-up-6" style={cardStyle}>
          <label style={labelStyle}>Mood — {moodScore}/10</label>
          <input type="range" min="1" max="10" value={moodScore}
            onChange={(e) => setMoodScore(Number(e.target.value))} style={sliderStyle} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6B6560", marginBottom: "12px" }}>
            <span>Low</span><span>Great</span>
          </div>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            How are you feeling?
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {moodTagOptions.map((tag) => (
              <button key={tag} onClick={() => toggleMoodTag(tag)} style={{
                padding: "6px 14px", borderRadius: "100px",
                border: moodTags.includes(tag) ? "1px solid #0D0D0D" : "0.5px solid #E8E4F0",
                backgroundColor: moodTags.includes(tag) ? "#E8E4F0" : "#FAF7F2",
                color: "#0D0D0D", fontSize: "12px",
                fontFamily: "DM Sans, sans-serif", cursor: "pointer",
              }}>{tag}</button>
            ))}
          </div>
        </div>

        {/* SLEEP */}
        <div className="fade-up-7" style={cardStyle}>
          <label style={labelStyle}>Sleep — {sleepHours} hours</label>
          <input type="range" min="2" max="12" step="0.5" value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))} style={sliderStyle} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6B6560", marginBottom: "16px" }}>
            <span>2h</span><span>12h</span>
          </div>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            Sleep quality — {sleepQualityLabels[sleepQuality - 1]}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3, 4, 5].map((q) => (
              <button key={q} onClick={() => setSleepQuality(q)} style={{
                flex: 1, padding: "10px 4px", borderRadius: "12px",
                border: sleepQuality === q ? "1px solid #0D0D0D" : "0.5px solid #E8E4F0",
                backgroundColor: sleepQuality === q ? "#E8E4F0" : "#FAF7F2",
                color: "#0D0D0D", fontSize: "12px",
                fontFamily: "DM Sans, sans-serif", cursor: "pointer",
              }}>{q}</button>
            ))}
          </div>
        </div>

        {/* STRESS */}
        <div className="fade-up-8" style={cardStyle}>
          <label style={labelStyle}>Stress level — {stressLevel}/10</label>
          <input type="range" min="1" max="10" value={stressLevel}
            onChange={(e) => setStressLevel(Number(e.target.value))} style={sliderStyle} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#6B6560" }}>
            <span>Calm</span><span>Very stressed</span>
          </div>
        </div>

        {/* WATER INTAKE */}
        <div className="fade-up-9" style={cardStyle}>
          <label style={labelStyle}>Water intake — {waterIntake} glasses</label>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", justifyContent: "center" }}>
            <button onClick={() => setWaterIntake(Math.max(0, waterIntake - 1))} style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: "0.5px solid #E8E4F0", backgroundColor: "#FAF7F2",
              fontSize: "20px", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", color: "#0D0D0D",
            }}>−</button>
            <div style={{
              fontSize: "36px", fontFamily: "Cormorant Garamond, serif",
              color: "#0D0D0D", minWidth: "60px", textAlign: "center",
            }}>{waterIntake}</div>
            <button onClick={() => setWaterIntake(waterIntake + 1)} style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: "0.5px solid #E8E4F0", backgroundColor: "#FAF7F2",
              fontSize: "20px", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", color: "#0D0D0D",
            }}>+</button>
          </div>
          <div style={{ textAlign: "center", fontSize: "11px", color: "#6B6560", marginTop: "8px" }}>
            Aim for 8+ glasses daily
          </div>
        </div>

        {/* EXERCISE */}
        <div className="fade-up-10" style={{
          ...cardStyle,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", cursor: "pointer",
        }} onClick={() => setExerciseDone(!exerciseDone)}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "500", color: "#0D0D0D", marginBottom: "2px" }}>
              Exercise today
            </div>
            <div style={{ fontSize: "12px", color: "#6B6560" }}>
              Any movement counts
            </div>
          </div>
          <div style={{
            width: "44px", height: "24px", borderRadius: "100px",
            backgroundColor: exerciseDone ? "#0D0D0D" : "#E8E4F0",
            position: "relative", transition: "background-color 0.2s ease", flexShrink: 0,
          }}>
            <div style={{
              position: "absolute", top: "2px",
              left: exerciseDone ? "22px" : "2px",
              width: "20px", height: "20px", borderRadius: "50%",
              backgroundColor: "#FAF7F2", transition: "left 0.2s ease",
            }} />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div style={{
            backgroundColor: "#FDE8E8", border: "0.5px solid #F2C4C4",
            borderRadius: "12px", padding: "12px 16px",
            fontSize: "13px", color: "#8A3A3A", marginBottom: "12px",
          }}>
            {error}
          </div>
        )}

        {/* Save button */}
        <div className="fade-up-10" style={{ marginTop: "8px" }}>
          <button onClick={handleSave} style={{
            width: "100%",
            backgroundColor: saved ? "#D4E4D8" : "#0D0D0D",
            color: saved ? "#2A5A3A" : "#FAF7F2",
            border: "none", borderRadius: "100px", padding: "16px",
            fontSize: "15px", fontFamily: "DM Sans, sans-serif",
            fontWeight: "500", cursor: saving ? "not-allowed" : "pointer",
            transition: "all 0.3s ease", opacity: saving ? 0.7 : 1,
          }}>
            {saving ? "Saving..." : saved ? "Saved today's log ✓" : "Save today's log"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default SymptomTracker