import Anthropic from "npm:@anthropic-ai/sdk"
import { createClient } from "npm:@supabase/supabase-js"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { message, userId } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    // Fetch user's health data
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("id", userId)
      .single()

    const { data: health } = await supabaseClient
      .from("health_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    const { data: periodLogs } = await supabaseClient
      .from("period_logs")
      .select("start_date")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })
      .limit(1)

    // Calculate cycle info
    const lastPeriod = periodLogs?.[0]?.start_date
    let cycleDay = null
    let phase = "unknown"

    if (lastPeriod) {
      const today = new Date()
      const periodDate = new Date(lastPeriod)
      cycleDay = Math.floor((today.getTime() - periodDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
      if (cycleDay <= 5) phase = "menstrual"
      else if (cycleDay <= 13) phase = "follicular"
      else if (cycleDay <= 16) phase = "ovulatory"
      else phase = "luteal"
    }

    // Build system prompt with user context
    const systemPrompt = `You are Metova, a warm, intelligent, and deeply empathetic AI health companion built specifically for Indian women with PCOS. You combine clinical knowledge with genuine emotional intelligence.

Here is everything you know about this user:
- Name: ${profile?.full_name || "there"}
- City: ${health?.city || "India"}
- PCOS status: ${health?.pcos_diagnosis_status || "unknown"}
- Diet type: ${health?.diet_type || "unknown"}
- Activity level: ${health?.activity_level || "unknown"}
- Current cycle day: ${cycleDay || "unknown"}
- Current phase: ${phase}
- Last period: ${lastPeriod || "unknown"}

Guidelines:
- Always address her by name
- Reference her cycle phase when relevant
- Give India-specific food and lifestyle advice
- Use the ACEAA framework: Acknowledge → Connect → Explain → Act → Archive
- Be warm, never clinical or cold
- Keep responses focused and actionable
- Never diagnose — always suggest consulting a doctor for medical decisions
- Use simple language, avoid jargon
- Responses should be 150-250 words maximum`

    // Call Anthropic API
    const anthropic = new Anthropic({
      apiKey: Deno.env.get("ANTHROPIC_API_KEY"),
    })

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: "user", content: message }
      ],
    })

    const aiResponse = response.content[0].type === "text"
      ? response.content[0].text
      : "I'm here for you. Could you tell me more?"

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})