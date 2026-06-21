import { useState, useEffect } from "react"

function Dashboard({ userData }) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const calculateCycleInfo = () => {
    if (!userData?.lastPeriod) {
      return {
        cycleDay: null,
        phase: "unknown",
        daysUntilPeriod: null,
        phaseColor: "#E8E4F0",
      }
    }

    const lastPeriod = new Date(userData.lastPeriod)
    const today = new Date()
    const cycleDay =
      Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1
    const cycleLength = 28

    let phase = "follicular"
    let phaseColor = "#E8E4F0"

    if (cycleDay <= 5) {
      phase = "menstrual"
      phaseColor = "#F2C4CE"
    } else if (cycleDay <= 13) {
      phase = "follicular"
      phaseColor = "#E8E4F0"
    } else if (cycleDay <= 16) {
      phase = "ovulatory"
      phaseColor = "#E8C87A"
    } else {
      phase = "luteal"
      phaseColor = "#CFC1BA"
    }

    const daysUntilPeriod = cycleLength - cycleDay
    const progress = (cycleDay / cycleLength) * 100

    return { cycleDay, phase, daysUntilPeriod, phaseColor, progress }
  }

  const { cycleDay, phase, daysUntilPeriod, phaseColor, progress } =
    calculateCycleInfo()

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
      title: phase === "luteal"
        ? "Progesterone is rising"
        : phase === "ovulatory"
        ? "Peak energy window"
        : phase === "menstrual"
        ? "Rest and restore"
        : "Building momentum",
      body: phase === "luteal"
        ? "You may feel more tired and crave carbs — totally normal. Prioritise protein today."
        : phase === "ovulatory"
        ? "Your energy and focus are at their peak. Great time for workouts and social plans."
        : phase === "menstrual"
        ? "Iron-rich foods like dal and spinach will help restore your energy today."
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

  const quickLogs = [
    { label: "Period", emoji: "🩸" },
    { label: "Food", emoji: "🥗" },
    { label: "Skin", emoji: "✨" },
    { label: "Mood", emoji: "💭" },
    { label: "Energy", emoji: "⚡" },
  ]

  const size = 200
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset =
    circumference - ((progress || 0) / 100) * circumference

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
          Hello, {userData?.fullName?.split(" ")[0] || "there"} 🤍
        </div>
        <div style={{
          fontSize: "13px",
          color: "#6B6560",
          marginTop: "4px",
        }}>
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
        <div style={{
          position: "relative",
          width: size,
          height: size,
        }}>
          <svg
            width={size}
            height={size}
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#E8E4F0"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={phaseColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>

          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}>
            {cycleDay ? (
              <>
                <div style={{
                  fontSize: "11px",
                  color: "#6B6560",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "4px",
                }}>
                  Day
                </div>
                <div style={{
                  fontSize: "42px",
                  fontFamily: "Cormorant Garamond, serif",
                  fontWeight: "400",
                  color: "#0D0D0D",
                  lineHeight: "1",
                }}>
                  {cycleDay}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "#6B6560",
                  marginTop: "4px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}>
                  {phase}
                </div>
              </>
            ) : (
              <div style={{
                fontSize: "12px",
                color: "#6B6560",
                textAlign: "center",
                maxWidth: "80px",
                lineHeight: "1.4",
              }}>
                Log your period to start
              </div>
            )}
          </div>
        </div>

        {daysUntilPeriod !== null && daysUntilPeriod > 0 && (
          <div style={{
            marginTop: "12px",
            fontSize: "13px",
            color: "#6B6560",
            fontFamily: "DM Sans, sans-serif",
          }}>
            Next period in{" "}
            <span style={{
              color: "#0D0D0D",
              fontWeight: "500",
            }}>
              ~{daysUntilPeriod} days
            </span>
          </div>
        )}
      </div>

      {/* Quick log buttons */}
      <div className="fade-up-3" style={{
        padding: "0 24px",
        maxWidth: "480px",
        margin: "0 auto 28px",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
        }}>
          {quickLogs.map((log) => (
            <div
              key={log.label}
              onClick={() => alert(`${log.label} logging coming soon!`)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "#FDF0EC",
                border: "0.5px solid #E8E4F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}>
                {log.emoji}
              </div>
              <div style={{
                fontSize: "10px",
                color: "#6B6560",
                fontFamily: "DM Sans, sans-serif",
              }}>
                {log.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's insights label */}
      <div className="fade-up-4" style={{
        padding: "0 24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <div style={{
          fontSize: "11px",
          color: "#6B6560",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "12px",
        }}>
          Today's insights
        </div>
      </div>

      {/* Insight card 1 */}
      <div className="fade-up-5" style={{
        padding: "0 24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <div style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderLeft: `3px solid ${insightCards[0].accent}`,
          borderRadius: "0 16px 16px 0",
          padding: "16px 20px",
          marginBottom: "12px",
        }}>
          <div style={{
            fontSize: "10px",
            color: "#6B6560",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            {insightCards[0].label}
          </div>
          <div style={{
            fontSize: "15px",
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: "500",
            color: "#0D0D0D",
            marginBottom: "6px",
          }}>
            {insightCards[0].title}
          </div>
          <div style={{
            fontSize: "13px",
            color: "#6B6560",
            lineHeight: "1.6",
          }}>
            {insightCards[0].body}
          </div>
        </div>
      </div>

      {/* Insight card 2 */}
      <div className="fade-up-6" style={{
        padding: "0 24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <div style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderLeft: `3px solid ${insightCards[1].accent}`,
          borderRadius: "0 16px 16px 0",
          padding: "16px 20px",
          marginBottom: "12px",
        }}>
          <div style={{
            fontSize: "10px",
            color: "#6B6560",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            {insightCards[1].label}
          </div>
          <div style={{
            fontSize: "15px",
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: "500",
            color: "#0D0D0D",
            marginBottom: "6px",
          }}>
            {insightCards[1].title}
          </div>
          <div style={{
            fontSize: "13px",
            color: "#6B6560",
            lineHeight: "1.6",
          }}>
            {insightCards[1].body}
          </div>
        </div>
      </div>

      {/* Insight card 3 */}
      <div className="fade-up-7" style={{
        padding: "0 24px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        <div style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderLeft: `3px solid ${insightCards[2].accent}`,
          borderRadius: "0 16px 16px 0",
          padding: "16px 20px",
          marginBottom: "12px",
        }}>
          <div style={{
            fontSize: "10px",
            color: "#6B6560",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}>
            {insightCards[2].label}
          </div>
          <div style={{
            fontSize: "15px",
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: "500",
            color: "#0D0D0D",
            marginBottom: "6px",
          }}>
            {insightCards[2].title}
          </div>
          <div style={{
            fontSize: "13px",
            color: "#6B6560",
            lineHeight: "1.6",
          }}>
            {insightCards[2].body}
          </div>
        </div>
      </div>

      {/* Hormone Horoscope teaser */}
      <div className="fade-up-8" style={{
        padding: "0 24px",
        maxWidth: "480px",
        margin: "16px auto 0",
      }}>
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
            <div style={{
              fontSize: "10px",
              color: "#6B6560",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "6px",
            }}>
              This week
            </div>
            <div style={{
              fontSize: "17px",
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: "500",
              color: "#0D0D0D",
            }}>
              Your Hormone Horoscope ✦
            </div>
            <div style={{
              fontSize: "12px",
              color: "#6B6560",
              marginTop: "4px",
            }}>
              Ready every Sunday
            </div>
          </div>
          <div style={{ fontSize: "24px" }}>🌙</div>
        </div>
      </div>

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
      }}>
        {[
          { label: "Home", emoji: "⌂", active: true },
          { label: "Track", emoji: "📊", active: false },
          { label: "Chat", emoji: "💬", active: false },
          { label: "Insights", emoji: "✦", active: false },
          { label: "Profile", emoji: "○", active: false },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              cursor: "pointer",
              opacity: tab.active ? 1 : 0.4,
            }}
          >
            <div style={{ fontSize: "20px" }}>{tab.emoji}</div>
            {tab.active && (
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

export default Dashboard