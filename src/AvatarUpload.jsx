import { useState } from "react"
import { supabase } from "./supabase"

function AvatarUpload({ userId, currentAvatar, firstName, onUploaded }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const filePath = `${userId}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        setUploading(false)
        return
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      const avatarUrl = data.publicUrl

      await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", userId)

      onUploaded(avatarUrl)
    } catch (err) {
      console.error("Error:", err)
    }
    setUploading(false)
  }

  return (
    <div style={{ position: "relative", width: "56px", height: "56px", flexShrink: 0 }}>
      {currentAvatar ? (
        <img
          src={currentAvatar}
          alt="Profile"
          style={{
            width: "56px", height: "56px",
            borderRadius: "50%", objectFit: "cover",
            border: "0.5px solid #E8E4F0",
          }}
        />
      ) : (
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          backgroundColor: "#E8E4F0", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: "22px", fontFamily: "Cormorant Garamond, serif",
          color: "#3D3935",
        }}>
          {firstName?.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Upload overlay */}
      <label style={{
        position: "absolute", inset: 0,
        borderRadius: "50%", cursor: "pointer",
        backgroundColor: uploading ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background-color 0.2s ease",
      }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = uploading ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)"}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
        {uploading ? (
          <div style={{ color: "#FAF7F2", fontSize: "10px", fontFamily: "DM Sans, sans-serif" }}>
            ...
          </div>
        ) : (
          <div style={{
            color: "#FAF7F2", fontSize: "16px",
            opacity: 0, transition: "opacity 0.2s ease",
          }}
            className="avatar-edit-icon"
          >
            ✎
          </div>
        )}
      </label>
    </div>
  )
}

export default AvatarUpload