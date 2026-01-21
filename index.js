import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// ================== CONFIG ==================
const TOKEN = process.env.BOT_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;

// Admins autorizadas (usernames SIN @)
const ADMINS = ["chokoolatte", "kctminh"];

// Botones fijos
const BUTTONS = {
  inline_keyboard: [
    [
      { text: ".🥟༘ 𝗖𝗔𝗧", url: "https://t.me/chokoolatte" },
      { text: ".🐰༘ 𝗖𝗔𝗧𝗔", url: "https://t.me/kctminh" }
    ]
  ]
};

// ================== TEXTOS ==================
let TEXTS = {
  cmmds: `⠀𓈒   ׄ   𐔌𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦 𝗗𝗘𝗟 𝗖𝗛𝗔𝗧⠀ ͙⠀

⊹ /cmmds lista de comandos disponibles
⊹ /usd cuentas disponibles en dólares
⊹ /mex cuentas disponibles en pesos mexicanos
⊹ /peru cuentas disponibles en soles peruanos
⊹ /colombia cuentas disponibles en cop
⊹ /guate cuentas disponibles en quetzales
⊹ /crobux cuentas disponibles en robux
⊹ /robux stock de robux

¿no ves lo que buscas? puedes preguntar en el chat o a las admin 💗`,

  usd: `PEGA AQUÍ TU TEXTO DE USD`,
  mex: `PEGA AQUÍ TU TEXTO DE MEX`,
  peru: `PEGA AQUÍ TU TEXTO DE PERU`,
  colombia: `PEGA AQUÍ TU TEXTO DE COLOMBIA`,
  guate: `PEGA AQUÍ TU TEXTO DE GUATE`,
  crobux: `PEGA AQUÍ TU TEXTO DE CROBUX`,
  robux: `PEGA AQUÍ TU TEXTO DE ROBUX`
};

// ================== WEBHOOK ==================
app.post("/", async (req, res) => {
  const msg = req.body.message;
  if (!msg || !msg.text) return res.sendStatus(200);

  const chatId = msg.chat.id;
  const text = msg.text.trim();
  const lower = text.toLowerCase();
  const username = msg.from.username || "";

  // ====== COMANDO EDITAR (solo admins) ======
  if (lower.startsWith("/editar")) {
    if (!ADMINS.includes(username)) {
      return res.sendStatus(200);
    }

    const parts = text.split(" ");
    const key = parts[1];
    const newText = parts.slice(2).join(" ");

    if (TEXTS[key]) {
      TEXTS[key] = newText;

      await fetch(`${API}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ Texto actualizado correctamente",
          reply_markup: BUTTONS
        })
      });
    }
    return res.sendStatus(200);
  }

  // ====== COMANDOS NORMALES ======
  const command = lower.replace("/", "");
  if (TEXTS[command]) {
    await fetch(`${API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: TEXTS[command],
        reply_markup: BUTTONS
      })
    });
  }

  res.sendStatus(200);
});

// ================== SERVER (CLAVE PARA RENDER) ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Bot activo en puerto " + PORT);
});
