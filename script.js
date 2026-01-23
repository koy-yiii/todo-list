// --- 1. DÉCLARATION DES VARIABLES ---
const myInput = document.getElementById("Input");
const myDetails = document.getElementById("Details");
const myDateInput = document.getElementById("TaskDate");
const myCategory = document.getElementById("Category");
const myListe = document.getElementById("liste");
const myButton = document.getElementById("case");

// --- 2. CHARGEMENT INITIAL ---
window.addEventListener('load', () => {
    trierEtAfficherTaches();
});

// --- 3. FONCTION DE SAUVEGARDE SÉCURISÉE ---
function sauvegarder() {
    try {
        const toutesLesTaches = [];
        document.querySelectorAll('#liste li').forEach(li => {
            toutesLesTaches.push({
                texte: li.querySelector('.texte-tache').innerText,
                date: li.dataset.date,
                categorie: li.dataset.cat,
                details: li.querySelector('.task-tooltip').innerText,
                termine: li.querySelector('input[type="checkbox"]').checked
            });
        });
        localStorage.setItem("mesTaches", JSON.stringify(toutesLesTaches));
    } catch (e) {
        console.error("Erreur de sauvegarde:", e);
    }
}

// --- 4. TRIER ET RECHARGER LA LISTE ---
function trierEtAfficherTaches() {
    let taches = [];
    
    try {
        const donnees = localStorage.getItem("mesTaches");
        if (donnees && donnees !== "undefined" && donnees !== "null") {
            taches = JSON.parse(donnees);
        }
    } catch (e) {
        console.error("Erreur de lecture:", e);
        // Si les données sont corrompues, on repart à zéro
        localStorage.removeItem("mesTaches");
    }

    // Tri chronologique
    taches.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
    });

    myListe.innerHTML = "";
    taches.forEach(t => {
        creerUneTache(t.texte, t.date, t.categorie, t.details, t.termine);
    });
}

// --- 5. ACTION DU BOUTON AJOUTER ---
myButton.addEventListener('click', () => {
    const texte = myInput.value;
    const details = myDetails.value;
    const date = myDateInput.value;
    const cat = myCategory.value;

    if (texte.trim() !== "") {
        let taches = [];
        
        try {
            const donnees = localStorage.getItem("mesTaches");
            if (donnees && donnees !== "undefined" && donnees !== "null") {
                taches = JSON.parse(donnees);
            }
        } catch (e) {
            console.error("Erreur de lecture:", e);
            taches = [];
        }
        
        taches.push({
            texte: texte,
            date: date,
            categorie: cat,
            details: details,
            termine: false
        });
        
        localStorage.setItem("mesTaches", JSON.stringify(taches));
        trierEtAfficherTaches();

        myInput.value = "";
        myDetails.value = "";
        myDateInput.value = "";
    }
});

// --- 6. CRÉATION D'UNE LIGNE HTML ---
function creerUneTache(texte, dateTache, cat, detailsTache, estCoche = false) {
    const li = document.createElement('li');
    li.dataset.date = dateTache || "";
    li.dataset.cat = cat || "work";
    li.className = "category-" + (cat || "work");

    const aujourdhui = new Date().toISOString().split('T')[0];
    if (dateTache === aujourdhui) {
        li.classList.add('today-task');
    }
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = estCoche;

    // Badge Date
    const badge = document.createElement('span');
    badge.className = "date-badge";
    badge.innerText = dateTache ? new Date(dateTache).toLocaleDateString('fr-FR') : "Pas de date";

    // Texte de la tâche
    const spanTexte = document.createElement('span');
    spanTexte.className = "texte-tache";
    spanTexte.innerText = texte;
    if (estCoche) spanTexte.classList.add('termine');

    // Bulle de détails
    const tooltip = document.createElement('div');
    tooltip.className = "task-tooltip";
    tooltip.innerText = detailsTache || "Aucun détail";

    // Bouton Supprimer
    const btnSuppr = document.createElement('button');
    btnSuppr.innerText = "🗑️";
    btnSuppr.className = "del-btn";
    btnSuppr.addEventListener('click', () => {
        li.remove();
        sauvegarder();
    });

    // Événement checkbox
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            spanTexte.classList.add('termine');
        } else {
            spanTexte.classList.remove('termine');
        }
        sauvegarder();
    });

    // Assemblage
    li.appendChild(checkbox);
    li.appendChild(badge);
    li.appendChild(spanTexte);
    li.appendChild(tooltip);
    li.appendChild(btnSuppr);
    
    myListe.appendChild(li);
}