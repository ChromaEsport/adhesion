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
collection, 
addDoc, 
getDocs,
serverTimestamp 
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

const enregistrerAG = 
document.getElementById(
"enregistrerAG" 
);

const listeAssemblees = 
document.getElementById( 
"listeAssemblees" 
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


    await chargerAssemblees();

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

/*
ENREGISTRER LE BROUILLON DE L'AG

*/

async function enregistrerBrouillonAG() {

/*
=========================================
VÉRIFICATION DES CHAMPS OBLIGATOIRES
=========================================
*/

if (
    !dateAG.value ||
    !heureAG.value
) {

    alert(
        "Veuillez renseigner la date et l'heure de l'assemblée générale."
    );

    return;

}


/*
=========================================
RÉCUPÉRATION DE L'ORDRE DU JOUR
=========================================
*/

const ordreDuJour = [];


document
    .querySelectorAll(
        ".ordre-du-jour-item"
    )
    .forEach(
        bloc => {

            const titre =
                bloc.querySelector(
                    ".ordre-du-jour-titre"
                ).value.trim();


            const description =
                bloc.querySelector(
                    ".ordre-du-jour-description"
                ).value.trim();


            /*
            On ajoute uniquement les sujets
            qui possèdent un titre.
            */

            if (
                titre
            ) {

                ordreDuJour.push({

                    titre:
                        titre,

                    description:
                        description,

                    numero:
                        ordreDuJour.length + 1

                });

            }

        }
    );


/*
=========================================
VÉRIFICATION ORDRE DU JOUR
=========================================
*/

if (
    ordreDuJour.length === 0
) {

    alert(
        "Veuillez ajouter au moins un sujet à l'ordre du jour."
    );

    return;

}


/*
=========================================
RÉCUPÉRATION DES DATES
=========================================
*/

const dateAssemblee =
    new Date(
        dateAG.value +
        "T00:00:00"
    );


const dateConvocationCalculee =
    new Date(
        dateAssemblee
    );


dateConvocationCalculee.setDate(
    dateConvocationCalculee.getDate() -
    15
);


const dateClotureCalculee =
    new Date(
        dateConvocationCalculee
    );


dateClotureCalculee.setDate(
    dateClotureCalculee.getDate() +
    7
);


/*
=========================================
DONNÉES DE L'AG
=========================================
*/

const donneesAG = {

    type:
        typeAG.value,

    dateAG:
        dateAG.value,

    heureAG:
        heureAG.value,

    mode:
        modeAG.value,

    lieu:
        lieuAG.value.trim(),

    lienVisio:
        lienVisioAG.value.trim(),

    ordreDuJour:
        ordreDuJour,

    dateConvocation:
        dateConvocationCalculee
            .toISOString(),

    dateOuverturePropositions:
        dateConvocationCalculee
            .toISOString(),

    dateCloturePropositions:
        dateClotureCalculee
            .toISOString(),

    statut:
        "brouillon",

    dateCreation:
        serverTimestamp()

};


/*
=========================================
ENREGISTREMENT FIRESTORE
=========================================
*/

try {

    enregistrerAG.disabled =
        true;


    enregistrerAG.textContent =
        "⏳ Enregistrement...";


    const documentAG =
        await addDoc(
            collection(
                db,
                "assemblees_generales"
            ),
            donneesAG
        );


    console.log(
        "Assemblée générale créée :",
        documentAG.id
    );


    alert(
        "Le brouillon de l'assemblée générale a été enregistré."
    );


    /*
    Redirection vers la page de gestion
    de l'AG créée.
    */

    window.location.href =
        "gestion-assemblee.html?id=" +
        documentAG.id;


}
catch (
    error
) {

    console.error(
        "Erreur lors de l'enregistrement de l'AG :",
        error
    );


    alert(
        "Impossible d'enregistrer l'assemblée générale. Vérifiez la console."
    );


    enregistrerAG.disabled =
        false;


    enregistrerAG.textContent =
        "💾 Enregistrer le brouillon";

}

}

enregistrerAG.addEventListener(
"click",
enregistrerBrouillonAG 
);


/*
CHARGER LES ASSEMBLÉES GÉNÉRALES

*/

async function chargerAssemblees() {

if (!listeAssemblees) {

    return;

}


try {

    const resultat =
        await getDocs(
            collection(
                db,
                "assemblees_generales"
            )
        );


    const assemblees = [];


    resultat.forEach(
        documentFirestore => {

            assemblees.push({

                id:
                    documentFirestore.id,

                ...documentFirestore.data()

            });

        }
    );


    /*
    =========================================
    TRI PAR DATE
    Plus proche / récente en premier
    =========================================
    */

    assemblees.sort(
        (a, b) => {

            const dateA =
                new Date(
                    a.dateAG || "9999-12-31"
                );


            const dateB =
                new Date(
                    b.dateAG || "9999-12-31"
                );


            return dateA - dateB;

        }
    );


    afficherAssemblees(
        assemblees
    );

}
catch (
    error
) {

    console.error(
        "Erreur chargement assemblées générales :",
        error
    );


    listeAssemblees.innerHTML = `

        <tr>

            <td colspan="5">

                Impossible de charger les assemblées générales.

            </td>

        </tr>

    `;

}

}

/*
AFFICHER LES ASSEMBLÉES

*/

function afficherAssemblees(
assemblees
) {

listeAssemblees.innerHTML =
    "";


if (
    assemblees.length === 0
) {

    listeAssemblees.innerHTML = `

        <tr>

            <td colspan="5">

                Aucune assemblée générale créée.

            </td>

        </tr>

    `;

    return;

}


assemblees.forEach(
    ag => {

        const ligne =
            document.createElement(
                "tr"
            );


        const type =
            ag.type === "AGE"
                ? "AGE"
                : "AGO";


        const typeTexte =
            ag.type === "AGE"
                ? "Assemblée Générale Extraordinaire"
                : "Assemblée Générale Ordinaire";


        const statut =
            ag.statut ||
            "—";


        ligne.innerHTML = `

            <td
                title="${typeTexte}"
            >
                ${type}
            </td>


            <td>
                ${formaterDateSimple(
                    ag.dateAG
                )}
            </td>


            <td>
                ${ag.heureAG || "—"}
            </td>


            <td>
                ${statut}
            </td>


            <td>

                <button
                    type="button"
                    class="voir-ag"
                    data-id="${ag.id}"
                >
                    👁️ Gérer
                </button>

            </td>

        `;


        listeAssemblees.appendChild(
            ligne
        );



        /*
        =========================================
        BOUTON GÉRER
        =========================================
        */

        const bouton =
            ligne.querySelector(
                ".voir-ag"
            );


        bouton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "gestion-assemblee.html?id=" +
                    ag.id;

            }
        );

    }
);

}

/*
FORMAT DATE

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
