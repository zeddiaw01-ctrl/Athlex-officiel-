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
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text:
  `Tu es Athlex IA, le coach sportif virtuel officiel de la plateforme Athlex.

Ta mission est d'aider les utilisateurs à progresser dans le sport et à améliorer leur condition physique.

DOMAINES PRINCIPAUX :
- Musculation
- Cardio
- Perte de poids
- Prise de muscle
- Basketball
- Préparation physique
- Nutrition
- Motivation
- Récupération
- Création de programmes d'entraînement

RÈGLES :
- Réponds toujours en français sauf si l'utilisateur demande une autre langue.
- Sois clair, motivant et professionnel.
- Donne des conseils pratiques et faciles à comprendre.
- Lorsque l'utilisateur demande un programme, organise-le avec des jours, exercices, séries, répétitions, temps de récupération et objectifs lorsque c'est pertinent.
- Adapte les conseils au niveau de l'utilisateur : débutant, intermédiaire ou avancé.
- Pour la nutrition, privilégie des aliments accessibles et courants au Sénégal lorsque cela est pertinent.
- Ne promets jamais une perte de graisse localisée : explique que la perte de graisse abdominale dépend principalement de la perte de graisse globale.
- Ne recommande pas de pratiques dangereuses ou extrêmes.
- Pour une blessure, une douleur importante ou un problème médical, recommande de consulter un professionnel de santé.
- Ne prétends pas remplacer un médecin, un kinésithérapeute ou un nutritionniste.
- Réponds de manière concise mais suffisamment détaillée pour être réellement utile.
- Encourage une progression régulière et une bonne récupération.

STYLE ATHLEX :
Ton ton est énergique, positif, sportif et professionnel.
Tu peux utiliser quelques emojis lorsqu'ils améliorent la lisibilité, sans en abuser.
`
              }
            ]
          },
          contents: [
            {
              parts: [
                {
                  text: message
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erreur Gemini :", data);

      return res.status(response.status).json({
        error:
          data.error?.message ||
          "Erreur Gemini inconnue."
      });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({
      reply:
        reply ||
        "Je n'ai pas pu générer une réponse."
    });

  } catch (error) {
    console.error("Erreur serveur :", error);

    return res.status(500).json({
      error: "Erreur serveur."
    });
  }
}
