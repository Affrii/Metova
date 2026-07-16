import { useState } from "react"
import { supabase } from "./supabase"

const cities = [
  "Mumbai", "Delhi", "Bengaluru", "Chennai", "Hyderabad", "Kolkata", "Pune", "Ahmedabad",
  "Lucknow", "Kanpur", "Jaipur", "Chandigarh", "Dehradun", "Srinagar",
  "Coimbatore", "Madurai", "Kochi", "Thiruvananthapuram", "Mysuru", "Visakhapatnam",
  "Bhubaneswar", "Ranchi", "Patna", "Siliguri",
  "Surat", "Vadodara", "Nagpur", "Nashik",
  "Indore", "Bhopal", "Raipur",
  "Guwahati", "Shillong", "Agartala", "Aizawl", "Imphal", "Kohima", "Itanagar", "Gangtok",
  "Other",
]

function EditProfileSheet({ field, currentValue, onClose, onSaved }) {
  const [value, setValue] = useState(currentValue || "")
  const [saving, setSaving] = useState(false)
  const [citySearch, setCitySearch] = useState("")

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
const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      if (field === "fullName") {
        const { error } = await supabase
          .from("profiles")
          .update({ full_name: value })
          .eq("id", session.user.id)
        if (error) console.error("Name save error:", error)
        else console.log("Name saved! ✅")
      } else {
        const fieldMap = {
          city: "city",
          dietType: "diet_type",
          activityLevel: "activity_level",
          pcosStatus: "pcos_diagnosis_status",
        }
        const { error } = await supabase
          .from("health_profiles")
          .upsert({
            user_id: session.user.id,
            [fieldMap[field]]: field === "city" ? value : value.toLowerCase(),
          }, { onConflict: "user_id" })
        if (error) console.error("Health profile save error:", error)
        else console.log("Health profile saved! ✅")
      }

      onSaved()
      onClose()
    } catch (err) {
      console.error("Save error:", err)
    }
    setSaving(false)
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        display: "flex", alignItems: "flex-end",
        zIndex: 200,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", backgroundColor: "#FAF7F2",
          borderRadius: "24px 24px 0 0",
          padding: "28px 24px 48px",
          maxWidth: "480px", margin: "0 auto",
        }}
      >
        <div style={{
          width: "36px", height: "4px",
          backgroundColor: "#E8E4F0", borderRadius: "2px",
          margin: "0 auto 24px",
        }} />

        <div style={{
          fontSize: "20px",
          fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500", color: "#0D0D0D", marginBottom: "20px",
        }}>
          Edit {editLabels[field]}
        </div>

        {/* Full name text input */}
        {field === "fullName" && (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your full name"
            style={{
              width: "100%", backgroundColor: "#FDF0EC",
              border: "0.5px solid #E8E4F0", borderRadius: "12px",
              padding: "14px 16px", fontSize: "15px",
              color: "#0D0D0D", fontFamily: "DM Sans, sans-serif",
              outline: "none", marginBottom: "20px",
              boxSizing: "border-box",
            }}
          />
        )}

        {/* City search */}
        {field === "city" && (
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              placeholder="Search your city..."
              style={{
                width: "100%", backgroundColor: "#FDF0EC",
                border: "0.5px solid #E8E4F0", borderRadius: "12px",
                padding: "14px 16px", fontSize: "15px",
                color: "#0D0D0D", fontFamily: "DM Sans, sans-serif",
                outline: "none", marginBottom: "12px",
                boxSizing: "border-box",
              }}
            />
            <div style={{
              maxHeight: "220px", overflowY: "auto",
              border: "0.5px solid #E8E4F0", borderRadius: "12px",
              backgroundColor: "#FDF0EC",
            }}>
              {cities
                .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                .map((c, i, arr) => (
                  <div
                    key={c}
                    onClick={() => { setValue(c); setCitySearch("") }}
                    style={{
                      padding: "14px 16px",
                      borderBottom: i < arr.length - 1 ? "0.5px solid #E8E4F0" : "none",
                      cursor: "pointer", fontSize: "14px",
                      fontFamily: "DM Sans, sans-serif",
                      color: value === c ? "#0D0D0D" : "#6B6560",
                      fontWeight: value === c ? "500" : "400",
                      backgroundColor: value === c ? "#E8E4F0" : "transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {c}
                  </div>
                ))}
            </div>
            {value && (
              <div style={{
                marginTop: "10px", fontSize: "13px",
                color: "#0D0D0D", fontFamily: "DM Sans, sans-serif",
              }}>
                Selected: <span style={{ fontWeight: "500" }}>{value}</span>
              </div>
            )}
          </div>
        )}

        {/* Pill selectors */}
        {editOptions[field] && (
          <div style={{
            display: "flex", flexWrap: "wrap",
            gap: "8px", marginBottom: "24px",
          }}>
            {editOptions[field].map((option) => (
              <div
                key={option}
                onClick={() => setValue(option)}
                style={{
                  padding: "10px 18px", borderRadius: "100px",
                  border: `1px solid ${value === option ? "#0D0D0D" : "#E8E4F0"}`,
                  backgroundColor: value === option ? "#0D0D0D" : "transparent",
                  color: value === option ? "#FAF7F2" : "#6B6560",
                  fontSize: "13px", cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  transition: "all 0.2s ease",
                }}
              >
                {option.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        )}

        {/* Save button */}
        <div
          onClick={handleSave}
          style={{
            backgroundColor: saving ? "#E8E4F0" : "#0D0D0D",
            color: saving ? "#6B6560" : "#FAF7F2",
            borderRadius: "100px", padding: "16px",
            textAlign: "center", cursor: "pointer",
            fontSize: "15px", fontWeight: "500",
            fontFamily: "DM Sans, sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          {saving ? "Saving..." : "Save changes"}
        </div>
      </div>
    </div>
  )
}

export default EditProfileSheet