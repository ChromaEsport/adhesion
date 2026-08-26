import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
getAuth,
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
getFirestore,
doc,
collection, 
getDocs, 
query, 
where,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

const db =
getFirestore(
app
);

/*
ÉLÉMENTS HTML

*/

const chargementAG =
document.getElementById(
"chargementAG"
);

const contenuAG =
document.getElementById(
"contenuAG"
);

const titreAG =
document.getElementById(
"titreAG"
);

const statutAG =
document.getElementById(
"statutAG"
);

const dateAGAffichage =
document.getElementById(
"dateAGAffichage"
);

const heureAGAffichage =
document.getElementById(
"heureAGAffichage"
);

const typeAGAffichage =
document.getElementById(
"typeAGAffichage"
);

const modeAGAffichage =
document.getElementById(
"modeAGAffichage"
);

const lieuAGAffichage =
document.getElementById(
"lieuAGAffichage"
);

const lienVisioAGAffichage =
document.getElementById(
"lienVisioAGAffichage"
);

const ligneLieu =
document.getElementById(
"ligneLieu"
);

const ligneVisio =
document.getElementById(
"ligneVisio"
);

const dateConvocationAffichage =
document.getElementById(
"dateConvocationAffichage"
);

const dateOuvertureAffichage =
document.getElementById(
"dateOuvertureAffichage"
);

const dateClotureAffichage =
document.getElementById(
"dateClotureAffichage"
);

const ordreDuJourAffichage =
document.getElementById(
"ordreDuJourAffichage"
);

const modifierAG =
document.getElementById(
"modifierAG"
);

const retourAG =
document.getElementById(
"retourAG"
);

const logout =
document.getElementById(
"logout"
);

const nombreAdherents =
document.getElementById(
"nombreAdherents"
);

const nombreActifs =
document.getElementById(
"nombreActifs"
);

const nombreDestinataires =
document.getElementById(
"nombreDestinataires"
);

const dateConvocationGestion =
document.getElementById(
"dateConvocationGestion"
);

const dateLimitePropositionsGestion =
document.getElementById(
"dateLimitePropositionsGestion"
);

const preparerConvocation =
document.getElementById(
"preparerConvocation"
);

const apercuConvocation =
document.getElementById(
"apercuConvocation"
);

const contenuApercuConvocation =
document.getElementById(
"contenuApercuConvocation"
);

/*
RÉCUPÉRATION DE L'ID DANS L'URL

*/

const parametresURL =
new URLSearchParams(
window.location.search
);

const idAG =
parametresURL.get(
"id"
);

/*
AUTHENTIFICATION

*/

onAuthStateChanged(
auth,
async user => {

    if (!user) {

        window.location.href =
            "index.html";

        return;
        
    }
    
await chargerDestinatairesConvocation();

    if (!idAG) {

        afficherErreur(
            "Aucune assemblée générale n'a été indiquée."
        );

        return;

    }


    await chargerAG();

}

);

/*
CHARGER L'AG

*/

async function chargerAG() {

try {

    const referenceAG =
        doc(
            db,
            "assemblees_generales",
            idAG
        );


    const resultat =
        await getDoc(
            referenceAG
        );


    if (!resultat.exists()) {

        afficherErreur(
            "Cette assemblée générale n'existe pas."
        );

        return;

    }


    const ag =
        resultat.data();


    console.log(
        "Assemblée générale chargée :",
        ag
    );


    afficherAG(
        ag
    );

}
catch (
    error
) {

    console.error(
        "Erreur chargement AG :",
        error
    );


    afficherErreur(
        "Impossible de charger l'assemblée générale."
    );

}

}

/*
AFFICHER L'AG

*/

