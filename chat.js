// ========================================
// ATHLEX IA - CHAT
// ========================================

const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const chatMessages = document.getElementById("chat-messages");

function addMessage(message, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = message;

  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const message = userInput.value.trim();

  if (!message) return;

  // Afficher le message de l'utilisateur
  addMessage(message, "user");

  // Vider le champ
  userInput.value = "";

  // Message temporaire
  addMessage("Athlex IA réfléchit...", "ai");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    const data = await response.json();

    // Supprimer "Athlex IA réfléchit..."
    const messages = chatMessages.querySelectorAll(".message.ai");
    if (messages.length > 0) {
      messages[messages.length - 1].remove();
    }

    if (!response.ok) {
      throw new Error(data.error || "Une erreur est survenue.");
    }

    addMessage(data.reply, "ai");

  } catch (error) {
    console.error(error);

    const messages = chatMessages.querySelectorAll(".message.ai");
    if (messages.length > 0) {
      messages[messages.length - 1].remove();
    }

    addMessage(
      "Désolé, Athlex IA n'est pas disponible pour le moment.",
      "ai"
    );
  }
});
