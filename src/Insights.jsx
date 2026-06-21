import { useState } from "react"

function Insights({ userData }) {
  const [activeSection, setActiveSection] = useState("overview")

  const name = userData?.fullName?.split(" ")[0] || "there"

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "cycle", label: "Cycle" },
    { id: "symptoms", label: "Symptoms" },
    { id: "hormone", label: "Hormones" },
  ]

  const cardStyle = {
    backgroundColor: "#FDF0EC",
    border: "0.5px solid #E8E4F0",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "12px",
  }

  const emptyStateStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
    textAlign: "center",
  }

  const labelStyle = {
    fontSize: "11px",
    fontFamily: "DM Sans, sans-serif",
    color: "#6B6560",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "8px",
    display: "block",
  }

  const daysNeeded = (days) => (
    <div style={emptyStateStyle}>
      <div style={{
        fontSize: "36px",
        marginBottom: "12px",
        opacity: 0.4,
      }}>
        ✦
      </div>
      <div style={{
        fontSize: "15px",
        fontFamily: "Cormorant Garamond, serif",
        color: "#0D0D0D",
        marginBottom: "6px",
      }}>
        {days} days of data needed
      </div>
      <div style={{
        fontSize: "12px",
        color: "#6B6560",
        lineHeight: "1.6",
        maxWidth: "220px",
      }}>
        Keep logging daily and your
        insights will appear here
        automatically 🤍
      </div>
    </div>
  )

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF7F2",
      fontFamily: "DM Sans, sans-serif",
      paddingBottom: "100px",
    }}>

      {/* Header */}
      <div style={{
        padding: "52px 24px 20px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <h1 className="fade-up-1" style={{
          fontSize: "28px",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500",
          color: "#0D0D0D",
          margin: "0 0 4px",
        }}>
          Your insights
        </h1>
        <p className="fade-up-2" style={{
          fontSize: "13px",
          color: "#6B6560",
          margin: "0 0 24px",
        }}>
          Patterns your body is showing you
        </p>

        {/* Section tabs */}
        <div className="fade-up-3" style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                whiteSpace: "nowrap",
                padding: "8px 16px",
                borderRadius: "100px",
                border: activeSection === s.id ? "none" : "0.5px solid #E8E4F0",
                backgroundColor: activeSection === s.id ? "#0D0D0D" : "#FDF0EC",
                color: activeSection === s.id ? "#FAF7F2" : "#6B6560",
                fontSize: "12px",
                fontFamily: "DM Sans, sans-serif",
                cursor: "pointer",
                fontWeight: activeSection === s.id ? "500" : "400",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        padding: "0 24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <div>
            <div className="fade-up-4" style={{
              ...cardStyle,
              borderLeft: "3px solid #CFC1BA",
              borderRadius: "0 16px 16px 0",
            }}>
              <label style={labelStyle}>
                Your PCOS story — this month
              </label>
              <div style={{
                fontSize: "18px",
                fontFamily: "Cormorant Garamond, serif",
                color: "#0D0D0D",
                marginBottom: "8px",
              }}>
                The journey starts here, {name}
              </div>
              <div style={{
                fontSize: "13px",
                color: "#6B6560",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}>
                Your personalised monthly health
                narrative will appear here after
                your first full cycle of logging.
                It'll tell you exactly what your
                body did this month.
              </div>
              <div style={{
                fontSize: "11px",
                color: "#CFC1BA",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}>
                Available after 28 days ✦
              </div>
            </div>

            <div className="fade-up-5" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "12px",
            }}>
              {[
                { label: "Days logged", value: "0", sub: "Start today" },
                { label: "Streak", value: "0", sub: "days in a row" },
                { label: "Symptoms tracked", value: "0", sub: "this month" },
                { label: "Patterns found", value: "0", sub: "need 7 days" },
              ].map((stat) => (
                <div key={stat.label} style={{
                  backgroundColor: "#FDF0EC",
                  border: "0.5px solid #E8E4F0",
                  borderRadius: "14px",
                  padding: "16px",
                }}>
                  <div style={{
                    fontSize: "11px", color: "#6B6560",
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    marginBottom: "6px",
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: "28px",
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#0D0D0D", lineHeight: "1", marginBottom: "4px",
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: "11px", color: "#6B6560" }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            <div className="fade-up-6" style={cardStyle}>
              <label style={labelStyle}>Top patterns detected</label>
              {daysNeeded(7)}
            </div>

            <div className="fade-up-7" style={cardStyle}>
              <label style={labelStyle}>Hormone highlights</label>
              {daysNeeded(14)}
            </div>
          </div>
        )}

        {/* CYCLE INSIGHTS */}
        {activeSection === "cycle" && (
          <div>
            <div className="fade-up-1" style={cardStyle}>
              <label style={labelStyle}>Cycle regularity</label>
              {daysNeeded(28)}
            </div>
            <div className="fade-up-2" style={cardStyle}>
              <label style={labelStyle}>Average cycle length</label>
              {daysNeeded(56)}
            </div>
            <div className="fade-up-3" style={cardStyle}>
              <label style={labelStyle}>Period duration trend</label>
              {daysNeeded(28)}
            </div>
            <div className="fade-up-4" style={{
              ...cardStyle, textAlign: "center",
            }}>
              <label style={labelStyle}>Cycle regularity score</label>
              <div style={{
                fontSize: "64px",
                fontFamily: "Cormorant Garamond, serif",
                color: "#E8E4F0", lineHeight: "1", marginBottom: "8px",
              }}>
                —
              </div>
              <div style={{ fontSize: "12px", color: "#6B6560" }}>
                Log 2 full cycles to unlock
              </div>
            </div>
          </div>
        )}

        {/* SYMPTOM INSIGHTS */}
        {activeSection === "symptoms" && (
          <div>
            <div className="fade-up-1" style={cardStyle}>
              <label style={labelStyle}>Skin trend</label>
              <div style={{
                fontSize: "13px", color: "#6B6560", marginBottom: "16px",
              }}>
                Which zones flare and when
              </div>
              {daysNeeded(7)}
            </div>
            <div className="fade-up-2" style={cardStyle}>
              <label style={labelStyle}>Energy pattern</label>
              <div style={{
                fontSize: "13px", color: "#6B6560", marginBottom: "16px",
              }}>
                How your energy moves through your cycle
              </div>
              {daysNeeded(14)}
            </div>
            <div className="fade-up-3" style={cardStyle}>
              <label style={labelStyle}>Mood + cycle correlation</label>
              <div style={{
                fontSize: "13px", color: "#6B6560", marginBottom: "16px",
              }}>
                When mood dips and why
              </div>
              {daysNeeded(14)}
            </div>
            <div className="fade-up-4" style={cardStyle}>
              <label style={labelStyle}>Hair shedding pattern</label>
              {daysNeeded(14)}
            </div>
            <div className="fade-up-5" style={cardStyle}>
              <label style={labelStyle}>Sleep + symptom impact</label>
              {daysNeeded(7)}
            </div>
          </div>
        )}

        {/* HORMONE INSIGHTS */}
        {activeSection === "hormone" && (
          <div>
            <div className="fade-up-1" style={{
              ...cardStyle,
              borderLeft: "3px solid #CFC1BA",
              borderRadius: "0 16px 16px 0",
            }}>
              <label style={labelStyle}>Your hormone panel</label>
              <div style={{
                fontSize: "15px",
                fontFamily: "Cormorant Garamond, serif",
                color: "#0D0D0D", marginBottom: "8px",
              }}>
                No lab values added yet
              </div>
              <div style={{
                fontSize: "13px", color: "#6B6560",
                lineHeight: "1.6", marginBottom: "16px",
              }}>
                Add your lab report to unlock
                clinical-grade hormone insights —
                your LH, FSH, testosterone, and
                insulin resistance score explained
                in plain English.
              </div>
              <button style={{
                backgroundColor: "#0D0D0D", color: "#FAF7F2",
                border: "none", borderRadius: "100px",
                padding: "12px 24px", fontSize: "13px",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: "500", cursor: "pointer",
              }}>
                Add lab report ✦
              </button>
            </div>

            <div className="fade-up-2" style={cardStyle}>
              <label style={labelStyle}>Androgen indicators</label>
              <div style={{
                fontSize: "13px", color: "#6B6560",
                marginBottom: "16px", lineHeight: "1.6",
              }}>
                Based on your symptom logs —
                jawline acne, hair shedding, and
                cycle patterns — Metova will
                estimate your androgen activity
                here after 14 days of logging.
              </div>
              {daysNeeded(14)}
            </div>

            <div className="fade-up-3" style={cardStyle}>
              <label style={labelStyle}>Insulin resistance signals</label>
              <div style={{
                fontSize: "13px", color: "#6B6560",
                marginBottom: "16px", lineHeight: "1.6",
              }}>
                Your nutrition logs and energy
                patterns help Metova identify
                insulin resistance signals over time.
              </div>
              {daysNeeded(14)}
            </div>

            <div className="fade-up-4" style={cardStyle}>
              <label style={labelStyle}>Cortisol + stress patterns</label>
              {daysNeeded(7)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Insights