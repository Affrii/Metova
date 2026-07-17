import { useState } from "react"

function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    heightCm: "",
    weightKg: "",
    city: "",
    lastPeriod: "",
    cycleRegularity: "",
    pcosStatus: "",
    existingConditions: [],
    pastSurgeries: [],
    familyHistory: [],
    medications: [],
    supplements: [],
    dietType: "",
    activityLevel: "",
  })

  const goToStep = (n) => {
    setStep(n)
    window.scrollTo(0, 0)
  }

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const toggleArray = (field, value) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(v => v !== value)
        : [...f[field], value],
    }))
  }

  const bmi = form.heightCm && form.weightKg
    ? (parseFloat(form.weightKg) / ((parseFloat(form.heightCm) / 100) ** 2)).toFixed(1)
    : null

  const bmiMessage = bmi
    ? bmi < 18.5 ? "You're in the lower range — nourishment is key 🌿"
      : bmi < 25 ? "Your weight is in a healthy range ✦"
      : bmi < 30 ? "Your body is doing its best — we're here to support you 🤍"
      : "Every body is different — Metova meets you where you are 🌸"
    : null

  const inputStyle = {
    width: "100%",
    backgroundColor: "#FDF0EC",
    border: "0.5px solid #E8E4F0",
    borderRadius: "12px",
    padding: "14px 16px",
    fontSize: "15px",
    color: "#0D0D0D",
    fontFamily: "DM Sans, sans-serif",
    outline: "none",
    marginBottom: "12px",
    boxSizing: "border-box",
  }

  const continueBtn = {
    width: "100%",
    backgroundColor: "#0D0D0D",
    color: "#FAF7F2",
    border: "none",
    borderRadius: "100px",
    padding: "16px",
    fontSize: "15px",
    fontFamily: "DM Sans, sans-serif",
    fontWeight: "500",
    cursor: "pointer",
    marginBottom: "12px",
  }

  const skipBtn = {
    width: "100%",
    backgroundColor: "transparent",
    color: "#6B6560",
    border: "none",
    fontSize: "14px",
    fontFamily: "DM Sans, sans-serif",
    cursor: "pointer",
    padding: "8px",
  }

  const pillStyle = (active) => ({
    padding: "10px 18px",
    borderRadius: "100px",
    border: `1px solid ${active ? "#0D0D0D" : "#E8E4F0"}`,
    backgroundColor: active ? "#E8E4F0" : "transparent",
    color: "#0D0D0D",
    fontSize: "13px",
    fontFamily: "DM Sans, sans-serif",
    cursor: "pointer",
    marginRight: "8px",
    marginBottom: "8px",
    display: "inline-block",
  })

  const labelStyle = {
    fontSize: "11px",
    color: "#6B6560",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "8px",
    display: "block",
  }

  const wrap = {
    minHeight: "100vh",
    backgroundColor: "#FAF7F2",
    fontFamily: "DM Sans, sans-serif",
    padding: "52px 24px 48px",
    maxWidth: "480px",
    margin: "0 auto",
  }

  // STEP 1 — Personal details
  if (step === 1) return (
    <div style={wrap}>
      <div className="fade-up-1" style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Step 1 of 5</div>
        <h1 style={{ fontSize: "28px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D", margin: "0 0 8px" }}>
          Let's meet you
        </h1>
        <p style={{ fontSize: "13px", color: "#6B6560", margin: "0" }}>
          Tell us a little about yourself
        </p>
      </div>

      <div className="fade-up-2">
        <label style={labelStyle}>First name</label>
        <input style={inputStyle} placeholder="Your name" value={form.fullName} onChange={e => update("fullName", e.target.value)} />
      </div>

      <div className="fade-up-3">
        <label style={labelStyle}>Date of birth</label>
        <input
          type="date"
          style={inputStyle}
          value={form.dob}
          max="2010-12-31"
          min="1930-01-01"
          onChange={e => update("dob", e.target.value)}
        />
      </div>

      <div className="fade-up-4" style={{ display: "flex", gap: "12px" }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Height (cm)</label>
          <input style={inputStyle} type="number" placeholder="160" value={form.heightCm} onChange={e => update("heightCm", e.target.value)} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Weight (kg)</label>
          <input style={inputStyle} type="number" placeholder="55" value={form.weightKg} onChange={e => update("weightKg", e.target.value)} />
        </div>
      </div>

      {bmi && (
        <div className="fade-up-5" style={{
          backgroundColor: "#FDF0EC", border: "0.5px solid #E8E4F0",
          borderRadius: "12px", padding: "12px 16px", marginBottom: "12px",
        }}>
          <div style={{ fontSize: "13px", color: "#6B6560" }}>BMI: <span style={{ color: "#0D0D0D", fontWeight: "500" }}>{bmi}</span></div>
          <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "4px" }}>{bmiMessage}</div>
        </div>
      )}

      <div className="fade-up-6">
        <label style={labelStyle}>City</label>
        <input style={inputStyle} placeholder="Chennai" value={form.city} onChange={e => update("city", e.target.value)} />
      </div>

      <div className="fade-up-7">
        <label style={labelStyle}>Last period date</label>
        <input type="date" style={inputStyle} value={form.lastPeriod} onChange={e => update("lastPeriod", e.target.value)} />
      </div>

      <div className="fade-up-8">
        <label style={labelStyle}>Cycle regularity</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "16px" }}>
          {["Regular", "Irregular", "Unknown", "Never tracked"].map(opt => (
            <span key={opt} style={pillStyle(form.cycleRegularity === opt)} onClick={() => update("cycleRegularity", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-9">
        <button onClick={() => goToStep(2)} style={continueBtn}>Continue →</button>
      </div>
    </div>
  )

  // STEP 2 — AI intro
  if (step === 2) return (
    <div style={{ ...wrap, display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
      <div className="fade-up-1" style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "linear-gradient(135deg, #E4D4F4, #CFC1BA)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px", fontSize: "24px",
        }}>M</div>
        <h2 style={{ fontSize: "24px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D", marginBottom: "16px" }}>
          Hi {form.fullName || "there"} 🤍
        </h2>
        <p style={{ fontSize: "15px", color: "#6B6560", lineHeight: "1.7", maxWidth: "320px", margin: "0 auto" }}>
          I'm here to help you understand your health — clearly, confidently, and personally.
          <br /><br />
          Let's build your complete health picture together.
        </p>
      </div>
      <div className="fade-up-2">
        <button onClick={() => goToStep(3)} style={continueBtn}>Let's do this →</button>
      </div>
    </div>
  )

  // STEP 3 — Health story
  if (step === 3) return (
    <div style={wrap}>
      <div className="fade-up-1" style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Step 3 of 5</div>
        <h1 style={{ fontSize: "28px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D", margin: "0 0 8px" }}>
          Your health story
        </h1>
        <p style={{ fontSize: "13px", color: "#6B6560", margin: "0" }}>
          Help us understand your background
        </p>
      </div>

      <div className="fade-up-2">
        <label style={labelStyle}>PCOS diagnosis status</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {["Diagnosed", "Suspected", "Not sure", "Just curious"].map(opt => (
            <span key={opt} style={pillStyle(form.pcosStatus === opt)} onClick={() => update("pcosStatus", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-3">
        <label style={labelStyle}>Existing conditions (select all that apply)</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {["Thyroid", "Diabetes", "Insulin resistance", "Endometriosis", "Anxiety", "Depression", "None"].map(opt => (
            <span key={opt} style={pillStyle(form.existingConditions.includes(opt))} onClick={() => toggleArray("existingConditions", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-4">
        <label style={labelStyle}>Past surgeries</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {["Ovarian drilling", "Laparoscopy", "Other", "None"].map(opt => (
            <span key={opt} style={pillStyle(form.pastSurgeries.includes(opt))} onClick={() => toggleArray("pastSurgeries", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-5">
        <label style={labelStyle}>Family history</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {["PCOS", "Diabetes", "Thyroid", "Heart disease", "None"].map(opt => (
            <span key={opt} style={pillStyle(form.familyHistory.includes(opt))} onClick={() => toggleArray("familyHistory", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-6">
        <button onClick={() => goToStep(4)} style={continueBtn}>Continue →</button>
        <button onClick={() => goToStep(4)} style={skipBtn}>Skip</button>
      </div>
    </div>
  )

  // STEP 4 — Lifestyle
  if (step === 4) return (
    <div style={wrap}>
      <div className="fade-up-1" style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Step 4 of 5</div>
        <h1 style={{ fontSize: "28px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D", margin: "0 0 8px" }}>
          Your lifestyle
        </h1>
        <p style={{ fontSize: "13px", color: "#6B6560", margin: "0" }}>
          Help us personalise your experience
        </p>
      </div>

      <div className="fade-up-2">
        <label style={labelStyle}>Current medications</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {["Metformin", "Birth control", "Spironolactone", "Clomid", "Thyroid meds", "None"].map(opt => (
            <span key={opt} style={pillStyle(form.medications.includes(opt))} onClick={() => toggleArray("medications", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-3">
        <label style={labelStyle}>Supplements</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {["Inositol", "Vitamin D", "Omega-3", "Spearmint", "Magnesium", "None"].map(opt => (
            <span key={opt} style={pillStyle(form.supplements.includes(opt))} onClick={() => toggleArray("supplements", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-4">
        <label style={labelStyle}>Diet type</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {["Vegetarian", "Vegan", "Non-vegetarian", "Gluten-free", "No restriction"].map(opt => (
            <span key={opt} style={pillStyle(form.dietType === opt)} onClick={() => update("dietType", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-5">
        <label style={labelStyle}>Activity level</label>
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: "20px" }}>
          {["Sedentary", "Light", "Moderate", "Active"].map(opt => (
            <span key={opt} style={pillStyle(form.activityLevel === opt)} onClick={() => update("activityLevel", opt)}>{opt}</span>
          ))}
        </div>
      </div>

      <div className="fade-up-6">
        <button onClick={() => goToStep(5)} style={continueBtn}>Continue →</button>
        <button onClick={() => goToStep(5)} style={skipBtn}>Skip</button>
      </div>
    </div>
  )

  // STEP 5 — Pricing
  if (step === 5) return (
    <div style={wrap}>
      <div className="fade-up-1" style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", color: "#6B6560", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Step 5 of 5</div>
        <h1 style={{ fontSize: "28px", fontFamily: "Cormorant Garamond, serif", fontWeight: "500", color: "#0D0D0D", margin: "0 0 8px" }}>
          Choose your plan
        </h1>
        <p style={{ fontSize: "13px", color: "#6B6560", margin: "0" }}>
          Start free, upgrade when you're ready
        </p>
      </div>

      {[
        {
          name: "Free",
          price: "₹0",
          period: "forever",
          features: ["Basic cycle tracking", "5 AI chats/month", "Skin phase guide", "Community access"],
          featured: false,
        },
        {
          name: "Core",
          price: "₹299",
          period: "per month",
          features: ["Unlimited AI companion", "Full cycle intelligence", "Skin + food insights", "Hormone Horoscope", "Symptom tracking"],
          featured: true,
        },
        {
          name: "Clinical",
          price: "₹999",
          period: "per month",
          features: ["Everything in Core", "Lab report interpretation", "Biomarker dashboard", "Clinician connect", "Doctor PDF report"],
          featured: false,
        },
      ].map((plan) => (
        <div key={plan.name} className="fade-up-2" style={{
          backgroundColor: "#FDF0EC",
          border: plan.featured ? "1.5px solid #0D0D0D" : "0.5px solid #E8E4F0",
          borderRadius: "16px", padding: "20px", marginBottom: "12px",
          position: "relative",
        }}>
          {plan.featured && (
            <div style={{
              position: "absolute", top: "-10px", left: "20px",
              backgroundColor: "#0D0D0D", color: "#FAF7F2",
              fontSize: "10px", fontWeight: "500",
              padding: "3px 10px", borderRadius: "100px",
              letterSpacing: "0.06em",
            }}>
              MOST POPULAR
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "500", color: "#0D0D0D", fontFamily: "DM Sans, sans-serif" }}>{plan.name}</div>
              <div style={{ fontSize: "11px", color: "#6B6560" }}>{plan.period}</div>
            </div>
            <div style={{ fontSize: "22px", fontFamily: "Cormorant Garamond, serif", color: "#0D0D0D" }}>{plan.price}</div>
          </div>
          {plan.features.map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={{ color: "#D4E4D8", fontSize: "12px" }}>✓</span>
              <span style={{ fontSize: "13px", color: "#6B6560" }}>{f}</span>
            </div>
          ))}
        </div>
      ))}

      <div className="fade-up-3" style={{ marginTop: "20px" }}>
        <button onClick={() => onComplete(form)} style={continueBtn}>
          Start 7-day free trial →
        </button>
        <button onClick={() => onComplete(form)} style={skipBtn}>
          Maybe later
        </button>
      </div>
    </div>
  )

  return null
}

export default Onboarding