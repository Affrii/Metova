import { useState } from "react"
import EditProfileSheet from "./EditProfileSheet"
import SupportSheet from "./SupportSheet"

function Profile({ userData, onSignOut }) {
  const [editSheet, setEditSheet] = useState(null)
  const [notificationsOn, setNotificationsOn] = useState(true)
  const [horoscopeOn, setHoroscopeOn] = useState(true)
  const [cycleAlertsOn, setCycleAlertsOn] = useState(true)
  const [exportLoading, setExportLoading] = useState(false)
  const [exported, setExported] = useState(false)
  const [showSupport, setShowSupport] = useState(false)

  const name = userData?.fullName || "there"
  const firstName = name.split(" ")[0]
  const city = userData?.city || "India"
  const pcosStatus = userData?.pcosStatus || "exploring"
  const dietType = userData?.dietType || "not set"
  const activityLevel = userData?.activityLevel || "not set"

  const handleExport = () => {
    setExportLoading(true)
    setTimeout(() => {
      const exportData = {
        profile: {
          name: userData?.fullName,
          dob: userData?.dob,
          city: userData?.city,
          pcosStatus: userData?.pcosStatus,
          dietType: userData?.dietType,
          activityLevel: userData?.activityLevel,
          existingConditions: userData?.existingConditions,
          familyHistory: userData?.familyHistory,
        },
        exportedAt: new Date().toISOString(),
        exportedBy: "Metova Health",
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `metova-health-data-${firstName.toLowerCase()}.json`
      a.click()
      URL.revokeObjectURL(url)
      setExportLoading(false)
      setExported(true)
      setTimeout(() => setExported(false), 3000)
    }, 1500)
  }

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

  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#FAF7F2",
      fontFamily: "DM Sans, sans-serif", paddingBottom: "100px",
    }}>

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
        </div>
      </div>

      <div style={{ padding: "0 24px", maxWidth: "480px", margin: "0 auto" }}>

        {/* Health profile */}
        <label className="fade-up-3" style={sectionLabelStyle}>Health profile</label>
        <div className="fade-up-4" style={{ ...cardStyle, marginBottom: "20px" }}>
          <div style={rowStyle} onClick={() => setEditSheet({ field: "fullName", value: name })}>
            <div>
              <div style={rowLabelStyle}>Full name</div>
              <div style={rowSubStyle}>{name}</div>
            </div>
            {chevron}
          </div>
          <div style={rowStyle} onClick={() => setEditSheet({ field: "city", value: city })}>
            <div>
              <div style={rowLabelStyle}>City</div>
              <div style={rowSubStyle}>{city}</div>
            </div>
            {chevron}
          </div>
          <div style={rowStyle} onClick={() => setEditSheet({ field: "pcosStatus", value: pcosStatus })}>
            <div>
              <div style={rowLabelStyle}>PCOS status</div>
              <div style={rowSubStyle}>{pcosStatus}</div>
            </div>
            {chevron}
          </div>
          <div style={rowStyle} onClick={() => setEditSheet({ field: "dietType", value: dietType })}>
            <div>
              <div style={rowLabelStyle}>Diet type</div>
              <div style={rowSubStyle}>{dietType}</div>
            </div>
            {chevron}
          </div>
          <div style={lastRowStyle} onClick={() => setEditSheet({ field: "activityLevel", value: activityLevel })}>
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

        {/* Support */}
<label className="fade-up-10" style={sectionLabelStyle}>Support & feedback</label>
<div className="fade-up-10" style={{ ...cardStyle, marginBottom: "20px" }}>
  <div style={lastRowStyle} onClick={() => setShowSupport(true)}>
    <div>
      <div style={rowLabelStyle}>Help & feedback</div>
      <div style={rowSubStyle}>Support, bugs, suggestions</div>
    </div>
    {chevron}
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
          <button onClick={onSignOut} style={{
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

      {showSupport && <SupportSheet onClose={() => setShowSupport(false)} />}

      {editSheet && (
        <EditProfileSheet
          field={editSheet.field}
          currentValue={editSheet.value}
          onClose={() => setEditSheet(null)}
          onSaved={() => setEditSheet(null)}
        />
      )}

    </div>
  )
}

export default Profile