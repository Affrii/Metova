import { useState } from "react"
import { supabase } from "./supabase"

function DeleteAccountSheet({ onClose, onDeleted }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      alert("Please type DELETE to confirm")
      return
    }

    setDeleting(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const userId = session.user.id

      // Delete all user data
      await supabase.from("skin_logs").delete().eq("user_id", userId)
      await supabase.from("daily_symptom_logs").delete().eq("user_id", userId)
      await supabase.from("period_logs").delete().eq("user_id", userId)
      await supabase.from("health_profiles").delete().eq("user_id", userId)
      await supabase.from("profiles").delete().eq("id", userId)

      // Sign out
      await supabase.auth.signOut()

      onDeleted()
    } catch (err) {
      console.error("Delete error:", err)
      alert("Something went wrong. Please try again.")
    }
    setDeleting(false)
  }

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "flex-end",
      zIndex: 200,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: "100%", backgroundColor: "#FAF7F2",
        borderRadius: "24px 24px 0 0",
        padding: "28px 24px 48px",
        maxWidth: "480px", margin: "0 auto",
      }}>
        <div style={{
          width: "36px", height: "4px",
          backgroundColor: "#E8E4F0", borderRadius: "2px",
          margin: "0 auto 24px",
        }} />

        {!confirming ? (
          <>
            <div style={{
              fontSize: "22px",
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: "500", color: "#0D0D0D", marginBottom: "8px",
            }}>
              Delete account
            </div>
            <div style={{
              fontSize: "13px", color: "#6B6560",
              lineHeight: "1.6", marginBottom: "24px",
            }}>
              This will permanently delete your account and all your health data including cycle logs, symptom history, and skin records. This cannot be undone.
            </div>

            <div style={{
              backgroundColor: "#FDE8E8",
              border: "0.5px solid #F2C4C4",
              borderRadius: "12px", padding: "14px 16px",
              marginBottom: "24px",
            }}>
              <div style={{ fontSize: "13px", color: "#8A3A3A", lineHeight: "1.6" }}>
                ⚠️ All your data will be permanently removed. You will not be able to recover it.
              </div>
            </div>

            <button onClick={() => setConfirming(true)} style={{
              width: "100%", backgroundColor: "#F2C4CE",
              color: "#8A3A4A", border: "none",
              borderRadius: "100px", padding: "16px",
              fontSize: "15px", fontFamily: "DM Sans, sans-serif",
              fontWeight: "500", cursor: "pointer", marginBottom: "12px",
            }}>
              Yes, delete my account
            </button>
            <button onClick={onClose} style={{
              width: "100%", backgroundColor: "transparent",
              color: "#6B6560", border: "0.5px solid #E8E4F0",
              borderRadius: "100px", padding: "16px",
              fontSize: "15px", fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
            }}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <div style={{
              fontSize: "22px",
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: "500", color: "#0D0D0D", marginBottom: "8px",
            }}>
              Are you sure?
            </div>
            <div style={{
              fontSize: "13px", color: "#6B6560",
              marginBottom: "20px", lineHeight: "1.6",
            }}>
              Type <span style={{ color: "#0D0D0D", fontWeight: "500" }}>DELETE</span> below to confirm
            </div>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              style={{
                width: "100%", backgroundColor: "#FDF0EC",
                border: "0.5px solid #E8E4F0", borderRadius: "12px",
                padding: "14px 16px", fontSize: "15px",
                color: "#0D0D0D", fontFamily: "DM Sans, sans-serif",
                outline: "none", marginBottom: "20px",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={handleDelete}
              disabled={deleting || confirmText !== "DELETE"}
              style={{
                width: "100%",
                backgroundColor: confirmText === "DELETE" ? "#0D0D0D" : "#E8E4F0",
                color: confirmText === "DELETE" ? "#FAF7F2" : "#6B6560",
                border: "none", borderRadius: "100px", padding: "16px",
                fontSize: "15px", fontFamily: "DM Sans, sans-serif",
                fontWeight: "500",
                cursor: confirmText === "DELETE" ? "pointer" : "not-allowed",
                marginBottom: "12px", transition: "all 0.2s ease",
              }}
            >
              {deleting ? "Deleting..." : "Delete forever"}
            </button>
            <button onClick={() => setConfirming(false)} style={{
              width: "100%", backgroundColor: "transparent",
              color: "#6B6560", border: "0.5px solid #E8E4F0",
              borderRadius: "100px", padding: "16px",
              fontSize: "15px", fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
            }}>
              Go back
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default DeleteAccountSheet