import { useState, useEffect } from "react"
import { supabase } from "./supabase"

function Profile({ userData, onSignOut }) {
  const [notificationsOn, setNotificationsOn] = useState(true)
  const [horoscopeOn, setHoroscopeOn] = useState(true)
  const [cycleAlertsOn, setCycleAlertsOn] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [exported, setExported] = useState(false)
  const [healthData, setHealthData] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Edit sheet state
  const [editSheet, setEditSheet] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      const { data: health } = await supabase
        .from("health_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single()

      setProfileData(profile)
      setHealthData(health)
    } catch (err) {
      console.error("Error fetching profile:", err)
    }
    setLoading(false)
  }

  const handleEdit = (field, currentValue) => {
    setEditSheet(field)
    setEditValue(currentValue || "")
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      if (editSheet === "fullName") {
        await supabase.from("profiles").upsert({
          id: session.user.id,
          full_name: editValue,
        })
      } else if (editSheet === "city") {
        await supabase.from("health_profiles").upsert({
          user_id: session.user.id,
          city: editValue,
        })
      } else if (editSheet === "dietType") {
        await supabase.from("health_profiles").upsert({
          user_id: session.user.id,
          diet_type: editValue.toLowerCase(),
        })
      } else if (editSheet === "activityLevel") {
        await supabase.from("health_profiles").upsert({
          user_id: session.user.id,
          activity_level: editValue.toLowerCase(),
        })
      } else if (editSheet === "pcosStatus") {
        await supabase.from("health_profiles").upsert({
          user_id: session.user.id,
          pcos_diagnosis_status: editValue.toLowerCase(),
        })
      }

      await fetchProfile()
      setEditSheet(null)
      setEditValue("")
    } catch (err) {
      console.error("Save error:", err)
    }
    setSaving(false)
  }

  const handleExport = () => {
    setExportLoading(true)
    setTimeout(() => {
      const exportData = {
        profile: profileData,
        healthProfile: healthData,
        exportedAt: new Date().toISOString(),
        exportedBy: "Metova Health",
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `metova-health-data.json`
      a.click()
      URL.revokeObjectURL(url)
      setExportLoading(false)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    }, 1500)
  }

  const name = profileData?.full_name || userData?.fullName || "there"
  const firstName = name.split(" ")[0]
  const city = healthData?.city || "Not set"
  const pcosStatus = healthData?.pcos_diagnosis_status || "Not set"
  const dietType = healthData?.diet_type || "Not set"
  const activityLevel = healthData?.activity_level || "Not set"

  const sectionLabelStyle = {
    fontSize: "11px", fontFamily: "DM Sans, sans-serif",
    color: "#6B6560", letterSpacing: "0.08em",
    textTransform: "uppercase", marginBottom: "8px",
    display: "block", paddingLeft: "4px",
  }

  const cardStyle = {
    backgroundColor: "#FDF0EC", border: "0.5px solid #E8E4F0",
    borderRadius: "16px", overflow: "hidden", marginBottom: "12px",
  }

  const rowStyle = {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "16px 20px",
    borderBottom: "0.5px solid #E8E4F0", cursor: "pointer",
  }

  const lastRowStyle = { ...rowStyle, borderBottom: "none" }

  const rowLabelStyle = { fontSize: "14px", color: "#0D0D0D", fontFamily: "DM Sans, sans-serif" }
  const rowSubStyle = { fontSize: "12px", color: "#6B6560", fontFamily: "DM Sans, sans-serif", marginTop: "2px" }

  const toggleStyle = (on) => ({
    width: "44px", height: "24px", borderRadius: "100px",
    backgroundColor: on ? "#0D0D0D" : "#E8E4F0",
    position: "relative", transition: "background-color 0.2s ease",
    flexShrink: 0, cursor: "pointer",
  })

  const toggleKnobStyle = (on) => ({
    position: "absolute", top: "2px", left: on ? "22px" : "2px",
    width: "20px", height: "20px", borderRadius: "50%",
    backgroundColor: "#FAF7F2", transition: "left 0.2s ease",
  })

  const chevron = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#6B6560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const comingSoonBadge = (
    <span style={{
      fontSize: "9px", fontFamily: "DM Sans, sans-serif",
      color: "#CFC1BA", border: "0.5px solid #CFC1BA",
      borderRadius: "100px", padding: "2px 8px",
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>Soon</span>
  )

  // Edit sheet options
  const editOptions = {
    dietType: ["vegetarian", "vegan", "non_vegetarian", "gluten_free", "no_restriction"],
    activityLevel: ["sedentary", "light", "moderate", "active"],
    pcosStatus: ["diagnosed", "suspected", "unsure", "exploring"],
  }

  const editLabels = {
    fullName: "Full name",
    city: "City",
    dietType: "Diet type",
    activityLevel: "Activity level",
    pcosStatus: "PCOS status",
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#FAF7F2",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "DM Sans, sans-serif", color: "#6B6560", fontSize: "14px",
      }}>
        Loading your profile...
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#FAF7F2", fontFamily: "DM Sans, sans-serif", paddingBottom: "100px" }}>

      {/* Header */}
      <div style={{ padding: "52px 24px 24px", maxWidth: "480px", margin: "0 auto" }}>
        <h1 className="fade-up-1" style={{
          fontSize: "28px", fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500", color: "#0D0D0D", margin: "0 0 24px",
        }}>
          Profile
        </h1>

        {/* Profile card */}
        <div className="fade-up-2" style={{
          backgroundColor: "#FDF0EC", border: "0.5px solid #E8E4F0",
          borderRadius: "20px", padding: "24px", marginBottom: "24px",
          display: "flex", alignItems: "center", gap: "16px",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            backgroundColor: "#E8E4F0", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: "22px", fontFamily: "Cormorant Garamond, serif",
            color: "#3D3935", flexShrink: 0,
          }}>
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "18px", fontFamily: "Cormorant Garamond, serif",
              fontWeight: "500", color: "#0D0D0D", marginBottom: "2px",
            }}>
              {name}
            </div>
            <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "8px" }}>
              {city} · {pcosStatus}
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              backgroundColor: "#0D0D0D", color: "#FAF7F2",
              fontSize: "10px", fontFamily: "DM Sans, sans-serif",
              fontWeight: "500", letterSpacing: "0.06em",
              padding: "4px 10px", borderRadius: "100px",
            }}>
              ✦ Free plan
            </div>
          </div>
          <div onClick={() => handleEdit("fullName", name)} style={{ cursor: "pointer" }}>
            {chevron}
          </div>
        </div>
      </div>

      <div style={{ padding: "0 24px", maxWidth: "480px", margin: "0 auto" }}>

        {/* Health profile */}
        <label className="fade-up-3" style={sectionLabelStyle}>Health profile</label>
        <div className="fade-up-4" style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={rowStyle} onClick={() => handleEdit("city", city)}>
            <div>
              <div style={rowLabelStyle}>City</div>
              <div style={rowSubStyle}>{city}</div>
            </div>
            {chevron}
          </div>
          <div style={rowStyle} onClick={() => handleEdit("pcosStatus", pcosStatus)}>
            <div>
              <div style={rowLabelStyle}>PCOS status</div>
              <div style={rowSubStyle}>{pcosStatus}</div>
            </div>
            {chevron}
          </div>
          <div style={rowStyle} onClick={() => handleEdit("dietType", dietType)}>
            <div>
              <div style={rowLabelStyle}>Diet type</div>
              <div style={rowSubStyle}>{dietType}</div>
            </div>
            {chevron}
          </div>
          <div style={lastRowStyle} onClick={() => handleEdit("activityLevel", activityLevel)}>
            <div>
              <div style={rowLabelStyle}>Activity level</div>
              <div style={rowSubStyle}>{activityLevel}</div>
            </div>
            {chevron}
          </div>
        </div>

        {/* Subscription */}
        <label className="fade-up-5" style={sectionLabelStyle}>Subscription</label>
        <div className="fade-up-6" style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={rowStyle}>
            <div>
              <div style={rowLabelStyle}>Current plan</div>
              <div style={rowSubStyle}>Free tier</div>
            </div>
            <span style={{ fontSize: "12px", color: "#CFC1BA", fontFamily: "DM Sans, sans-serif", fontWeight: "500" }}>
              Upgrade ✦
            </span>
          </div>
          <div style={lastRowStyle}>
            <div>
              <div style={rowLabelStyle}>Manage subscription</div>
              <div style={rowSubStyle}>Billing, invoices, cancel</div>
            </div>
            {chevron}
          </div>
        </div>

        {/* Notifications */}
        <label className="fade-up-7" style={sectionLabelStyle}>Notifications</label>
        <div className="fade-up-8" style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={rowStyle}>
            <div>
              <div style={rowLabelStyle}>Smart cycle alerts</div>
              <div style={rowSubStyle}>Period predictions + phase changes</div>
            </div>
            <div style={toggleStyle(cycleAlertsOn)} onClick={() => setCycleAlertsOn(!cycleAlertsOn)}>
              <div style={toggleKnobStyle(cycleAlertsOn)} />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <div style={rowLabelStyle}>Hormone Horoscope</div>
              <div style={rowSubStyle}>Every Sunday morning</div>
            </div>
            <div style={toggleStyle(horoscopeOn)} onClick={() => setHoroscopeOn(!horoscopeOn)}>
              <div style={toggleKnobStyle(horoscopeOn)} />
            </div>
          </div>
          <div style={lastRowStyle}>
            <div>
              <div style={rowLabelStyle}>Daily log reminder</div>
              <div style={rowSubStyle}>Gentle nudge to track today</div>
            </div>
            <div style={toggleStyle(notificationsOn)} onClick={() => setNotificationsOn(!notificationsOn)}>
              <div style={toggleKnobStyle(notificationsOn)} />
            </div>
          </div>
        </div>

        {/* Connected devices */}
        <label className="fade-up-9" style={sectionLabelStyle}>Connected devices</label>
        <div className="fade-up-10" style={{ ...cardStyle, marginBottom: "20px" }}>
          {[
            { name: "Apple Health", sub: "Sync cycle, sleep + activity", emoji: "🍎" },
            { name: "Google Fit", sub: "Sync activity + sleep data", emoji: "🏃" },
            { name: "Fitbit", sub: "Sync HRV + stress scores", emoji: "⌚" },
          ].map((device, i) => (
            <div key={device.name} style={i === 2 ? lastRowStyle : rowStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  backgroundColor: "#FAF7F2", border: "0.5px solid #E8E4F0",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                }}>
                  {device.emoji}
                </div>
                <div>
                  <div style={rowLabelStyle}>{device.name}</div>
                  <div style={rowSubStyle}>{device.sub}</div>
                </div>
              </div>
              {comingSoonBadge}
            </div>
          ))}
        </div>

        {/* Data & privacy */}
        <label className="fade-up-10" style={sectionLabelStyle}>Data & privacy</label>
        <div className="fade-up-10" style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={rowStyle}>
            <div>
              <div style={rowLabelStyle}>Export my data</div>
              <div style={rowSubStyle}>Download your full health record</div>
            </div>
            <button onClick={handleExport} disabled={exportLoading} style={{
              backgroundColor: exported ? "#D4E4D8" : "#0D0D0D",
              color: exported ? "#2A5A3A" : "#FAF7F2",
              border: "none", borderRadius: "100px",
              padding: "8px 16px", fontSize: "11px",
              fontFamily: "DM Sans, sans-serif", fontWeight: "500",
              cursor: exportLoading ? "default" : "pointer",
              transition: "all 0.3s ease", flexShrink: 0,
            }}>
              {exportLoading ? "Preparing..." : exported ? "Downloaded ✓" : "Export"}
            </button>
          </div>
          <div style={rowStyle}>
            <div>
              <div style={rowLabelStyle}>Privacy policy</div>
              <div style={rowSubStyle}>How we protect your data</div>
            </div>
            {chevron}
          </div>
          <div style={lastRowStyle}>
            <div>
              <div style={rowLabelStyle}>Delete my account</div>
              <div style={rowSubStyle}>Permanently remove all data</div>
            </div>
            <span style={{ fontSize: "12px", color: "#F2C4CE", fontFamily: "DM Sans, sans-serif" }}>Delete</span>
          </div>
        </div>

        {/* About */}
        <label className="fade-up-10" style={sectionLabelStyle}>About</label>
        <div className="fade-up-10" style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={rowStyle}>
            <div style={rowLabelStyle}>Version</div>
            <div style={{ fontSize: "12px", color: "#6B6560" }}>1.0.0 (beta)</div>
          </div>
          <div style={lastRowStyle}>
            <div style={rowLabelStyle}>Built in India</div>
            <div style={{ fontSize: "12px", color: "#6B6560" }}>Metova Health</div>
          </div>
        </div>

        {/* Sign out */}
        <div className="fade-up-10">
          <button onClick={() => {
            if (window.confirm("Are you sure you want to sign out?")) {
              onSignOut && onSignOut()
            }
          }} style={{
            width: "100%", backgroundColor: "transparent",
            border: "0.5px solid #E8E4F0", borderRadius: "100px",
            padding: "16px", fontSize: "15px",
            fontFamily: "DM Sans, sans-serif",
            color: "#6B6560", cursor: "pointer", marginBottom: "12px",
          }}>
            Sign out
          </button>

          <div style={{
            textAlign: "center", fontSize: "11px",
            color: "#6B6560", lineHeight: "1.6", padding: "0 20px",
          }}>
            Metova is not a medical device and does not provide medical advice.
            Always consult your healthcare provider.
          </div>
        </div>
      </div>

      {/* EDIT BOTTOM SHEET */}
      {editSheet && (
        <div onClick={() => setEditSheet(null)} style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.3)",
          display: "flex", alignItems: "flex-end", zIndex: 100,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%", backgroundColor: "#FAF7F2",
            borderRadius: "24px 24px 0 0", padding: "28px 24px 48px",
            maxWidth: "480px", margin: "0 auto",
          }}>
            <div style={{ width: "36px", height: "4px", backgroundColor: "#E8E4F0", borderRadius: "2px", margin: "0 auto 24px" }} />

            <div style={{
              fontSize: "20px", fontFamily: "Cormorant Garamond, serif",
              fontWeight: "500", color: "#0D0D0D", marginBottom: "20px",
            }}>
              Edit {editLabels[editSheet]}
            </div>

            {/* Text input fields */}
            {(editSheet === "fullName" || editSheet === "city") && (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={editSheet === "fullName" ? "Your full name" : "Your city"}
                style={{
                  width: "100%", backgroundColor: "#FDF0EC",
                  border: "0.5px solid #E8E4F0", borderRadius: "12px",
                  padding: "14px 16px", fontSize: "15px",
                  color: "#0D0D0D", fontFamily: "DM Sans, sans-serif",
                  outline: "none", marginBottom: "20px", boxSizing: "border-box",
                }}
              />
            )}

            {/* Pill selector fields */}
            {editOptions[editSheet] && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "24px" }}>
                {editOptions[editSheet].map((option) => (
                  <div key={option} onClick={() => setEditValue(option)} style={{
                    padding: "10px 18px", borderRadius: "100px",
                    border: `1px solid ${editValue === option ? "#0D0D0D" : "#E8E4F0"}`,
                    backgroundColor: editValue === option ? "#0D0D0D" : "transparent",
                    color: editValue === option ? "#FAF7F2" : "#6B6560",
                    fontSize: "13px", cursor: "pointer",
                    fontFamily: "DM Sans, sans-serif",
                    transition: "all 0.2s ease",
                  }}>
                    {option.replace(/_/g, " ")}
                  </div>
                ))}
              </div>
            )}

            <div onClick={handleSave} style={{
              backgroundColor: saving ? "#E8E4F0" : "#0D0D0D",
              color: "#FAF7F2", borderRadius: "100px", padding: "16px",
              textAlign: "center", cursor: "pointer", fontSize: "15px",
              fontWeight: "500", fontFamily: "DM Sans, sans-serif",
              transition: "all 0.3s ease",
            }}>
              {saving ? "Saving..." : "Save changes"}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Profile