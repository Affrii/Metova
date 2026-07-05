import { useState } from "react"

function SkinScreen({ userData }) {
  const [checkedItems, setCheckedItems] = useState({})
  const [acneZones, setAcneZones] = useState({
    forehead: false,
    leftCheek: false,
    rightCheek: false,
    chin: false,
    jawline: false,
    nose: false,
  })

  const calculateCycleInfo = () => {
    if (!userData?.lastPeriod) {
      return { phase: "follicular", cycleDay: 1 }
    }
    const lastPeriod = new Date(userData.lastPeriod)
    const today = new Date()
    const cycleDay = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1
    let phase = "follicular"
    if (cycleDay <= 5) phase = "menstrual"
    else if (cycleDay <= 13) phase = "follicular"
    else if (cycleDay <= 16) phase = "ovulatory"
    else phase = "luteal"
    return { phase, cycleDay }
  }

  const { phase, cycleDay } = calculateCycleInfo()

  const phaseData = {
    menstrual: {
      label: "Menstrual phase",
      color: "#F2C4CE",
      textColor: "#8A3A4A",
      emoji: "🌙",
      tagline: "Rest your skin. Less is more.",
      score: { glow: 2, hydration: 3, oil: 2, breakout: 4 },
      routine: {
        morning: [
          "Gentle cleanser — no foaming",
          "Fragrance-free moisturiser",
          "SPF 30+ (always)",
          "Cold compress if inflamed",
        ],
        evening: [
          "Micellar water to remove SPF",
          "Calming toner (rose water or centella)",
          "Niacinamide serum — reduces redness",
          "Rich moisturiser — skin is drier now",
          "Skip retinol this week",
        ],
      },
      foods: [
        { emoji: "🐟", name: "Salmon / Flaxseed", benefit: "Omega-3 reduces inflammation" },
        { emoji: "🫐", name: "Blueberries", benefit: "Antioxidants fight breakouts" },
        { emoji: "🥬", name: "Spinach", benefit: "Iron restores glow" },
        { emoji: "🍵", name: "Spearmint tea", benefit: "Lowers androgens naturally" },
      ],
      makeup: {
        avoid: ["Heavy full-coverage foundation", "Pore-clogging primers", "Glitter or shimmer", "Fragrant setting sprays"],
        recommend: ["Tinted moisturiser with SPF", "Cream blush — light and buildable", "Lip balm over lipstick", "Mascara only — skip eye shadow"],
        ingredients: {
          avoid: ["Alcohol", "Fragrance", "Heavy silicones", "Comedogenic oils"],
          love: ["Niacinamide", "Centella asiatica", "Hyaluronic acid", "Aloe vera"],
        },
      },
    },
    follicular: {
      label: "Follicular phase",
      color: "#E4D4F4",
      textColor: "#5A3A80",
      emoji: "🌱",
      tagline: "Your skin is waking up. Glow season.",
      score: { glow: 4, hydration: 4, oil: 2, breakout: 1 },
      routine: {
        morning: [
          "Gentle foaming cleanser",
          "Vitamin C serum — your skin absorbs it best now",
          "Lightweight moisturiser",
          "SPF 50 — oestrogen makes skin photosensitive",
        ],
        evening: [
          "Double cleanse if wearing SPF",
          "Exfoliate 2x this week (AHA or BHA)",
          "Retinol — your skin can handle it now",
          "Peptide moisturiser",
        ],
      },
      foods: [
        { emoji: "🥑", name: "Avocado", benefit: "Healthy fats boost skin barrier" },
        { emoji: "🥕", name: "Carrots", benefit: "Beta-carotene for natural glow" },
        { emoji: "🫘", name: "Chickpeas", benefit: "Zinc controls sebum production" },
        { emoji: "🍋", name: "Lemon water", benefit: "Vitamin C brightens skin" },
      ],
      makeup: {
        avoid: ["Heavy primers", "Matte everything — skin is naturally glowy", "Cakey foundations"],
        recommend: ["Dewy skin tints", "Highlighter on cheekbones", "Glossy lips", "Light concealer only where needed"],
        ingredients: {
          avoid: ["Drying alcohols", "Harsh sulfates"],
          love: ["Vitamin C", "Retinol", "AHA/BHA", "Peptides"],
        },
      },
    },
    ovulatory: {
      label: "Ovulatory phase",
      color: "#E8C87A",
      textColor: "#6A4A10",
      emoji: "✨",
      tagline: "Peak glow. Your skin is luminous.",
      score: { glow: 5, hydration: 4, oil: 3, breakout: 2 },
      routine: {
        morning: [
          "Micellar or gel cleanser",
          "Antioxidant serum (Vitamin C or E)",
          "Lightweight gel moisturiser",
          "SPF 50 — crucial this week",
        ],
        evening: [
          "Oil cleanser to remove sunscreen",
          "BHA toner to prep for active ingredients",
          "Retinol or AHA — skin is resilient now",
          "Barrier moisturiser",
        ],
      },
      foods: [
        { emoji: "🥦", name: "Broccoli", benefit: "DIM compound balances oestrogen" },
        { emoji: "🫚", name: "Olive oil", benefit: "Monounsaturated fats = supple skin" },
        { emoji: "🍓", name: "Strawberries", benefit: "Vitamin C boosts collagen" },
        { emoji: "🌰", name: "Walnuts", benefit: "Omega-3 reduces inflammation" },
      ],
      makeup: {
        avoid: ["Heavy matte foundations — waste your glow", "Cakey setting powders"],
        recommend: ["Skin tints or BB cream", "Cream bronzer", "Glossy lip", "Dewy setting spray"],
        ingredients: {
          avoid: ["Comedogenic oils", "Heavy occlusives"],
          love: ["Vitamin C", "Vitamin E", "Squalane", "Niacinamide"],
        },
      },
    },
    luteal: {
      label: "Luteal phase",
      color: "#CFC1BA",
      textColor: "#4A3A35",
      emoji: "🍂",
      tagline: "Breakout watch. Be extra gentle.",
      score: { glow: 2, hydration: 3, oil: 4, breakout: 4 },
      routine: {
        morning: [
          "Salicylic acid cleanser (2%)",
          "Niacinamide serum — controls oil + redness",
          "Oil-free moisturiser",
          "SPF 30+ non-comedogenic",
        ],
        evening: [
          "Double cleanse — oil attracts oil",
          "BHA toner on oily areas",
          "Spot treatment on active breakouts",
          "Skip retinol if skin is reactive",
          "Light gel moisturiser",
        ],
      },
      foods: [
        { emoji: "🍵", name: "Spearmint tea", benefit: "Reduces androgen-driven oil" },
        { emoji: "🥜", name: "Pumpkin seeds", benefit: "Zinc fights hormonal acne" },
        { emoji: "🫚", name: "Ghee (small amount)", benefit: "Butyrate calms gut-skin axis" },
        { emoji: "🫐", name: "Dark berries", benefit: "Antioxidants prevent inflammation" },
      ],
      makeup: {
        avoid: ["Pore-clogging foundations", "Coconut oil-based products", "Heavy cream blush on chin/jaw", "Fragrant products"],
        recommend: ["Non-comedogenic foundation", "Powder blush — absorbs oil", "Setting powder on T-zone", "Salicylic acid lip balm if needed"],
        ingredients: {
          avoid: ["Coconut oil", "Isopropyl myristate", "Fragrance", "Heavy silicones"],
          love: ["Salicylic acid", "Niacinamide", "Tea tree (diluted)", "Zinc"],
        },
      },
    },
  }

  const current = phaseData[phase]

  const toggleCheck = (id) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleZone = (zone) => {
    setAcneZones(prev => ({ ...prev, [zone]: !prev[zone] }))
  }

  const renderStars = (count) => {
    return [1, 2, 3, 4, 5].map(i => (
      <span key={i} style={{ color: i <= count ? current.color : "#E8E4F0", fontSize: "14px" }}>★</span>
    ))
  }

  const scoreTotal = Math.round(
    ((current.score.glow + current.score.hydration + (5 - current.score.oil) + (5 - current.score.breakout)) / 20) * 100
  )

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAF7F2",
      fontFamily: "DM Sans, sans-serif",
      paddingBottom: "100px",
    }}>

      {/* Header */}
      <div style={{ padding: "52px 24px 0", maxWidth: "480px", margin: "0 auto" }}>
        <div className="fade-up-1" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <h1 style={{
            fontSize: "28px", fontFamily: "Cormorant Garamond, serif",
            fontWeight: "500", color: "#0D0D0D", margin: "0",
          }}>
            Skin
          </h1>
          <div style={{
            backgroundColor: current.color,
            color: current.textColor,
            fontSize: "11px", fontFamily: "DM Sans, sans-serif",
            fontWeight: "500", padding: "6px 14px",
            borderRadius: "100px", letterSpacing: "0.04em",
          }}>
            {current.emoji} {current.label}
          </div>
        </div>
        <p className="fade-up-2" style={{ fontSize: "13px", color: "#6B6560", margin: "0 0 24px" }}>
          {current.tagline}
        </p>
      </div>

      <div style={{ padding: "0 24px", maxWidth: "480px", margin: "0 auto" }}>

        {/* Skin Wellness Score */}
        <div className="fade-up-3" style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
            Today's skin score
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "16px" }}>
            <div style={{
              fontSize: "56px", fontFamily: "Cormorant Garamond, serif",
              fontWeight: "400", color: "#0D0D0D", lineHeight: "1",
            }}>
              {scoreTotal}
            </div>
            <div style={{ fontSize: "18px", color: "#6B6560", marginBottom: "8px" }}>/100</div>
          </div>

          {[
            { label: "Glow", value: current.score.glow },
            { label: "Hydration", value: current.score.hydration },
            { label: "Oil control", value: 5 - current.score.oil },
            { label: "Breakout risk", value: 5 - current.score.breakout },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between", marginBottom: "8px",
            }}>
              <div style={{ fontSize: "13px", color: "#6B6560", width: "100px" }}>{item.label}</div>
              <div>{renderStars(item.value)}</div>
            </div>
          ))}
        </div>

        {/* Face Zone Logger */}
        <div className="fade-up-4" style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
            Log today's skin
          </div>
          <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "16px" }}>
            Tap zones where you have breakouts
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: "180px", height: "220px" }}>
              <svg viewBox="0 0 180 220" width="180" height="220" style={{ position: "absolute", top: 0, left: 0 }}>
                <ellipse cx="90" cy="115" rx="70" ry="90" fill="#FDF0EC" stroke="#E8E4F0" strokeWidth="1" />
                <ellipse cx="65" cy="100" rx="8" ry="5" fill="#E8E4F0" />
                <ellipse cx="115" cy="100" rx="8" ry="5" fill="#E8E4F0" />
                <ellipse cx="90" cy="125" rx="5" ry="7" fill="#E8E4F0" />
                <path d="M 72 148 Q 90 160 108 148" fill="none" stroke="#E8E4F0" strokeWidth="2" strokeLinecap="round" />
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
                  transition: "all 0.2s ease",
                }}>{label}</div>
              ))}
            </div>
          </div>
          {Object.values(acneZones).some(Boolean) && (
            <div style={{ fontSize: "12px", color: "#6B6560", textAlign: "center", marginTop: "12px" }}>
              Logged:{" "}
              <span style={{ color: "#0D0D0D", fontWeight: "500" }}>
                {Object.entries(acneZones).filter(([_, v]) => v).map(([k]) => k.replace(/([A-Z])/g, " $1").toLowerCase()).join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Morning Routine */}
        <div className="fade-up-5" style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            ☀️ Morning routine
          </div>
          {current.routine.morning.map((item, i) => {
            const id = `morning-${i}`
            return (
              <div key={id} onClick={() => toggleCheck(id)} style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                marginBottom: "14px", cursor: "pointer",
              }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "6px",
                  border: checkedItems[id] ? "none" : "1.5px solid #E8E4F0",
                  backgroundColor: checkedItems[id] ? "#0D0D0D" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: "1px", transition: "all 0.2s ease",
                }}>
                  {checkedItems[id] && <span style={{ color: "#FAF7F2", fontSize: "12px" }}>✓</span>}
                </div>
                <div style={{
                  fontSize: "14px", color: checkedItems[id] ? "#6B6560" : "#0D0D0D",
                  textDecoration: checkedItems[id] ? "line-through" : "none",
                  lineHeight: "1.5", transition: "all 0.2s ease",
                }}>
                  {item}
                </div>
              </div>
            )
          })}
        </div>

        {/* Evening Routine */}
        <div className="fade-up-6" style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            🌙 Evening routine
          </div>
          {current.routine.evening.map((item, i) => {
            const id = `evening-${i}`
            return (
              <div key={id} onClick={() => toggleCheck(id)} style={{
                display: "flex", alignItems: "flex-start", gap: "12px",
                marginBottom: "14px", cursor: "pointer",
              }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "6px",
                  border: checkedItems[id] ? "none" : "1.5px solid #E8E4F0",
                  backgroundColor: checkedItems[id] ? "#0D0D0D" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: "1px", transition: "all 0.2s ease",
                }}>
                  {checkedItems[id] && <span style={{ color: "#FAF7F2", fontSize: "12px" }}>✓</span>}
                </div>
                <div style={{
                  fontSize: "14px", color: checkedItems[id] ? "#6B6560" : "#0D0D0D",
                  textDecoration: checkedItems[id] ? "line-through" : "none",
                  lineHeight: "1.5", transition: "all 0.2s ease",
                }}>
                  {item}
                </div>
              </div>
            )
          })}
        </div>

        {/* Foods for skin */}
        <div className="fade-up-7" style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            🥗 Foods for your skin this week
          </div>
          {current.foods.map((food) => (
            <div key={food.name} style={{
              display: "flex", alignItems: "center", gap: "14px",
              marginBottom: "14px",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "12px",
                backgroundColor: "#FAF7F2", border: "0.5px solid #E8E4F0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", flexShrink: 0,
              }}>
                {food.emoji}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "500", color: "#0D0D0D" }}>{food.name}</div>
                <div style={{ fontSize: "12px", color: "#6B6560", marginTop: "2px" }}>{food.benefit}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Makeup Compatibility */}
        <div className="fade-up-8" style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            💄 Makeup this phase
          </div>

          <div style={{ fontSize: "12px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
            Skip these
          </div>
          {current.makeup.avoid.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ color: "#F2C4CE", fontSize: "14px" }}>✕</span>
              <span style={{ fontSize: "13px", color: "#6B6560" }}>{item}</span>
            </div>
          ))}

          <div style={{ height: "0.5px", backgroundColor: "#E8E4F0", margin: "16px 0" }} />

          <div style={{ fontSize: "12px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
            Go for these
          </div>
          {current.makeup.recommend.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ color: "#D4E4D8", fontSize: "14px" }}>✓</span>
              <span style={{ fontSize: "13px", color: "#0D0D0D" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Ingredients */}
        <div className="fade-up-9" style={{
          backgroundColor: "#FDF0EC",
          border: "0.5px solid #E8E4F0",
          borderRadius: "20px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}>
          <div style={{ fontSize: "11px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
            🧴 Ingredient guide this phase
          </div>

          <div style={{ fontSize: "12px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
            Avoid
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {current.makeup.ingredients.avoid.map((ing) => (
              <div key={ing} style={{
                padding: "6px 14px", borderRadius: "100px",
                backgroundColor: "#FDE8E8", border: "0.5px solid #F2C4C4",
                fontSize: "12px", color: "#8A3A3A",
              }}>
                {ing}
              </div>
            ))}
          </div>

          <div style={{ fontSize: "12px", color: "#6B6560", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
            Your skin loves
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {current.makeup.ingredients.love.map((ing) => (
              <div key={ing} style={{
                padding: "6px 14px", borderRadius: "100px",
                backgroundColor: "#E8F4E8", border: "0.5px solid #C4E4C4",
                fontSize: "12px", color: "#2A5A2A",
              }}>
                {ing}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default SkinScreen