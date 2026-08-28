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
getDoc,
updateDoc
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

const envoyerConvocations = 
document.getElementById( 
"envoyerConvocations" 
);

const apercuConvocation =
document.getElementById(
"apercuConvocation"
);

const contenuApercuConvocation =
document.getElementById(
"contenuApercuConvocation"
);

const enregistrerDatesConvocation = 
document.getElementById( 
"enregistrerDatesConvocation"
);

const listeDestinatairesConvocation = 
document.getElementById( 
"listeDestinatairesConvocation" 
);

enregistrerDatesConvocation.addEventListener( 
"click", sauvegarderDatesConvocation 
);

preparerConvocation.addEventListener( 
"click", preparerApercuConvocation 
);

envoyerConvocations.addEventListener( 
"click", confirmerEnvoiConvocations 
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

if (!idAG) {
    console.error(
        "Aucun identifiant d'Assemblée Générale fourni."
    );
}

let agActuelle = null;

let destinatairesConvocation = [];
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

/*
CALCUL DES DATES DE CONVOCATION

*/

calculerDatesConvocationGestion();

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

/*
STOCKER L'AG ACTUELLE

*/

agActuelle = {

id:
    resultat.id,

...ag

};

console.log(
"Assemblée générale chargée :",
agActuelle
);

afficherAG(
ag
)

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


/*
=========================================
FIRESTORE TIMESTAMP
=========================================
*/

if (
    typeof date.toDate ===
    "function"
) {

    date =
        date.toDate();

}


/*
=========================================
OBJET DATE JAVASCRIPT
=========================================
*/

if (
    date instanceof Date
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
=========================================
CHAÎNE YYYY-MM-DD
=========================================
*/

if (
    typeof date ===
    "string"
) {

    const morceaux =
        date.split("-");


    if (
        morceaux.length ===
        3
    ) {

        return (
            morceaux[2] +
            "/" +
            morceaux[1] +
            "/" +
            morceaux[0]
        );

    }


    /*
    Si ce n'est pas YYYY-MM-DD,
    on essaie quand même de
    convertir la date.
    */

    const dateConvertie =
        new Date(
            date
        );


    if (
        !isNaN(
            dateConvertie.getTime()
        )
    ) {

        return dateConvertie.toLocaleDateString(
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

}


/*
=========================================
AUTRE FORMAT INCONNU
=========================================
*/

return "—";

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
CALCUL DES DATES DE CONVOCATION

*/

function calculerDatesConvocationGestion() {

if (
    !agActuelle ||
    !agActuelle.dateAG
) {

    if (
        dateConvocationGestion
    ) {

        dateConvocationGestion.textContent =
            "—";

    }

    if (
        dateLimitePropositionsGestion
    ) {

        dateLimitePropositionsGestion.textContent =
            "—";

    }

    return;

}


/*
=========================================
DATE DE L'AG
=========================================
*/

let dateAG;

/*
TIMESTAMP FIRESTORE

*/

if (
typeof agActuelle.dateAG.toDate ===
"function"
) {

dateAG =
    agActuelle.dateAG.toDate();

}

/*
DATE JAVASCRIPT

*/

else if (
agActuelle.dateAG instanceof Date
) {

dateAG =
    new Date(
        agActuelle.dateAG
    );

}

/*
CHAÎNE DE CARACTÈRES

*/

else {

dateAG =
    new Date(
        agActuelle.dateAG +
        "T00:00:00"
    );

}

/*
VÉRIFICATION

*/

if (
isNaN(
dateAG.getTime()
)
) {

console.error(
    "Date AG invalide :",
    agActuelle.dateAG
);

return;

}


/*
=========================================
CONVOCATION
AG - 15 JOURS
=========================================
*/

const dateConvocation =
    new Date(
        dateAG
    );


dateConvocation.setDate(
    dateConvocation.getDate() -
    15
);


/*
=========================================
FIN DES PROPOSITIONS
CONVOCATION + 7 JOURS
=========================================
*/

const dateLimite =
    new Date(
        dateConvocation
    );


dateLimite.setDate(
    dateLimite.getDate() +
    7
);


/*
=========================================
AFFICHAGE
=========================================
*/

if (
    dateConvocationGestion
) {

    dateConvocationGestion.textContent =
        formaterDateSimple(
            dateConvocation
        );

}


if (
    dateLimitePropositionsGestion
) {

    dateLimitePropositionsGestion.textContent =
        formaterDateSimple(
            dateLimite
        );

}


console.log(
    "Dates convocation AG :",
    {
        dateAG:
            formaterDateSimple(
                dateAG
            ),

        convocation:
            formaterDateSimple(
                dateConvocation
            ),

        cloturePropositions:
            formaterDateSimple(
                dateLimite
            )
    }
);

}


/*
ENREGISTRER LES DATES DE CONVOCATION

*/

async function sauvegarderDatesConvocation() {

if (!agActuelle) {

    alert(
        "Aucune assemblée générale n'est chargée."
    );

    return;

}


if (!agActuelle.dateAG) {

    alert(
        "La date de l'assemblée générale est manquante."
    );

    return;

}


/*
=========================================
CONVERSION DE LA DATE DE L'AG
=========================================
*/

let dateAG;


if (
    typeof agActuelle.dateAG.toDate ===
    "function"
) {

    dateAG =
        agActuelle.dateAG.toDate();

}

else if (
    agActuelle.dateAG instanceof Date
) {

    dateAG =
        new Date(
            agActuelle.dateAG
        );

}

else {

    dateAG =
        new Date(
            agActuelle.dateAG +
            "T00:00:00"
        );

}


if (
    isNaN(
        dateAG.getTime()
    )
) {

    alert(
        "La date de l'assemblée générale est invalide."
    );

    return;

}


/*
=========================================
DATE CONVOCATION
AG - 15 JOURS
=========================================
*/

const dateConvocation =
    new Date(
        dateAG
    );


dateConvocation.setDate(
    dateConvocation.getDate() -
    15
);


/*
=========================================
OUVERTURE PROPOSITIONS
=========================================
*/

const dateOuverturePropositions =
    new Date(
        dateConvocation
    );


/*
=========================================
CLÔTURE PROPOSITIONS
CONVOCATION + 7 JOURS
=========================================
*/

const dateCloturePropositions =
    new Date(
        dateConvocation
    );


dateCloturePropositions.setDate(
    dateCloturePropositions.getDate() +
    7
);


/*
=========================================
ENREGISTREMENT FIRESTORE
=========================================
*/

try {

    await updateDoc(
        doc(
            db,
            "assemblees_generales",
            agActuelle.id
        ),
        {

            dateConvocation:
                dateConvocation,

            dateOuverturePropositions:
                dateOuverturePropositions,

            dateCloturePropositions:
                dateCloturePropositions,

            statutConvocation:
                "a_preparer"

        }
    );


    /*
    =========================================
    MISE À JOUR LOCALE
    =========================================
    */

    agActuelle.dateConvocation =
        dateConvocation;

    agActuelle.dateOuverturePropositions =
        dateOuverturePropositions;

    agActuelle.dateCloturePropositions =
        dateCloturePropositions;

    agActuelle.statutConvocation =
        "a_preparer";


    /*
    =========================================
    ACTUALISER L'AFFICHAGE
    =========================================
    */

    calculerDatesConvocationGestion();


    alert(
        "Les dates de convocation ont été enregistrées."
    );


    console.log(
        "Dates de convocation enregistrées :",
        {
            dateConvocation,
            dateOuverturePropositions,
            dateCloturePropositions
        }
    );

}
catch (
    error
) {

    console.error(
        "Erreur enregistrement dates convocation :",
        error
    );


    alert(
        "Impossible d'enregistrer les dates de convocation."
    );

}

}

/*
PRÉPARER L'APERÇU DE LA CONVOCATION

*/

function preparerApercuConvocation() {

if (!agActuelle) {

    alert(
        "Aucune assemblée générale n'est chargée."
    );

    return;

}


/*
=========================================
INFORMATIONS GÉNÉRALES
=========================================
*/

const type =
    agActuelle.type ||
    "Assemblée Générale";


const date =
    formaterDateSimple(
        agActuelle.dateAG
    );


const heure =
    agActuelle.heureAG ||
    "—";


/*
=========================================
MODE
=========================================
*/

let informationsParticipation =
    "";


if (
    agActuelle.modeAG ===
    "presentiel"
) {

    informationsParticipation = `

        <p>

            <strong>
                📍 Lieu :
            </strong>

            ${agActuelle.lieuAG || "—"}

        </p>

    `;

}

else if (
    agActuelle.modeAG ===
    "visio"
) {

    informationsParticipation = `

        <p>

            <strong>
                💻 Participation :
            </strong>

            En visioconférence

        </p>

    `;

}

else if (
    agActuelle.modeAG ===
    "hybride"
) {

    informationsParticipation = `

        <p>

            <strong>
                📍 Lieu :
            </strong>

            ${agActuelle.lieuAG || "—"}

        </p>


        <p>

            <strong>
                💻 Visioconférence :
            </strong>

            Disponible

        </p>

    `;

}


/*
=========================================
DATE LIMITE PROPOSITIONS
=========================================
*/

const dateLimite =
    agActuelle.dateCloturePropositions
        ? formaterDateSimple(
            agActuelle.dateCloturePropositions
        )
        : "—";


/*
=========================================
ORDRE DU JOUR
=========================================
*/

let ordreDuJourHTML =
    "<p>Aucun sujet défini.</p>";


if (
    Array.isArray(
        agActuelle.ordreDuJour
    )
    &&
    agActuelle.ordreDuJour.length > 0
) {

    ordreDuJourHTML =
        "<ol>";


    agActuelle.ordreDuJour.forEach(
        sujet => {

            /*
            Si ton objet possède
            titre + description
            */

            if (
                typeof sujet ===
                "object"
            ) {

                ordreDuJourHTML += `

                    <li>

                        <strong>
                            ${sujet.titre || ""}
                        </strong>

                        ${
                            sujet.description
                                ? `
                                    <br>
                                    <span>
                                        ${sujet.description}
                                    </span>
                                  `
                                : ""
                        }

                    </li>

                `;

            }

            else {

                ordreDuJourHTML += `

                    <li>
                        ${sujet}
                    </li>

                `;

            }

        }
    );


    ordreDuJourHTML +=
        "</ol>";

}


/*
=========================================
CONSTRUCTION DE L'APERÇU
=========================================
*/

contenuApercuConvocation.innerHTML = `

    <div class="convocation-apercu">

        <h3>
            📢 {Prénom Nom}, vous êtes invité(e) à participer à l'Assemblée Générale de Chroma Esport
        </h3>


        <p>
            Bonjour {Prénom Nom},
        </p>


        <p>

           Vous êtes invité(e) à participer à l'Assemblée Générale de 
            <strong>
                Chroma Esport
            </strong>.

        </p>


        <p>

            <strong>📢 Informations concernant l'Assemblée Générale </strong>



Nous avons le plaisir de vous convier à l'Assemblée Générale de Chroma Esport, qui se tiendra le ${date} à ${heure}, en ${modeAGAffichage}.

{si le parametre lieu }

La réunion se déroulera à l'adresse suivante : ${lieuAGAffichage}.

{si le parametre visio}

Pour participer à distance, vous pourrez rejoindre la visioconférence en utilisant le lien suivant :

${lienVisioAGAffichage}



        </p>


        <p>

            <strong>
                📅 Date :
            </strong>

            ${date}

        </p>


        <p>

            <strong>
                🕐 Heure :
            </strong>

            ${heure}

        </p>


        ${informationsParticipation}


        <h4>
            📋 Ordre du jour
        </h4>


        ${ordreDuJourHTML}


        <h4>
            💡 Propositions de sujets
        </h4>


        <p>

            Les membres adhérents et les membres actifs
            disposent d'un délai de <strong>7 jours</strong>
            à compter de l'envoi de la convocation
            pour proposer l'ajout d'un sujet à l'ordre du jour.

        </p>


        <p>

            La date limite pour transmettre une proposition
            est fixée au :

            <strong>
                ${dateLimite}
            </strong>.

        </p>


        <h4>
            🗳️ Droit de vote
        </h4>


        <p>

            Seuls les <strong>membres actifs</strong>
            disposent du droit de vote lors de
            l'Assemblée Générale, dans les conditions
            prévues par les statuts de Chroma Esport.

        </p>


        <p>
            Cordialement,<br>
            <strong>
                Chroma Esport
            </strong>
        </p>

    </div>

`;


/*
=========================================
AFFICHER L'APERÇU
=========================================
*/

apercuConvocation.style.display =
    "";

envoyerConvocations.disabled = false;
/*
=========================================
FAIRE DÉFILER VERS L'APERÇU
=========================================
*/

apercuConvocation.scrollIntoView({
    behavior:
        "smooth"
});

}

/*
CHARGER LES DESTINATAIRES DE LA CONVOCATION

*/

async function chargerDestinatairesConvocation() {

    try {

        const resultat =
            await getDocs(
                collection(
                    db,
                    "membres"
                )
            );


        destinatairesConvocation = [];

        let totalAdherents = 0;

        let totalActifs = 0;


        /*
        =========================================
        MEMBRES ADHÉRENTS ET ACTIFS UNIQUEMENT
        =========================================
        */

        resultat.forEach(
            documentFirestore => {

                const membre = {

                    id:
                        documentFirestore.id,

                    ...documentFirestore.data()

                };
                 if (
                     membre.statutAdhesion ===
                     "expiree"
                ) {

                console.log(
                "Membre exclu de la convocation car adhésion expirée :",
                membre.email
                 );

               return;

                }

                /*
                -----------------------------------------
                MEMBRE ADHÉRENT
                -----------------------------------------
                */

                if (
                    membre.statutMembre ===
                    "adherent"
                ) {

                    destinatairesConvocation.push(
    membre
);

                    totalAdherents++;

                }


                /*
                -----------------------------------------
                MEMBRE ACTIF
                -----------------------------------------
                */

                else if (
                    membre.statutMembre ===
                    "actif"
                ) {

                    destinatairesConvocation.push(
    membre
);

                    totalActifs++;

                }

            }
        );


        /*
        =========================================
        TOTAL DES DESTINATAIRES
        =========================================
        */

        const totalDestinataires =
    destinatairesConvocation.length;


        /*
        =========================================
        MISE À JOUR DES COMPTEURS
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


        /*
        =========================================
        AFFICHAGE DE LA LISTE
        =========================================
        */

        afficherDestinatairesConvocation(
    destinatairesConvocation
);


        return destinatairesConvocation;

    }
    catch (
        error
    ) {

        console.error(
            "Erreur récupération destinataires :",
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


        afficherErreur(
            "Impossible de récupérer les destinataires de la convocation."
        );


        return [];

    }

}

/*
AFFICHER LES DESTINATAIRES

*/

function afficherDestinatairesConvocation(
    destinataires
) {

    if (
        !listeDestinatairesConvocation
    ) {

        return;

    }


    listeDestinatairesConvocation.innerHTML =
        "";


    /*
    =========================================
    AUCUN DESTINATAIRE
    =========================================
    */

    if (
        destinataires.length ===
        0
    ) {

        listeDestinatairesConvocation.innerHTML = `

            <p class="message-info">

                Aucun membre adhérent ou actif
                n'a été trouvé.

            </p>

        `;

        return;

    }


    /*
    =========================================
    COMPTEUR
    =========================================
    */

    const titre =
        document.createElement(
            "p"
        );


    titre.innerHTML = `

        <strong>
            ${destinataires.length}
        </strong>

        membre(s) recevront la convocation.

    `;


    listeDestinatairesConvocation.appendChild(
        titre
    );


    /*
    =========================================
    LISTE
    =========================================
    */

    destinataires.forEach(
        membre => {

            const ligne =
                document.createElement(
                    "div"
                );


            ligne.className =
                "destinataire-convocation";


            const nom =
                `${
                    membre.prenom || ""
                } ${
                    membre.nom || ""
                }`.trim();


            const statut =
                membre.statutMembre ===
                "actif"
                    ? "Membre actif"
                    : "Membre adhérent";


            ligne.innerHTML = `

                <span>

                    👤
                    ${nom || "Nom inconnu"}

                </span>


                <span>

                    ${membre.email || "⚠️ Aucun email"}

                </span>


                <span>

                    ${statut}

                </span>

            `;


            listeDestinatairesConvocation.appendChild(
                ligne
            );

        }
    );

}

/*
CONFIRMATION ET PRÉPARATION DE L'ENVOI

*/

async function confirmerEnvoiConvocations() { 

if (!agActuelle) {

    alert(
        "Aucune assemblée générale n'est chargée."
    );

    return;

}


const nombre =
    nombreDestinataires
        ? nombreDestinataires.textContent
        : "0";


const confirmation =
    confirm(

        "⚠️ ENVOI DES CONVOCATIONS\n\n" +

        "Vous êtes sur le point d'envoyer " +
        "la convocation à " +
        nombre +
        " membre(s).\n\n" +

        "Les membres adhérents et les membres actifs " +
        "recevront la convocation par email.\n\n" +

        "Voulez-vous continuer ?"

    );


if (!confirmation) {

    return;

}


/*
=========================================
DONNÉES DE L'AG
=========================================
*/

const donneesConvocation = {

    agId:
        agActuelle.id,

    type:
        agActuelle.type || "",

    dateAG:
        agActuelle.dateAG || "",

    heureAG:
        agActuelle.heureAG || "",

    mode:
        agActuelle.mode || "",

    lieu:
        agActuelle.lieu || "",

    lienVisio:
        agActuelle.lienVisio || "",

    ordreDuJour:
        agActuelle.ordreDuJour || [],

    dateConvocation:
        agActuelle.dateConvocation || "",

    dateOuverturePropositions:
        agActuelle.dateOuverturePropositions || "",

    dateCloturePropositions:
        agActuelle.dateCloturePropositions || ""

};


/*
=========================================
VÉRIFICATION
=========================================
*/

console.log(
    "Données de la convocation prêtes :",
    donneesConvocation
);

console.log(
    "================================="
);

console.log(
    "ÉTAPE 7.25 — DONNÉES CONVOCATION"
);

console.log(
    "================================="
);

console.log(
    "AG ID :",
    donneesConvocation.agId
);

console.log(
    "Type :",
    donneesConvocation.type
);

console.log(
    "Date AG :",
    donneesConvocation.dateAG
);

console.log(
    "Nombre de destinataires :",
    nombreDestinataires
        ? nombreDestinataires.textContent
        : "0"
);

console.log(
    "Destinataires chargés :",
    listeDestinatairesConvocation
        ? listeDestinatairesConvocation.children.length
        : 0
);

console.log(
    "Destinataires actuellement affichés :",
    listeDestinatairesConvocation
);

console.log(
    "Nombre de destinataires affichés :",
    nombreDestinataires
        ? nombreDestinataires.textContent
        : "0"
);

console.log(
    "================================="
);

console.log(
    "ÉTAPE 7.26 — DONNÉES D'ENVOI"
);

console.log(
    "================================="
);
console.log(
    "Données destinataires vérifiées :",
    destinatairesConvocation
);

console.log(
    "Nombre réel de destinataires :",
    destinatairesConvocation.length
);
const donneesEnvoi = {

    ag:
        donneesConvocation,

    destinataires:
        destinatairesConvocation.map(
            membre => ({

                id:
                    membre.id || "",

                prenom:
                    membre.prenom || "",

                nom:
                    membre.nom || "",

                email:
                    membre.email || "",

                numeroMembre:
                    membre.numeroMembre || "",

                statutMembre:
                    membre.statutMembre || ""

            })
        )

};

console.log(
    "================================="
);

console.log(
    "ÉTAPE 7.30 — DONNÉES FINALES"
);

console.log(
    "================================="
);

console.log(
    "Données préparées pour le Worker :",
    donneesEnvoi
);

console.log(
    "Nombre de destinataires à envoyer :",
    donneesEnvoi.destinataires.length
);
console.log(
    "================================="
);

console.log(
    "ÉTAPE 7.29 — DESTINATAIRES"
);

console.log(
    "================================="
);

console.log(
    "Tableau destinatairesConvocation :",
    destinatairesConvocation
);

console.log(
    "Nombre réel de destinataires :",
    destinatairesConvocation.length
);

destinatairesConvocation.forEach(
    (membre, index) => {

        console.log(
            "Destinataire " +
            (index + 1) +
            ":",
            {
                id:
                    membre.id,

                nom:
                    membre.nom,

                prenom:
                    membre.prenom,

                email:
                    membre.email,

                numeroMembre:
                    membre.numeroMembre,

                statutMembre:
                    membre.statutMembre
            }
        );

    }
);

const urlWorker =
    "https://chroma-stripe.max2501.workers.dev";

console.log(
    "URL du Worker :",
    urlWorker
);

const corpsRequete = {

    type:
        "convocation_ag",

    ag:
        donneesConvocation,

    destinataires:
        donneesEnvoi.destinataires

};

console.log(
    "================================="
);

console.log(
    "ÉTAPE 7.32 — REQUÊTE WORKER"
);

console.log(
    "================================="
);

console.log(
    "Corps de la requête :",
    corpsRequete
);

try {

    const reponseWorker =
        await fetch(
            urlWorker,
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        corpsRequete
                    )
            }
        );

    const resultatWorker =
        await reponseWorker.text();

    console.log(
        "================================="
    );

    console.log(
        "ÉTAPE 7.33 — RÉPONSE DU WORKER"
    );

    console.log(
        "================================="
    );

    console.log(
        "Statut HTTP :",
        reponseWorker.status
    );

    console.log(
        "Réponse Worker :",
        resultatWorker
    );

}
catch (error) {

    console.error(
        "Erreur communication Worker :",
        error
    );

    alert(
        "Impossible de contacter le serveur d'envoi."
    );

    return;

}
    
alert(
    "Les données de la convocation sont prêtes.\n\n" +
    "La prochaine étape consistera à préparer " +
    "l'envoi des emails."
);

}


async function envoyerConvocationsWorker(
    donneesConvocation
) {

    console.log(
        "Préparation de l'envoi des convocations :",
        donneesConvocation
    );
}
