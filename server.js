import express from "express";

const app = express();
app.use(express.json());

app.post("/ai", async (req, res) => {
  try {
    const message = String(req.body.message || "").slice(0, 300);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: "system",
            content: "You are BloxAI Test, a friendly Roblox AI. Keep replies short and casual."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 120
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No response.";

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "Error talking to AI." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});
