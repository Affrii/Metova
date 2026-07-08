function SupportSheet({ onClose }) {
  const cardStyle = {
    backgroundColor: "#FDF0EC",
    border: "0.5px solid #E8E4F0",
    borderRadius: "16px",
    overflow: "hidden",
    marginBottom: "12px",
  }

  const rowStyle = {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", padding: "16px 20px",
    borderBottom: "0.5px solid #E8E4F0", cursor: "pointer",
  }

  const lastRowStyle = { ...rowStyle, borderBottom: "none" }
  const rowLabelStyle = { fontSize: "14px", color: "#0D0D0D", fontFamily: "DM Sans, sans-serif" }
  const rowSubStyle = { fontSize: "12px", color: "#6B6560", fontFamily: "DM Sans, sans-serif", marginTop: "2px" }

  const chevron = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#6B6560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
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

        <div style={{
          fontSize: "22px", fontFamily: "Cormorant Garamond, serif",
          fontWeight: "500", color: "#0D0D0D", marginBottom: "4px",
        }}>
          Support & feedback
        </div>
        <div style={{ fontSize: "13px", color: "#6B6560", marginBottom: "24px" }}>
          We're always here to help
        </div>

        <div style={cardStyle}>
          <div style={rowStyle} onClick={() => window.open("mailto:support@metova.health?subject=Support Request", "_blank")}>
            <div>
              <div style={rowLabelStyle}>Contact support</div>
              <div style={rowSubStyle}>We reply within 24 hours</div>
            </div>
            {chevron}
          </div>
          <div style={rowStyle} onClick={() => window.open("mailto:support@metova.health?subject=Bug Report&body=Describe the bug here:", "_blank")}>
            <div>
              <div style={rowLabelStyle}>Report a bug</div>
              <div style={rowSubStyle}>Help us improve Metova</div>
            </div>
            {chevron}
          </div>
          <div style={rowStyle} onClick={() => window.open("mailto:support@metova.health?subject=Feature Request&body=I would love to see:", "_blank")}>
            <div>
              <div style={rowLabelStyle}>Suggest a feature</div>
              <div style={rowSubStyle}>Your ideas shape Metova</div>
            </div>
            {chevron}
          </div>
          <div style={rowStyle} onClick={() => window.open("https://instagram.com/metova.health", "_blank")}>
            <div>
              <div style={rowLabelStyle}>Follow us</div>
              <div style={rowSubStyle}>@metova.health on Instagram</div>
            </div>
            {chevron}
          </div>
          <div style={lastRowStyle} onClick={() => window.open("https://metova.health", "_blank")}>
            <div>
              <div style={rowLabelStyle}>Visit our website</div>
              <div style={rowSubStyle}>metova.health</div>
            </div>
            {chevron}
          </div>
        </div>

        <div onClick={onClose} style={{
          width: "100%", backgroundColor: "transparent",
          border: "0.5px solid #E8E4F0", borderRadius: "100px",
          padding: "16px", fontSize: "15px",
          fontFamily: "DM Sans, sans-serif",
          color: "#6B6560", cursor: "pointer",
          textAlign: "center", marginTop: "8px",
        }}>
          Close
        </div>
      </div>
    </div>
  )
}

export default SupportSheet