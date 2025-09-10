// index.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sgMail from "@sendgrid/mail";

const app = express();
const PORT = process.env.PORT || 3000;

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route signalement
app.post("/signalement", async (req, res) => {
  const data = req.body;
  console.log("Signalement reçu :", data);

  // Vérification simple
  if (!data.telephone || !data.adresse || !data.date || !data.heure) {
    return res.status(400).json({ message: "Champs obligatoires manquants" });
  }

  const message = {
    to: "115@example.com", // Remplace par le vrai email
    from: "no-reply@tonapp.com",
    subject: "Nouveau signalement",
    text: JSON.stringify(data, null, 2),
    html: `<pre>${JSON.stringify(data, null, 2)}</pre>`,
  };

  try {
    await sgMail.send(message);
    res.status(200).json({ message: "Signalement envoyé" });
  } catch (error) {
    console.error("Erreur SendGrid :", error);
    res.status(500).json({ message: "Erreur serveur lors de l'envoi de l'email" });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
