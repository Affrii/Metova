import { useState } from "react"
import { supabase } from "./supabase"

function Auth({ onAuth }) {
  const [mode, setMode] = useState("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        // Create profile row
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: data.user.email,
            onboarding_completed: false,
          })
          onAuth(data.user, false)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        if (data.user) {
          // Check if onboarding completed
          const { data: profile } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", data.user.id)
            .single()

          const isOnboarded = profile?.onboarding_completed || false
          onAuth(data.user, isOnboarded)
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    backgroundColor: "#FDF0EC",
    border: "0.5px solid #E8E4F0",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "15px",
    fontFamily: "DM Sans, sans-serif",
    color: "#0D0D0D",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "12px",
  }

  const labelStyle = {
    fontSize: "11px",
    fontFamily: "DM Sans, sans-serif",
    color: "#6B6560",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "6px",
    display: "block",
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF7F2",
      fontFamily: "DM Sans, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    }}>

      {/* Logo */}
      <div className="fade-up-1" style={{
        marginBottom: "40px",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "36px",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500",
          color: "#0D0D0D",
          letterSpacing: "0.1em",
          marginBottom: "6px",
        }}>
          Metova
        </div>
        <div style={{
          fontSize: "13px",
          color: "#6B6560",
          letterSpacing: "0.06em",
        }}>
          intelligent PCOS companion
        </div>
      </div>

      {/* Card */}
      <div className="fade-up-2" style={{
        width: "100%",
        maxWidth: "380px",
        backgroundColor: "#FDF0EC",
        border: "0.5px solid #E8E4F0",
        borderRadius: "20px",
        padding: "28px 24px",
      }}>

        {/* Mode toggle */}
        <div style={{
          display: "flex",
          backgroundColor: "#FAF7F2",
          border: "0.5px solid #E8E4F0",
          borderRadius: "100px",
          padding: "4px",
          marginBottom: "24px",
        }}>
          {["signin", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m)
                setError("")
              }}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "100px",
                border: "none",
                backgroundColor: mode === m ? "#0D0D0D" : "transparent",
                color: mode === m ? "#FAF7F2" : "#6B6560",
                fontSize: "13px",
                fontFamily: "DM Sans, sans-serif",
                cursor: "pointer",
                fontWeight: mode === m ? "500" : "400",
                transition: "all 0.2s ease",
              }}
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        {/* Title */}
        <div style={{
          fontSize: "22px",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500",
          color: "#0D0D0D",
          marginBottom: "4px",
        }}>
          {mode === "signin"
            ? "Welcome back 🤍"
            : "Let's get started 🤍"}
        </div>
        <div style={{
          fontSize: "13px",
          color: "#6B6560",
          marginBottom: "24px",
        }}>
          {mode === "signin"
            ? "Sign in to your Metova account"
            : "Create your Metova account"}
        </div>

        {/* Email */}
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          style={inputStyle}
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />

        {/* Password */}
        <label style={labelStyle}>Password</label>
        <input
          type="password"
          style={{ ...inputStyle, marginBottom: "0" }}
          placeholder="minimum 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />

        {/* Error message */}
        {error && (
          <div style={{
            fontSize: "12px",
            color: "#E88080",
            marginTop: "10px",
            lineHeight: "1.5",
            fontFamily: "DM Sans, sans-serif",
          }}>
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            backgroundColor: loading ? "#E8E4F0" : "#0D0D0D",
            color: loading ? "#6B6560" : "#FAF7F2",
            border: "none",
            borderRadius: "100px",
            padding: "16px",
            fontSize: "15px",
            fontFamily: "DM Sans, sans-serif",
            fontWeight: "500",
            cursor: loading ? "default" : "pointer",
            marginTop: "20px",
            transition: "all 0.2s ease",
          }}
        >
          {loading
            ? "Just a moment..."
            : mode === "signin"
            ? "Sign in →"
            : "Create account →"}
        </button>
      </div>

      {/* Footer */}
      <div className="fade-up-3" style={{
        marginTop: "24px",
        fontSize: "11px",
        color: "#6B6560",
        textAlign: "center",
        lineHeight: "1.6",
        maxWidth: "280px",
      }}>
        By continuing you agree to Metova's
        privacy policy and terms of service 🤍
      </div>
    </div>
  )
}

export default Auth