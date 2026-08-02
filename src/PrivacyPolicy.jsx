function PrivacyPolicy({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      backgroundColor: "rgba(0,0,0,0.3)",
      zIndex: 200,
      display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        width: "100%", maxHeight: "90vh",
        backgroundColor: "#FAF7F2",
        borderRadius: "24px 24px 0 0",
        overflowY: "auto",
        fontFamily: "DM Sans, sans-serif",
      }}>

        {/* Close bar */}
        <div onClick={onClose} style={{
          width: "100%", padding: "16px 0 8px",
          display: "flex", justifyContent: "center",
          cursor: "pointer", position: "sticky",
          top: 0, backgroundColor: "#FAF7F2",
          zIndex: 10,
        }}>
          <div style={{
            width: "36px", height: "4px",
            backgroundColor: "#CFC1BA", borderRadius: "2px",
          }} />
        </div>

        {/* Content */}
        <div style={{ padding: "8px 24px 48px", maxWidth: "480px", margin: "0 auto" }}>

          <h1 style={{
            fontSize: "24px",
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: "500", color: "#0D0D0D",
            margin: "0 0 8px",
          }}>
            Privacy Policy
          </h1>

          <div style={{ fontSize: "12px", color: "#6B6560", marginBottom: "32px" }}>
            Last updated: July 2026
          </div>

          {[
            {
              title: "Who we are",
              content: "Metova is an AI-powered hormonal health companion built for Indian women. We are based in India and committed to protecting your personal health data with the highest standards of privacy.",
            },
            {
              title: "What data we collect",
              content: "We collect information you provide during onboarding: your name, date of birth, city, health history, cycle data, and lifestyle information. We also collect data you log in the app such as period dates, symptoms, and skin observations.",
            },
            {
              title: "How we use your data",
              content: "Your data is used solely to personalise your Metova experience — to provide cycle insights, phase-based recommendations, and AI health guidance. We never sell your data to third parties. Ever.",
            },
            {
              title: "AI and your data",
              content: "When you chat with Metova's AI, your health profile is used to personalise responses. This data is processed securely through Anthropic's API. Your conversations are not stored permanently and are not used to train AI models.",
            },
            {
              title: "Data storage",
              content: "Your data is stored securely on Supabase servers with row-level security enabled. Only you can access your own data. We use industry-standard encryption for all data in transit and at rest.",
            },
            {
              title: "Your rights",
              content: "You have the right to access, edit, or delete your data at any time. You can export your full health record from the Profile tab. You can delete your account permanently from the Profile tab, which removes all your data immediately.",
            },
            {
              title: "Third party services",
              content: "We use Supabase for data storage and authentication, Anthropic for AI responses, and Vercel for hosting. Each of these services has their own privacy policies and security standards.",
            },
            {
              title: "Children's privacy",
              content: "Metova is intended for users aged 13 and above. We do not knowingly collect data from children under 13. If you believe a child has provided us with personal information, please contact us immediately.",
            },
            {
              title: "Changes to this policy",
              content: "We may update this privacy policy from time to time. We will notify you of significant changes through the app. Continued use of Metova after changes means you accept the updated policy.",
            },
            {
              title: "Contact us",
              content: "If you have any questions about this privacy policy or how we handle your data, please contact us at support@metova.health. We respond within 24 hours.",
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: "28px" }}>
              <h2 style={{
                fontSize: "16px",
                fontFamily: "Cormorant Garamond, serif",
                fontWeight: "500", color: "#0D0D0D",
                margin: "0 0 8px",
              }}>
                {section.title}
              </h2>
              <p style={{
                fontSize: "13px", color: "#6B6560",
                lineHeight: "1.7", margin: "0",
              }}>
                {section.content}
              </p>
            </div>
          ))}

          <div style={{
            backgroundColor: "#FDF0EC",
            border: "0.5px solid #E8E4F0",
            borderRadius: "16px", padding: "16px 20px",
            marginTop: "16px",
          }}>
            <div style={{ fontSize: "13px", color: "#6B6560", lineHeight: "1.6" }}>
              Metova is not a medical device and does not provide medical advice.
              Always consult your healthcare provider for medical decisions.
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy