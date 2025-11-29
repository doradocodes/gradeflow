const CLOUDINARY_URL = process.env.CLOUDINARY_URL;

export async function POST(req) {
    const jsonHeaders = { "Content-Type": "application/json" };
    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: req.body,
        });
        const data = await response.json();
        return new Response(JSON.stringify({ audioUrl: data.secure_url }), { status: 200, headers: jsonHeaders });
    } catch (error) {
        console.error("Error uploading audio file:", error);
        return new Response(JSON.stringify({ error: "Audio upload failed" }), { status: 502, headers: jsonHeaders });
    }
}