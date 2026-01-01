const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
app.use(express.json());

// === SERVIR LES FRONTENDS ===
app.use("/auth", express.static(path.join(__dirname, "auth-frontend")));
app.use("/budget", express.static(path.join(__dirname, "budget-frontend")));

// === BASE UTILISATEURS (TEMPORAIRE) ===
let users = [];

// === ROUTE TEST ===
app.get("/", (req, res) => {
  res.send("Serveur API Budget + Auth opérationnel");
});

// === INSCRIPTION ===
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(409).json({ message: "Utilisateur déjà existant" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    email,
    password: hashedPassword,
    expenses: []
  });

  res.status(201).json({ message: "Inscription réussie" });
});

// === CONNEXION ===
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Utilisateur introuvable" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Mot de passe incorrect" });
  }

  res.json({ message: "Connexion réussie", email });
});

// === AJOUT DÉPENSE ===
app.post("/api/budget/add", (req, res) => {
  const { email, label, amount } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Utilisateur non connecté" });
  }

  user.expenses.push({
    id: Date.now(),
    label,
    amount: Number(amount)
  });

  res.status(201).json({ message: "Dépense ajoutée" });
});

// === VOIR BUDGET ===
app.get("/api/budget/:email", (req, res) => {
  const user = users.find(u => u.email === req.params.email);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  const total = user.expenses.reduce((sum, e) => sum + e.amount, 0);

  res.json({
    expenses: user.expenses,
    total
  });
});

// === LANCER SERVEUR ===
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur le port " + PORT);
});

// ❌ SUPPRIMER UNE DÉPENSE
app.delete("/api/budget/delete/:email/:id", (req, res) => {
  const { email, id } = req.params;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }

  user.expenses = user.expenses.filter(e => e.id != id);

  res.json({ message: "Dépense supprimée" });
});
