// récupérer l'email depuis l'URL
const params = new URLSearchParams(window.location.search);
const email = params.get("email");

if (!email) {
  alert("Utilisateur non connecté");
}

// message bonjour
const welcome = document.getElementById("welcome");
const prenom = email.split("@")[0];
welcome.textContent = "Bonjour " + prenom + " 👋";

// ajouter une dépense
function addExpense() {
  const labelInput = document.getElementById("label");
  const amountInput = document.getElementById("amount");

  const label = labelInput.value;
  const amount = amountInput.value;

  if (!label || !amount) return;

  fetch("/api/budget/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, label, amount })
  })
    .then(() => {
      labelInput.value = "";
      amountInput.value = "";
      loadBudget();
    });
}

// supprimer une dépense
function deleteExpense(id) {
  fetch(`/api/budget/delete/${email}/${id}`, {
    method: "DELETE"
  })
    .then(() => loadBudget());
}

// charger le budget
function loadBudget() {
  fetch(`/api/budget/${email}`)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("expenses");
      list.innerHTML = "";

      data.expenses.forEach(e => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${e.label} - ${e.amount} €
          <span style="color:red; cursor:pointer; margin-left:10px;"
                onclick="deleteExpense(${e.id})">❌</span>
        `;
        list.appendChild(li);
      });

      document.getElementById("total").textContent =
        "Total : " + data.total + " €";
    });
}

// touche Entrée
document.addEventListener("keydown", e => {
  if (e.key === "Enter") addExpense();
});

// chargement initial
loadBudget();
