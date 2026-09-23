export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Méthode non autorisée"
    });
  }

  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message vide"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          instructions:
            "Tu es Athlex IA, un assistant spécialisé dans le sport, la musculation, le cardio, la nutrition et la motivation. Réponds en français de manière claire, utile et concise.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return res.status(response.status).json({
        error: "Erreur lors de la communication avec OpenAI."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Je n'ai pas pu générer une réponse."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Erreur serveur."
    });
  }
}
