import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { command, companyName, currentData } = await req.json();

    if (!command || !companyName) {
      return new Response(JSON.stringify({ error: "Missing command or companyName" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an AI assistant that converts natural language commands into structured JSON updates for a company record.

The company "${companyName}" has these editable fields:
- name (string)
- website (string, URL)
- logoUrl (string, URL)  
- brandTitleHtml (string, HTML)
- careerUrl (string, URL)
- linkedinUrl (string, URL)
- foundedYear (number)
- hqCity (string)
- hqCountry (string)
- industry (string: Technology, Finance, Healthcare, E-commerce, Education, Manufacturing, Consulting, Media, Telecom, Automotive, Energy, Real Estate, Other)
- companySize (string: 1-10, 11-50, 51-200, 201-500, 501-1000, 1001-5000, 5000+)
- technologies (array of strings)
- description (string)
- notes (string)
- coreStrength (string)
- hiringTechnologies (string)
- futureDirection (string)
- organizationStrength (string)
- notableProducts (string)
- careerBenefits (string)
- stage (string)
- headcount (string)
- brandColor (string, hex color like #FF5733)
- gradientColor1 (string, hex color)
- gradientColor2 (string, hex color)
- gradientAngle (number, 0-360)
- buttonGradientColor1 (string, hex color)
- buttonGradientColor2 (string, hex color)
- buttonGradientAngle (number, 0-360)

Current company data:
${JSON.stringify(currentData, null, 2)}

RULES:
1. Return ONLY a valid JSON object with the fields to update. Do not include fields that aren't changing.
2. If the command is unclear or you can't determine what to update, return: {"clarification": "your question here"}
3. For technologies, if user says "add X", merge with existing. If "set to X", replace.
4. For colors, convert color names to hex codes (e.g., "deep blue" → "#1E3A8A", "purple" → "#7C3AED", "cyan" → "#06B6D4").
5. Return pure JSON only, no markdown, no explanation.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: command },
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || "";

    // Parse JSON from response (strip markdown fences if present)
    let parsed;
    try {
      const jsonStr = content.replace(/^```json?\n?/i, "").replace(/\n?```$/i, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return new Response(JSON.stringify({ 
        clarification: "I couldn't understand that command. Try something like: 'Change brand color to deep blue' or 'Add React and Python to technologies'." 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
