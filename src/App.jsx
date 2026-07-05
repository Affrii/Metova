import { useState, useEffect } from "react"
import Onboarding from "./Onboarding"
import Dashboard from "./Dashboard"
import CycleTracker from "./CycleTracker"
import SymptomTracker from "./SymptomTracker"
import AIChat from "./AIChat"
import Insights from "./Insights"
import Profile from "./Profile"
import Auth from "./Auth"
import { supabase } from "./supabase"
import SkinScreen from "./SkinScreen"

function App() {
  const [screen, setScreen] = useState("splash")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [userData, setUserData] = useState(null)
  const [activeTab, setActiveTab] = useState("home")
  const [supabaseUser, setSupabaseUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(session.user)

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, onboarding_completed")
          .eq("id", session.user.id)
          .single()

        if (profile?.onboarding_completed) {
          setUserData({ fullName: profile.full_name })
          setScreen("main")
        } else {
          setScreen("onboarding")
        }
      }
    })
  }, [])

  useEffect(() => {
    if (screen === "splash" && currentSlide < 2) {
      const timer = setTimeout(() => {
        setCurrentSlide(currentSlide + 1)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [screen, currentSlide])

  const slides = [
    { text: "Decode the signals behind your symptoms." },
    { text: "It's time to tune in." },
    { isLast: true },
  ]

  const handleNext = () => {
    if (currentSlide < 2) setCurrentSlide(currentSlide + 1)
  }

  const handleOnboardingComplete = async (data) => {
    setUserData(data)

    if (supabaseUser) {
      // Save to profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: supabaseUser.id,
          email: supabaseUser.email,
          full_name: data.fullName,
          onboarding_completed: true,
        })
      if (profileError) {
        console.error("Profile error:", profileError)
      } else {
        console.log("Profile saved! ✅")
      }

      // Save to health_profiles
      // Note: existing_conditions has a typo in DB as "exisiting_conditions"
      const { error: healthError } = await supabase
        .from("health_profiles")
        .upsert({
          user_id: supabaseUser.id,
          date_of_birth: data.dob || null,
          height_cm: data.heightCm ? parseFloat(data.heightCm) : null,
          weight_kg: data.weightKg ? parseFloat(data.weightKg) : null,
          city: data.city || null,
          pcos_diagnosis_status: data.pcosStatus?.toLowerCase() || null,
          diet_type: data.dietType?.toLowerCase() || null,
          activity_level: data.activityLevel?.toLowerCase() || null,
          existing_conditions: data.existingConditions || [],
          family_history: data.familyHistory || [],
          past_surgeries: data.pastSurgeries || [],
          cycle_regularity_self_report: data.cycleRegularity || null, 
        })
      if (healthError) {
        console.error("Health profile error:", healthError)
      } else {
        console.log("Health profile saved! ✅")
      }

      // Save to period_logs
    const { error: periodError } = await supabase
      .from("period_logs")
      .upsert({
         user_id: supabaseUser.id,
         start_date: data.lastPeriod,
     }, { onConflict: "user_id, start_date" })
    
        if (periodError) {
          console.error("Period log error:", periodError)
        } else {
          console.log("Period log saved! ✅")
        }
    }

    setScreen("main")
  }

  if (screen === "auth") {
    return (
      <Auth
        onAuth={(user, isOnboarded) => {
          setSupabaseUser(user)
          if (isOnboarded) {
            setScreen("main")
          } else {
            setScreen("onboarding")
          }
        }}
      />
    )
  }

  if (screen === "onboarding") {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  if (screen === "main") {
    return (
      <div style={{ position: "relative" }}>
        {activeTab === "home" && (
  <Dashboard 
    userData={userData} 
    onCycleTap={() => setActiveTab("cycle")}
  />
)}
        {activeTab === "cycle" && (
  <CycleTracker 
    userData={userData}
    onBack={() => setActiveTab("home")}
  />
)}
        {activeTab === "skin" && <SkinScreen userData={userData} />}
        {activeTab === "chat" && <AIChat userData={userData} />}
        {activeTab === "insights" && <Insights userData={userData} />}
        {activeTab === "profile" && (
          <Profile
            userData={userData}
            onSignOut={async () => {
              await supabase.auth.signOut()
              setScreen("splash")
              setCurrentSlide(0)
              setUserData(null)
              setActiveTab("home")
              setSupabaseUser(null)
            }}
          />
        )}

        {/* Bottom navigation */}
        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FAF7F2",
          borderTop: "0.5px solid #E8E4F0",
          height: "84px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 24px",
          zIndex: 50,
        }}>
          {[
            { id: "home", label: "Home", emoji: "⌂" },
            { id: "Skin", label: "Skin", emoji: "🤍" },
            { id: "chat", label: "Chat", emoji: "💬" },
            { id: "insights", label: "Insights", emoji: "✦" },
            { id: "profile", label: "Profile", emoji: "○" },
          ].map((tab) => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                opacity: activeTab === tab.id ? 1 : 0.4,
              }}
            >
              <div style={{ fontSize: "20px" }}>{tab.emoji}</div>
              {activeTab === tab.id && (
                <div style={{
                  fontSize: "10px",
                  color: "#0D0D0D",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: "500",
                }}>
                  {tab.label}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const slide = slides[currentSlide]

  return (
    <div
      onClick={handleNext}
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF7F2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "DM Sans, sans-serif",
        cursor: "pointer",
        padding: "40px",
        position: "relative",
      }}
    >
      <div style={{
        position: "absolute",
        top: "48px",
        display: "flex",
        gap: "8px",
      }}>
        {slides.map((_, i) => (
          <div key={i} style={{
            width: i === currentSlide ? "8px" : "6px",
            height: i === currentSlide ? "8px" : "6px",
            borderRadius: "50%",
            backgroundColor:
              i === currentSlide
                ? "#3D3935"
                : i < currentSlide
                ? "#D4E4D8"
                : "#E8E4F0",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {!slide.isLast ? (
        <h1 style={{
          fontSize: "32px",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: "400",
          color: "#0D0D0D",
          textAlign: "center",
          maxWidth: "280px",
          lineHeight: "1.4",
          margin: "0",
        }}>
          {slide.text}
        </h1>
      ) : (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}>
          <h1 style={{
            fontSize: "48px",
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: "500",
            color: "#0D0D0D",
            letterSpacing: "0.1em",
            margin: "0",
          }}>
            Metova
          </h1>
          <p style={{
            fontSize: "13px",
            color: "#6B6560",
            letterSpacing: "0.06em",
            margin: "0",
            fontFamily: "DM Sans, sans-serif",
          }}>
            intelligent PCOS companion
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setScreen("auth")
            }}
            style={{
              marginTop: "32px",
              backgroundColor: "#3D3935",
              color: "#FAF7F2",
              border: "none",
              borderRadius: "100px",
              padding: "16px 48px",
              fontSize: "15px",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Get started
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setScreen("auth")
            }}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#6B6560",
              fontSize: "13px",
              fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            I already have an account
          </button>
        </div>
      )}
    </div>
  )
}

export default App