function afficherAG(
ag
) {

/*
-----------------------------------------
TITRE
-----------------------------------------
*/

titreAG.textContent =
    ag.type === "AGE"
        ? "Assemblée Générale Extraordinaire"
        : "Assemblée Générale Ordinaire";


/*
-----------------------------------------
STATUT
-----------------------------------------
*/

statutAG.textContent =
    ag.statut || "—";


/*
-----------------------------------------
DATE
-----------------------------------------
*/

dateAGAffichage.textContent =
    formaterDateSimple(
        ag.dateAG
    );


/*
-----------------------------------------
HEURE
-----------------------------------------
*/

heureAGAffichage.textContent =
    ag.heureAG || "—";


/*
-----------------------------------------
TYPE
-----------------------------------------
*/

typeAGAffichage.textContent =
    ag.type === "AGE"
        ? "Assemblée Générale Extraordinaire"
        : "Assemblée Générale Ordinaire";


/*
-----------------------------------------
MODE
-----------------------------------------
*/

if (
    ag.mode === "presentiel"
) {

    modeAGAffichage.textContent =
        "Présentiel";

}

else if (
    ag.mode === "visio"
) {

    modeAGAffichage.textContent =
        "Visioconférence";

}

else if (
    ag.mode === "hybride"
) {

    modeAGAffichage.textContent =
        "Présentiel + visioconférence";

}

else {

    modeAGAffichage.textContent =
        ag.mode || "—";

}


/*
-----------------------------------------
LIEU
-----------------------------------------
*/

if (
    ag.lieu
) {

    ligneLieu.style.display =
        "";

    lieuAGAffichage.textContent =
        ag.lieu;

}
else {

    ligneLieu.style.display =
        "none";

}


/*
-----------------------------------------
VISIO
-----------------------------------------
*/

if (
    ag.lienVisio
) {

    ligneVisio.style.display =
        "";

    lienVisioAGAffichage.innerHTML =
        `<a
            href="${ag.lienVisio}"
            target="_blank"
            rel="noopener noreferrer"
        >
            Ouvrir la visioconférence
        </a>`;

}
else {

    ligneVisio.style.display =
        "none";

}


/*
-----------------------------------------
CALENDRIER
-----------------------------------------
*/

dateConvocationAffichage.textContent =
    formaterDateISO(
        ag.dateConvocation
    );


dateOuvertureAffichage.textContent =
    formaterDateISO(
        ag.dateOuverturePropositions
    );


dateClotureAffichage.textContent =
    formaterDateISO(
        ag.dateCloturePropositions
    );


/*
-----------------------------------------
ORDRE DU JOUR
-----------------------------------------
*/

afficherOrdreDuJour(
    ag.ordreDuJour
);


/*
-----------------------------------------
AFFICHAGE PAGE
-----------------------------------------
*/

chargementAG.style.display =
    "none";


contenuAG.style.display =
    "";

}

/*
ORDRE DU JOUR

*/

function afficherOrdreDuJour(
ordreDuJour
) {

ordreDuJourAffichage.innerHTML =
    "";


if (
    !Array.isArray(
        ordreDuJour
    )
    ||
    ordreDuJour.length === 0
) {

    ordreDuJourAffichage.innerHTML =
        "<p>Aucun sujet enregistré.</p>";

    return;

}


ordreDuJour.forEach(
    (sujet, index) => {

        const bloc =
            document.createElement(
                "div"
            );


        bloc.className =
            "ordre-du-jour-item";


        const numero =
            sujet.numero ||
            index + 1;


        bloc.innerHTML = `

            <h4>
                ${numero}. ${echapperHTML(
                    sujet.titre || "Sans titre"
                )}
            </h4>


            ${
                sujet.description
                    ? `
                        <p>
                            ${echapperHTML(
                                sujet.description
                            )}
                        </p>
                    `
                    : ""
            }

        `;


        ordreDuJourAffichage.appendChild(
            bloc
        );

    }
);

}

/*
ÉCHAPPER LE HTML

*/

function echapperHTML(
texte
) {

return String(
    texte
)
.replaceAll(
    "&",
    "&amp;"
)
.replaceAll(
    "<",
    "&lt;"
)
.replaceAll(
    ">",
    "&gt;"
)
.replaceAll(
    '"',
    "&quot;"
)
.replaceAll(
    "'",
    "&#039;"
);

}

