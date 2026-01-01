function register() {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("registerMsg").textContent = data.message;
    })
    .catch(err => {
      document.getElementById("registerMsg").textContent = "Erreur inscription";
      console.error(err);
    });
}

function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("loginMsg").textContent = data.message;

      // redirection vers le budget si OK
      if (data.message === "Connexion réussie") {
        window.location.href = "/budget/index.html?email=" + email;
      }
    })
    .catch(err => {
      document.getElementById("loginMsg").textContent = "Erreur connexion";
      console.error(err);
    });
}
