export async function POST(req) {
    const jsonHeaders = { "Content-Type": "application/json" };

    let body;
    try {
        body = await req.json();
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: jsonHeaders });
    }

    const { categoryName, maxPoints, criteria } = body;

    if (!categoryName || !maxPoints || !criteria) {
        return new Response(JSON.stringify({ error: "Missing categoryName, maxPoints, or criteria" }), { status: 400, headers: jsonHeaders });
    }

    const prompt = `You are helping a teacher create scoring bands for a rubric category.

Category: ${categoryName}
Max points: ${maxPoints}
Criteria: ${criteria}

Generate 4 scoring bands that cover the full range from 0 to ${maxPoints} points. Each band should describe what a student achieved to earn that range of points, written concisely (one sentence).

Respond only with a JSON array in this exact structure:
[
  { "min": 0, "max": 0, "description": "..." },
  ...
]

The bands must be ordered from highest to lowest, must not overlap, and together must cover 0–${maxPoints}.

Here is an example:
Category: Functionality
Points: 25                       
Criteria: Does the app include all required technical features (frontend form, display, backend API, database)?
Scoring bands:
  23–25 All required features implemented and working correctly
  17–22 Most features work; minor issues that don't break core functionality  
  10–16 Some required features missing or broken; core experience affected
  0–9 Major features absent or app does not function
`;


    let llmResponse;
    try {
        const res = await fetch("https://llm-gateway.assemblyai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": process.env.ASSEMBLYAI_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500,
            }),
        });

        if (!res.ok) {
            const errBody = await res.text();
            throw new Error(`LLM Gateway returned ${res.status}: ${errBody}`);
        }

        llmResponse = await res.json();
    } catch (err) {
        console.error("Scoring bands generation failed:", err);
        return new Response(JSON.stringify({ error: "Generation failed", details: err.message }), { status: 502, headers: jsonHeaders });
    }

    const responseText = llmResponse?.choices?.[0]?.message?.content;
    if (!responseText) {
        return new Response(JSON.stringify({ error: "Empty response from LLM" }), { status: 502, headers: jsonHeaders });
    }

    let bands;
    try {
        bands = JSON.parse(responseText.replace(/```json|```/g, '').trim());
    } catch (err) {
        console.error("Failed to parse scoring bands JSON:", err, "raw:", responseText);
        return new Response(JSON.stringify({ error: "Failed to parse response", raw: responseText }), { status: 502, headers: jsonHeaders });
    }

    return new Response(JSON.stringify({ bands }), { status: 200, headers: jsonHeaders });
}