/*
FORMAT DATE YYYY-MM-DD

*/

function formaterDateSimple(
date
) {

if (!date) {

    return "—";

}


const morceaux =
    date.split(
        "-"
    );


if (
    morceaux.length !== 3
) {

    return date;

}


return (
    morceaux[2] +
    "/" +
    morceaux[1] +
    "/" +
    morceaux[0]
);

}

/*
FORMAT DATE ISO

*/

function formaterDateISO(
date
) {

if (!date) {

    return "—";

}


const dateObjet =
    new Date(
        date
    );


if (
    isNaN(
        dateObjet.getTime()
    )
) {

    return "—";

}


return dateObjet.toLocaleDateString(
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
ERREUR

*/

function afficherErreur(
message
) {

chargementAG.textContent =
    message;

}

/*
MODIFIER

*/

modifierAG.addEventListener(
"click",
() => {

    window.location.href =
        "assemblee-generale.html?id=" +
        idAG;

}

);

/*
RETOUR

*/

retourAG.addEventListener(
"click",
() => {

    window.history.back();

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
CHARGER LES DESTINATAIRES DE LA CONVOCATION

*/

async function chargerDestinatairesConvocation() {

try {

    /*
    =========================================
    MEMBRES ADHÉRENTS
    =========================================
    */

    const requeteAdherents =
        query(
            collection(
                db,
                "membres"
            ),
            where(
                "statutMembre",
                "==",
                "adherent"
            )
        );


    const resultatAdherents =
        await getDocs(
            requeteAdherents
        );


    /*
    =========================================
    MEMBRES ACTIFS
    =========================================
    */

    const requeteActifs =
        query(
            collection(
                db,
                "membres"
            ),
            where(
                "statutMembre",
                "==",
                "actif"
            )
        );


    const resultatActifs =
        await getDocs(
            requeteActifs
        );


    /*
    =========================================
    TABLEAU DES DESTINATAIRES
    =========================================
    */

    const destinataires =
        new Map();


    /*
    =========================================
    AJOUT DES ADHÉRENTS
    =========================================
    */

    resultatAdherents.forEach(
        documentFirestore => {

            const membre =
                documentFirestore.data();


            destinataires.set(
                documentFirestore.id,
                {
                    id:
                        documentFirestore.id,

                    ...membre
                }
            );

        }
    );


    /*
    =========================================
    AJOUT DES ACTIFS
    =========================================
    */

    resultatActifs.forEach(
        documentFirestore => {

            const membre =
                documentFirestore.data();


            destinataires.set(
                documentFirestore.id,
                {
                    id:
                        documentFirestore.id,

                    ...membre
                }
            );

        }
    );


    /*
    =========================================
    COMPTAGE
    =========================================
    */

    const totalAdherents =
        resultatAdherents.size;


    const totalActifs =
        resultatActifs.size;


    const totalDestinataires =
        destinataires.size;


    /*
    =========================================
    AFFICHAGE
    =========================================
    */

    if (
        nombreAdherents
    ) {

        nombreAdherents.textContent =
            totalAdherents;

    }


    if (
        nombreActifs
    ) {

        nombreActifs.textContent =
            totalActifs;

    }


    if (
        nombreDestinataires
    ) {

        nombreDestinataires.textContent =
            totalDestinataires;

    }


    /*
    =========================================
    CONSOLE
    =========================================
    */

    console.log(
        "Destinataires de la convocation :",
        {
            adherents:
                totalAdherents,

            actifs:
                totalActifs,

            total:
                totalDestinataires
        }
    );


    return Array.from(
        destinataires.values()
    );

}
catch (
    error
) {

    console.error(
        "Erreur chargement destinataires :",
        error
    );


    if (
        nombreAdherents
    ) {

        nombreAdherents.textContent =
            "Erreur";

    }


    if (
        nombreActifs
    ) {

        nombreActifs.textContent =
            "Erreur";

    }


    if (
        nombreDestinataires
    ) {

        nombreDestinataires.textContent =
            "Erreur";

    }


    return [];

}

}
