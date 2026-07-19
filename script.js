let board = document.querySelector("#btns"); // Cibler la zone des boutons
let output = document.getElementById("output");
let expression = "";
let hist = document.getElementById("hist_section");
let showHist = document.getElementById("hist-btn");

// Gestion de l'affichage de l'historique
showHist.addEventListener("click", () => {
  hist.classList.toggle("hidden");
});

// Variable globale pour stocker la mémoire (boutons MC, MR, M+, M-, MS)
let memoire = 0;

// Variable globale pour suivre la ligne d'historique à remplir
let ligne = 1;

// Fonction pour insérer le texte dans l'historique
function put(text) {
  let element = document.getElementById(`ligne${ligne}`);
  if (element) {
    element.textContent = text;
  }
  // Alterne entre 1 et 10
  if (ligne == 10) {
    ligne = 1;
  } else {
    ligne++;
  }
}
let hist_section = document.getElementById("hist_section");
hist_section.addEventListener("click", (e) => {
  let elementClique = e.target;
  let id = elementClique.id;
  let element = document.getElementById(id);
  output.textContent = element.textContent.split("=")[1];
});
// Fonction de calcul centralisée
board.addEventListener("click", (event) => {
  let elementClique = event.target;
  if (elementClique.id == "btns") return;

  let bouton = elementClique.closest("button"); // Trouve le bouton parent
  if (!bouton) return; // Si on clique hors d'un bouton, on stoppe
  let id = bouton.id;

  let valeurActuelle = parseFloat(output.textContent);

  switch (id) {
    case "sqrt(x)":
      if (isNaN(valeurActuelle)) return;
      if (valeurActuelle < 0) {
        output.textContent = "Erreur";
      } else {
        let resSqrt = Number(Math.sqrt(valeurActuelle).toFixed(6));
        put(`sqrt(${valeurActuelle}) = ${resSqrt}`);
        output.textContent = resSqrt;
      }
      break;

    case "(":
      if (output.textContent.at(-1) === "(") return;
      if (output.textContent === "0") {
        output.textContent = "(";
      } else {
        output.textContent += "(";
      }
      break;

    case ")":
      if (output.textContent.at(-1) === ")") return;
      output.textContent += ")";
      break;

    case "1/x":
      if (isNaN(valeurActuelle)) return;
      if (valeurActuelle === 0) {
        output.textContent = "Erreur";
      } else {
        let resInverse = Number((1 / valeurActuelle).toFixed(6));
        put(`1/(${valeurActuelle}) = ${resInverse}`);
        output.textContent = resInverse;
      }
      break;

    case "|x|":
      if (isNaN(valeurActuelle)) return;
      let resAbs = Math.abs(valeurActuelle);
      put(`abs(${valeurActuelle}) = ${resAbs}`);
      output.textContent = resAbs;
      break;

    case "ln":
      if (isNaN(valeurActuelle)) return;
      if (valeurActuelle <= 0) {
        output.textContent = "Erreur";
      } else {
        let resLn = Number(Math.log(valeurActuelle).toFixed(6));
        put(`ln(${valeurActuelle}) = ${resLn}`);
        output.textContent = resLn;
      }
      break;

    case "log":
      if (isNaN(valeurActuelle)) return;
      if (valeurActuelle <= 0) {
        output.textContent = "Erreur";
      } else {
        let resLog = Number(Math.log10(valeurActuelle).toFixed(6));
        put(`log(${valeurActuelle}) = ${resLog}`);
        output.textContent = resLog;
      }
      break;

    case "10^x":
      if (isNaN(valeurActuelle)) return;
      let res10x = Number(Math.pow(10, valeurActuelle).toFixed(6));
      put(`10^(${valeurActuelle}) = ${res10x}`);
      output.textContent = res10x;
      break;

    case "x²":
      if (isNaN(valeurActuelle)) return;
      let resCarre = Number(Math.pow(valeurActuelle, 2).toFixed(6));
      put(`${valeurActuelle}² = ${resCarre}`);
      output.textContent = resCarre;
      break;

    case "n!":
      if (
        isNaN(valeurActuelle) ||
        valeurActuelle < 0 ||
        !Number.isInteger(valeurActuelle)
      ) {
        output.textContent = "Erreur";
      } else {
        let f = 1;
        for (let i = 1; i <= valeurActuelle; i++) f *= i;
        put(`${valeurActuelle}! = ${f}`);
        output.textContent = f;
      }
      break;

    case "+/-":
      if (isNaN(valeurActuelle)) return;
      output.textContent = valeurActuelle * -1;
      break;

    case "pi":
      output.textContent =
        output.textContent === "0"
          ? Math.PI.toFixed(6)
          : output.textContent + Math.PI.toFixed(6);
      break;

    case "e":
      output.textContent =
        output.textContent === "0"
          ? Math.E.toFixed(6)
          : output.textContent + Math.E.toFixed(6);
      break;

    case "=":
      let expressionInitiale = output.textContent; // Sauvegarde de l'affichage
      expression = expressionInitiale;
      expression = expression
        .replace(/x/g, "*")
        .replace(/\^/g, "**")
        .replace(/sqrt/g, "Math.sqrt")
        .replace(/pi/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/log/g, "Math.log10")
        .replace(/ln/g, "Math.log")
        .replace(/ mod /g, "%");
      try {
        let resultat = new Function(`return ${expression}`)();
        let resultatFormate = Number(resultat.toFixed(6));

        output.textContent = resultatFormate;

        // AJOUT : Stocke l'expression dans la section historique
        put(`${expressionInitiale} = ${resultatFormate}`);
      } catch {
        output.textContent = "Erreur";
      }
      break;

    case "CE":
      output.textContent = "0";
      break;

    case "suppr":
      let texteActuel = output.textContent;
      output.textContent = texteActuel.slice(0, -1) || "0";
      break;

    case "x^y":
      output.textContent += "^";
      break;

    case "mod":
      output.textContent += " mod ";
      break;

    case "exp":
      output.textContent += "*10^";
      break;

    case "MC":
      memoire = 0;
      break;
    case "MR":
      output.textContent = memoire;
      break;
    case "M+":
      if (!isNaN(valeurActuelle)) memoire += valeurActuelle;
      break;
    case "M-":
      if (!isNaN(valeurActuelle)) memoire -= valeurActuelle;
      break;
    case "MS":
      if (!isNaN(valeurActuelle)) memoire = valeurActuelle;
      output.textContent = "0";
      break;

    default:
      if (output.textContent === "0" && id !== ".") {
        output.textContent = id;
      } else {
        output.textContent += id;
      }
      output.style.textAlign = "end";
      break;
  }
});

