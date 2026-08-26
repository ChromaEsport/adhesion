import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {

apiKey:
    "AIzaSyAedIKW_LRWLpa9V_t7PcTTbrDmQOj4HAo",

authDomain:
    "chroma-adhesion.firebaseapp.com",

projectId:
    "chroma-adhesion",

storageBucket:
    "chroma-adhesion.firebasestorage.app",

messagingSenderId:
    "892582501197",

appId:
    "1:892582501197:web:2483ffc9c98e47a3d17504"

};

const app =
initializeApp(
firebaseConfig
);

const auth =
getAuth(
app
);

/*
ÉLÉMENTS HTML

*/

const typeAG =
document.getElementById(
"typeAG"
);

const dateAG =
document.getElementById(
"dateAG"
);

const heureAG =
document.getElementById(
"heureAG"
);

const modeAG =
document.getElementById(
"modeAG"
);

const blocLieu =
document.getElementById(
"blocLieu"
);

const blocVisio =
document.getElementById(
"blocVisio"
);

const lieuAG =
document.getElementById(
"lieuAG"
);

const lienVisioAG =
document.getElementById(
"lienVisioAG"
);

const listeOrdreDuJour =
document.getElementById(
"listeOrdreDuJour"
);

const ajouterSujet =
document.getElementById(
"ajouterSujet"
);

const dateConvocation =
document.getElementById(
"dateConvocation"
);

const dateOuverturePropositions =
document.getElementById(
"dateOuverturePropositions"
);

const dateCloturePropositions =
document.getElementById(
"dateCloturePropositions"
);

const logout =
document.getElementById(
"logout"
);

/*
AUTHENTIFICATION

*/

onAuthStateChanged(
auth,
user => {

    if (!user) {

        window.location.href =
            "index.html";

    }

}

);

/*
DÉCONNEXION

*/

logout.addEventListener(
"click",
async () => {

    await signOut(
        auth
    );

    window.location.href =
        "index.html";

}

);

/*
GESTION DU MODE DE PARTICIPATION

*/

function mettreAJourModeAG() {

const mode =
    modeAG.value;


/*
-----------------------------------------
PRÉSENTIEL
-----------------------------------------
*/

if (
    mode ===
    "presentiel"
) {

    blocLieu.style.display =
        "";

    blocVisio.style.display =
        "none";

    lienVisioAG.value =
        "";

}


/*
-----------------------------------------
VISIO
-----------------------------------------
*/

else if (
    mode ===
    "visio"
) {

    blocLieu.style.display =
        "none";

    blocVisio.style.display =
        "";

    lieuAG.value =
        "";

}


/*
-----------------------------------------
HYBRIDE
-----------------------------------------
*/

else if (
    mode ===
    "hybride"
) {

    blocLieu.style.display =
        "";

    blocVisio.style.display =
        "";

}

}

modeAG.addEventListener(
"change",
mettreAJourModeAG
);

/*
CRÉATION D'UN SUJET

*/

function creerSujet() {

const bloc =
    document.createElement(
        "div"
    );


bloc.className =
    "ordre-du-jour-item";


bloc.innerHTML = `

    <input
        type="text"
        class="ordre-du-jour-titre"
        placeholder="Sujet de l'ordre du jour"
    >


    <textarea
        class="ordre-du-jour-description"
        placeholder="Description ou précisions (facultatif)"
    ></textarea>


    <button
        type="button"
        class="supprimer-sujet"
    >
        🗑️ Supprimer
    </button>

`;


listeOrdreDuJour.appendChild(
    bloc
);


ajouterEvenementSuppression(
    bloc
);

}

/*
SUPPRESSION D'UN SUJET

*/

function ajouterEvenementSuppression(
bloc
) {

const bouton =
    bloc.querySelector(
        ".supprimer-sujet"
    );


bouton.addEventListener(
    "click",
    () => {

        /*
        On garde toujours au moins
        un sujet dans le formulaire.
        */

        const nombreSujets =
            document.querySelectorAll(
                ".ordre-du-jour-item"
            ).length;


        if (
            nombreSujets <= 1
        ) {

            alert(
                "L'ordre du jour doit contenir au moins un sujet."
            );

            return;

        }


        bloc.remove();

    }
);

}

/*
INITIALISATION DES BOUTONS SUPPRIMER

*/

document
.querySelectorAll(
".ordre-du-jour-item"
)
.forEach(
bloc => {

        ajouterEvenementSuppression(
            bloc
        );

    }
);
/*
AJOUTER UN SUJET

*/

ajouterSujet.addEventListener(
"click",
() => {

    creerSujet();

}

);

/*
FORMAT DATE

*/

function formaterDate(
date
) {

return date.toLocaleDateString(
    "fr-FR",
    {
        day:
            "2-digit",

        month:
            "2-digit",

        year:
            "numeric"
    }
);

}

/*
CALCUL DES DATES DE L'AG

*/

function calculerDatesAG() {

if (
    !dateAG.value
) {

    dateConvocation.textContent =
        "—";

    dateOuverturePropositions.textContent =
        "—";

    dateCloturePropositions.textContent =
        "—";

    return;

}


/*
-----------------------------------------
DATE DE L'AG
-----------------------------------------
*/

const date =
    new Date(
        dateAG.value +
        "T00:00:00"
    );


/*
-----------------------------------------
CONVOCATION
AG - 15 JOURS
-----------------------------------------
*/

const convocation =
    new Date(
        date
    );


convocation.setDate(
    convocation.getDate() -
    15
);


/*
-----------------------------------------
OUVERTURE PROPOSITIONS
-----------------------------------------
*/

const ouverture =
    new Date(
        convocation
    );


/*
-----------------------------------------
CLÔTURE
CONVOCATION + 7 JOURS
-----------------------------------------
*/

const cloture =
    new Date(
        convocation
    );


cloture.setDate(
    cloture.getDate() +
    7
);


dateConvocation.textContent =
    formaterDate(
        convocation
    );


dateOuverturePropositions.textContent =
    formaterDate(
        ouverture
    );


dateCloturePropositions.textContent =
    formaterDate(
        cloture
    );

}

dateAG.addEventListener(
"change",
calculerDatesAG
);

/*
INITIALISATION

*/

mettreAJourModeAG();

calculerDatesAG();
