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

  const update = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  const toggleMulti = (field, value) => {
    const current = form[field]
    if (value === "None" || value === "None currently") {
      setForm({ ...form, [field]: [value] })
      return
    }
    const filtered = current.filter(
      (i) => i !== "None" && i !== "None currently"
    )
    if (filtered.includes(value)) {
      setForm({ ...form, [field]: filtered.filter((i) => i !== value) })
    } else {
      setForm({ ...form, [field]: [...filtered, value] })
    }
  }

  const bmi =
    form.heightCm && form.weightKg
      ? (
          parseFloat(form.weightKg) /
          ((parseFloat(form.heightCm) / 100) *
            (parseFloat(form.heightCm) / 100))
        ).toFixed(1)
      : null

  const bmiMessage = (b) => {
    if (!b) return null
    if (b < 18.5) return "Underweight — this can affect your hormones too."
    if (b < 25) return "Your weight is in a healthy range."
    if (b < 30) return "Some women with PCOS find this range common."
    return "Insulin resistance is more common at this range — we'll help."
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

  const subLabelStyle = {
    fontSize: "11px",
    fontFamily: "DM Sans, sans-serif",
    color: "#6B6560",
    marginBottom: "10px",
    display: "block",
  }

  const fieldStyle = {
    marginBottom: "24px",
    width: "100%",
  }

  const pillStyle = (selected) => ({
    padding: "10px 14px",
    borderRadius: "100px",
    border: selected ? "1px solid #0D0D0D" : "0.5px solid #E8E4F0",
    backgroundColor: selected ? "#E8E4F0" : "#FAF7F2",
    color: "#0D0D0D",
    fontSize: "12px",
    fontFamily: "DM Sans, sans-serif",
    cursor: "pointer",
    textAlign: "center",
    lineHeight: "1.4",
  })

  const pillGridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
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
    marginTop: "8px",
  }

  const skipBtn = {
    width: "100%",
    backgroundColor: "transparent",
    border: "none",
    color: "#6B6560",
    fontSize: "13px",
    fontFamily: "DM Sans, sans-serif",
    cursor: "pointer",
    marginTop: "12px",
  }

  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: "#FAF7F2",
    fontFamily: "DM Sans, sans-serif",
    padding: "0",
  }

  const headingStyle = {
    fontSize: "28px",
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: "500",
    color: "#0D0D0D",
    margin: "0 0 8px",
  }

  const subStyle = {
    fontSize: "14px",
    color: "#6B6560",
    margin: "0 0 32px",
  }

  const sectionDivider = {
    height: "0.5px",
    backgroundColor: "#E8E4F0",
    margin: "28px 0",
  }

  // Each step gets a unique key so fade-up re-triggers on step change
  const stepKey = `step-${step}`

  return (
    <div style={pageStyle}>

      {/* Progress dots */}
      <div className="fade-up-1" style={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        paddingTop: "52px",
        paddingBottom: "8px",
      }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{
            width: i === step ? "8px" : "6px",
            height: i === step ? "8px" : "6px",
            borderRadius: "50%",
            backgroundColor:
              i === step
                ? "#0D0D0D"
                : i < step
                ? "#D4E4D8"
                : "#E8E4F0",
            transition: "all 0.3s ease",
          }} />
        ))}
      </div>

      {/* STEP 1 — Personal details */}
      {step === 1 && (
        <div
          key={stepKey}
          style={{
            padding: "24px 24px 40px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          <h2 className="fade-up-1" style={headingStyle}>
            Let's meet you
          </h2>
          <p className="fade-up-2" style={subStyle}>
            We'll use this to personalise everything.
          </p>

          <div className="fade-up-3" style={fieldStyle}>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              placeholder="What should we call you?"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </div>

          <div className="fade-up-4" style={fieldStyle}>
            <label style={labelStyle}>Date of Birth</label>
            <input
              type="date"
              style={inputStyle}
              value={form.dob}
              onChange={(e) => update("dob", e.target.value)}
            />
          </div>

          <div className="fade-up-5" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}>
            <div>
              <label style={labelStyle}>Height (cm)</label>
              <input
                type="number"
                style={inputStyle}
                placeholder="e.g. 160"
                value={form.heightCm}
                onChange={(e) => update("heightCm", e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input
                type="number"
                style={inputStyle}
                placeholder="e.g. 58"
                value={form.weightKg}
                onChange={(e) => update("weightKg", e.target.value)}
              />
            </div>
          </div>

          {bmi && (
            <div className="fade-up-6" style={{
              backgroundColor: "#E8E4F0",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "20px",
            }}>
              <div style={{
                fontSize: "11px",
                color: "#6B6560",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: "4px",
              }}>
                Your BMI
              </div>
              <div style={{
                fontSize: "24px",
                fontFamily: "Cormorant Garamond, serif",
                color: "#0D0D0D",
              }}>
                {bmi}
              </div>
              <div style={{
                fontSize: "12px",
                color: "#6B6560",
                marginTop: "4px",
              }}>
                {bmiMessage(bmi)}
              </div>
            </div>
          )}

          <div className="fade-up-6" style={fieldStyle}>
            <label style={labelStyle}>Your City</label>
            <input
              style={inputStyle}
              placeholder="e.g. Chennai"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
            />
            <div style={{
              fontSize: "11px",
              color: "#6B6560",
              marginTop: "6px",
            }}>
              We use this to personalise food recommendations.
            </div>
          </div>

          <div className="fade-up-7" style={fieldStyle}>
            <label style={labelStyle}>
              When did your last period start?
            </label>
            <input
              type="date"
              style={inputStyle}
              value={form.lastPeriod}
              onChange={(e) => update("lastPeriod", e.target.value)}
            />
          </div>

          <div className="fade-up-8" style={fieldStyle}>
            <label style={labelStyle}>
              How would you describe your cycle?
            </label>
            <div style={pillGridStyle}>
              {[
                "Regular (every 21–35 days)",
                "Irregular (varies a lot)",
                "Very irregular / rare periods",
                "I've never tracked it",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => update("cycleRegularity", option)}
                  style={pillStyle(form.cycleRegularity === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="fade-up-9">
            <button
              onClick={() => {
                if (form.fullName && form.dob && form.city) {
                  setStep(2)
                } else {
                  alert("Please fill in your name, date of birth, and city.")
                }
              }}
              style={continueBtn}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — AI Introduction */}
      {step === 2 && (
        <div
          key={stepKey}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          <div className="fade-up-1" style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "#E8E4F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
            fontSize: "24px",
            fontFamily: "Cormorant Garamond, serif",
            color: "#3D3935",
          }}>
            M
          </div>

          <div className="fade-up-2" style={{
            backgroundColor: "#FDF0EC",
            border: "0.5px solid #E8E4F0",
            borderRadius: "20px",
            padding: "24px",
            maxWidth: "320px",
            textAlign: "center",
          }}>
            <p style={{
              fontSize: "16px",
              fontFamily: "DM Sans, sans-serif",
              color: "#0D0D0D",
              lineHeight: "1.7",
              margin: "0",
            }}>
              Hi {form.fullName} 🤍
              <br /><br />
              I'm here to help you understand
              your health — clearly, confidently,
              and personally.
              <br /><br />
              Let's build your complete health
              picture together. It'll take about
              2 more minutes.
              <br /><br />
              Ready?
            </p>
          </div>

          <button
            className="fade-up-3"
            onClick={() => setStep(3)}
            style={{
              marginTop: "32px",
              backgroundColor: "#0D0D0D",
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
            Yes, let's do this →
          </button>

          <button
            className="fade-up-4"
            onClick={() => onComplete(form)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "#6B6560",
              fontSize: "13px",
              fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            Skip to dashboard
          </button>
        </div>
      )}

      {/* STEP 3 — Health story */}
      {step === 3 && (
        <div
          key={stepKey}
          style={{
            padding: "24px 24px 40px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          <h2 className="fade-up-1" style={headingStyle}>
            Your health story
          </h2>
          <p className="fade-up-2" style={subStyle}>
            This helps us understand your body's full picture.
          </p>

          <div className="fade-up-3" style={fieldStyle}>
            <label style={labelStyle}>
              Have you been diagnosed with PCOS?
            </label>
            <div style={pillGridStyle}>
              {[
                "Yes, I'm diagnosed",
                "I suspect I might",
                "Not sure",
                "Just exploring",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => update("pcosStatus", option)}
                  style={pillStyle(form.pcosStatus === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={sectionDivider} />

          <div className="fade-up-4" style={fieldStyle}>
            <label style={labelStyle}>
              Do you have any of these conditions?
            </label>
            <span style={subLabelStyle}>Select all that apply.</span>
            <div style={pillGridStyle}>
              {[
                "Thyroid disorder",
                "Type 2 diabetes",
                "Insulin resistance",
                "Endometriosis",
                "Anxiety or depression",
                "None",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => toggleMulti("existingConditions", option)}
                  style={pillStyle(form.existingConditions.includes(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={sectionDivider} />

          <div className="fade-up-5" style={fieldStyle}>
            <label style={labelStyle}>
              Any past surgeries related to reproductive health?
            </label>
            <span style={subLabelStyle}>Select all that apply.</span>
            <div style={pillGridStyle}>
              {[
                "Ovarian cyst removal",
                "Ovarian drilling",
                "Laparoscopy",
                "Other",
                "None",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => toggleMulti("pastSurgeries", option)}
                  style={pillStyle(form.pastSurgeries.includes(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={sectionDivider} />

          <div className="fade-up-6" style={fieldStyle}>
            <label style={labelStyle}>
              Any family history of these?
            </label>
            <span style={subLabelStyle}>
              Blood relatives — mum, sister, grandmother.
            </span>
            <div style={pillGridStyle}>
              {[
                "PCOS",
                "Diabetes",
                "Thyroid conditions",
                "Heart disease",
                "None that I know of",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => toggleMulti("familyHistory", option)}
                  style={pillStyle(form.familyHistory.includes(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="fade-up-7">
            <button onClick={() => setStep(4)} style={continueBtn}>
              Continue →
            </button>
            <button onClick={() => setStep(4)} style={skipBtn}>
              Skip
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Lifestyle foundation */}
      {step === 4 && (
        <div
          key={stepKey}
          style={{
            padding: "24px 24px 40px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          <h2 className="fade-up-1" style={headingStyle}>
            What you're doing now
          </h2>
          <p className="fade-up-2" style={subStyle}>
            Help us understand your current routine.
          </p>

          <div className="fade-up-3" style={fieldStyle}>
            <label style={labelStyle}>
              Are you taking any medications?
            </label>
            <span style={subLabelStyle}>Select all that apply.</span>
            <div style={pillGridStyle}>
              {[
                "Metformin",
                "Birth control pill",
                "Spironolactone",
                "Clomid / Letrozole",
                "Thyroid medication",
                "Other",
                "None currently",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => toggleMulti("medications", option)}
                  style={pillStyle(form.medications.includes(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={sectionDivider} />

          <div className="fade-up-4" style={fieldStyle}>
            <label style={labelStyle}>Any supplements?</label>
            <span style={subLabelStyle}>Select all that apply.</span>
            <div style={pillGridStyle}>
              {[
                "Inositol",
                "Vitamin D",
                "Omega-3 / Fish oil",
                "Spearmint",
                "Magnesium",
                "Zinc",
                "Other",
                "None",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => toggleMulti("supplements", option)}
                  style={pillStyle(form.supplements.includes(option))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={sectionDivider} />

          <div className="fade-up-5" style={fieldStyle}>
            <label style={labelStyle}>How do you eat?</label>
            <div style={pillGridStyle}>
              {[
                "Vegetarian",
                "Vegan",
                "Non-vegetarian",
                "Gluten-free",
                "No restrictions",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => update("dietType", option)}
                  style={pillStyle(form.dietType === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div style={sectionDivider} />

          <div className="fade-up-6" style={fieldStyle}>
            <label style={labelStyle}>How active are you?</label>
            <div style={pillGridStyle}>
              {[
                "Mostly sitting",
                "Light movement",
                "Moderately active",
                "Very active",
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => update("activityLevel", option)}
                  style={pillStyle(form.activityLevel === option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="fade-up-7">
            <button onClick={() => setStep(5)} style={continueBtn}>
              Almost there →
            </button>
            <button onClick={() => setStep(5)} style={skipBtn}>
              Skip
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 — Unlock full picture */}
      {step === 5 && (
        <div
          key={stepKey}
          style={{
            padding: "24px 24px 40px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          <h2 className="fade-up-1" style={headingStyle}>
            Unlock your full picture
          </h2>
          <p className="fade-up-2" style={subStyle}>
            Choose the plan that fits where you are right now.
          </p>

          {/* FREE TIER */}
          <div className="fade-up-3" style={{
            backgroundColor: "#FDF0EC",
            border: "0.5px solid #E8E4F0",
            borderRadius: "20px",
            padding: "20px 24px",
            marginBottom: "12px",
          }}>
            <div style={{
              fontSize: "16px",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: "500",
              color: "#0D0D0D",
              marginBottom: "4px",
            }}>
              Free
            </div>
            <div style={{
              fontSize: "28px",
              fontFamily: "Cormorant Garamond, serif",
              color: "#0D0D0D",
              marginBottom: "12px",
            }}>
              ₹0
            </div>
            {[
              "Basic cycle tracking",
              "5 AI conversations/month",
              "Community read-only",
              "Hormone Horoscope preview",
            ].map((f) => (
              <div key={f} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginBottom: "6px",
                fontSize: "12px",
                color: "#6B6560",
              }}>
                <span style={{ color: "#CFC1BA" }}>✦</span>
                {f}
              </div>
            ))}
          </div>

          {/* CORE TIER */}
          <div className="fade-up-4" style={{
            backgroundColor: "#FDF0EC",
            border: "1.5px solid #0D0D0D",
            borderRadius: "20px",
            padding: "20px 24px",
            marginBottom: "12px",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#0D0D0D",
              color: "#FAF7F2",
              fontSize: "10px",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: "500",
              letterSpacing: "0.08em",
              padding: "4px 14px",
              borderRadius: "100px",
              whiteSpace: "nowrap",
            }}>
              MOST POPULAR
            </div>
            <div style={{
              fontSize: "16px",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: "500",
              color: "#0D0D0D",
              marginBottom: "4px",
            }}>
              Core
            </div>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              marginBottom: "12px",
            }}>
              <span style={{
                fontSize: "28px",
                fontFamily: "Cormorant Garamond, serif",
                color: "#0D0D0D",
              }}>
                ₹299
              </span>
              <span style={{
                fontSize: "12px",
                color: "#6B6560",
                fontFamily: "DM Sans, sans-serif",
              }}>
                /month
              </span>
            </div>
            {[
              "Unlimited AI companion",
              "Indian food database + analysis",
              "Full Hormone Horoscope",
              "Skin + symptom tracker",
              "Smart cycle notifications",
            ].map((f) => (
              <div key={f} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginBottom: "6px",
                fontSize: "12px",
                color: "#0D0D0D",
              }}>
                <span style={{ color: "#0D0D0D" }}>✦</span>
                {f}
              </div>
            ))}
          </div>

          {/* CLINICAL TIER */}
          <div className="fade-up-5" style={{
            backgroundColor: "#FDF0EC",
            border: "0.5px solid #E8E4F0",
            borderRadius: "20px",
            padding: "20px 24px",
            marginBottom: "28px",
          }}>
            <div style={{
              fontSize: "16px",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: "500",
              color: "#0D0D0D",
              marginBottom: "4px",
            }}>
              Clinical
            </div>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
              marginBottom: "12px",
            }}>
              <span style={{
                fontSize: "28px",
                fontFamily: "Cormorant Garamond, serif",
                color: "#0D0D0D",
              }}>
                ₹999
              </span>
              <span style={{
                fontSize: "12px",
                color: "#6B6560",
                fontFamily: "DM Sans, sans-serif",
              }}>
                /month
              </span>
            </div>
            {[
              "Everything in Core",
              "Lab report interpretation",
              "Biomarker dashboard",
              "Doctor-ready PDF report",
              "Clinician connect",
            ].map((f) => (
              <div key={f} style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginBottom: "6px",
                fontSize: "12px",
                color: "#6B6560",
              }}>
                <span style={{ color: "#CFC1BA" }}>✦</span>
                {f}
              </div>
            ))}
          </div>

          <div className="fade-up-6">
            <button
              onClick={() => onComplete(form)}
              style={continueBtn}
            >
              Start 7-day free trial
            </button>
            <div style={{
              fontSize: "11px",
              color: "#6B6560",
              textAlign: "center",
              marginTop: "8px",
              fontFamily: "DM Sans, sans-serif",
            }}>
              Cancel anytime. No commitment.
            </div>
            <button
              onClick={() => onComplete(form)}
              style={skipBtn}
            >
              Maybe later — take me to my dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Onboarding