document.getElementById("trigo").addEventListener("change", (e) => {
  let valeurActuelle = parseFloat(output.textContent);
  if (isNaN(valeurActuelle)) return;

  let action = e.target.value;
  let resTrigo;

  switch (action) {
    case "sin":
      resTrigo = Number(Math.sin(valeurActuelle).toFixed(6));
      put(`sin(${valeurActuelle}) = ${resTrigo}`);
      output.textContent = resTrigo;
      break;
    case "cos":
      resTrigo = Number(Math.cos(valeurActuelle).toFixed(6));
      put(`cos(${valeurActuelle}) = ${resTrigo}`);
      output.textContent = resTrigo;
      break;
    case "tan":
      resTrigo = Number(Math.tan(valeurActuelle).toFixed(6));
      put(`tan(${valeurActuelle}) = ${resTrigo}`);
      output.textContent = resTrigo;
      break;
    case "sec":
      resTrigo = Number((1 / Math.cos(valeurActuelle)).toFixed(6));
      put(`sec(${valeurActuelle}) = ${resTrigo}`);
      output.textContent = resTrigo;
      break;
    case "csc":
      resTrigo = Number((1 / Math.sin(valeurActuelle)).toFixed(6));
      put(`csc(${valeurActuelle}) = ${resTrigo}`);
      output.textContent = resTrigo;
      break;
    case "cot":
      resTrigo = Number((1 / Math.tan(valeurActuelle)).toFixed(6));
      put(`cot(${valeurActuelle}) = ${resTrigo}`);
      output.textContent = resTrigo;
      break;
  }
  e.target.value = "2nd";
});

document.getElementById("func").addEventListener("change", (e) => {
  let valeurActuelle = parseFloat(output.textContent);
  let action = e.target.value;

  switch (action) {
    case "floor":
      put(`floor(${valeurActuelle}) = ${Math.floor(valeurActuelle)}`);
      output.textContent = Math.floor(valeurActuelle);
      break;
    case "ceil":
      put(`ceil(${valeurActuelle}) = ${Math.ceil(valeurActuelle)}`);
      output.textContent = Math.ceil(valeurActuelle);
      break;
    case "rand":
      let resRand = Number(Math.random().toFixed(6));
      put(`rand() = ${resRand}`);
      output.textContent = resRand;
      break;
  }
  e.target.value = " ";
});
