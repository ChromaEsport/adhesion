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
    query,
    where,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    Timestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

/* =========================================================
FIREBASE
========================================================= */

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

/* =========================================================
ÉLÉMENTS HTML
========================================================= */

const prenomMembre =
document.getElementById(
"prenomMembre"
);

const prenomInformation =
document.getElementById(
"prenomInformation"
);

const nomMembre =
document.getElementById(
"nomMembre"
);

const emailMembre =
document.getElementById(
"emailMembre"
);

const discordMembre =
document.getElementById(
"discordMembre"
);

const numeroMembre =
document.getElementById(
"numeroMembre"
);

const numeroMembreHeader =
document.getElementById(
"numeroMembreHeader"
);

const statutMembre =
document.getElementById(
"statutMembre"
);

const statutAdhesion =
document.getElementById(
"statutAdhesion"
);

const anneeAdhesion =
document.getElementById(
"anneeAdhesion"
);

const dateDebutAdhesion =
document.getElementById(
"dateDebutAdhesion"
);

const dateFinAdhesion =
document.getElementById(
"dateFinAdhesion"
);

const statutPaiement =
document.getElementById(
"statutPaiement"
);

const cotisation =
document.getElementById(
"cotisation"
);

const numeroCarte =
document.getElementById(
"numeroCarte"
);

const statutCarte =
document.getElementById(
"statutCarte"
);

const logout =
document.getElementById(
"logout"
);

const blocMembreActif =
document.getElementById(
"blocMembreActif"
);

const contenuMembreActif =
document.getElementById(
"contenuMembreActif"
);

const blocAdhesion =
document.getElementById(
"blocAdhesion"
    );

const blocCarteMembre =
document.getElementById(
"blocCarteMembre"
    );

const blocCommunaute =
document.getElementById(
"blocCommunaute"
    );



/* =========================================================
AUTHENTIFICATION
========================================================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "connexion-membre.html";

            return;
        }

        console.log(
            "Utilisateur Firebase connecté :",
            user.uid
        );

        await chargerMembre(
            user.uid
        );
    }
);

/* =========================================================
CHARGER LE MEMBRE
========================================================= */

async function chargerMembre(firebaseUid) {
    try {

        if (!firebaseUid) {
            afficherErreur("Identifiant Firebase introuvable.");
            return;
        }

        /*
        =========================================
        RECHERCHE DANS MEMBRES
        =========================================
        */

        const requete = query(
            collection(db, "membres"),
            where("firebaseUid", "==", firebaseUid)
        );

        const resultat = await getDocs(requete);

        if (!resultat.empty) {

            let membre = null;

            resultat.forEach(documentFirestore => {
                membre = {
                    id: documentFirestore.id,
                    typeCompte: "adherent",
                    ...documentFirestore.data()
                };
            });

            afficherMembre(membre);
            return;
        }

        /*
        =========================================
        RECHERCHE DANS COMMUNAUTE
        =========================================
        */

        const communauteRef = doc(
            db,
            "communaute",
            firebaseUid
        );

        const communauteDoc = await getDoc(communauteRef);

        if (communauteDoc.exists()) {

            const membre = {
                id: communauteDoc.id,
                typeCompte: "communaute",
                ...communauteDoc.data()
            };

            afficherMembre(membre);
            return;
        }

        afficherErreur(
            "Aucun compte associé à cette connexion."
        );

    }

    catch (error) {

        console.error(error);

        afficherErreur(
            "Impossible de charger vos informations."
        );

    }
}

/* =========================================================
AFFICHER LE MEMBRE
========================================================= */

function afficherMembre(membre) {

    /*
    =========================================
    INFORMATIONS COMMUNES
    =========================================
    */

    prenomMembre.textContent =
        membre.prenom || "-";

    prenomInformation.textContent =
        membre.prenom || "-";

    nomMembre.textContent =
        membre.nom || "-";

    emailMembre.textContent =
        membre.email || "-";

    discordMembre.textContent =
        membre.discord || "-";


    /*
    =========================================
    COMPTE COMMUNAUTÉ
    =========================================
    */

    if (membre.typeCompte === "communaute") {

        console.log(
            "Compte Membre Communauté chargé :",
            membre
        );

         /*
    =========================================
    AFFICHAGE COMMUNAUTÉ
    =========================================
    */

    if (blocCommunaute) {
        blocCommunaute.style.display =
            "block";
    }

    if (blocAdhesion) {
        blocAdhesion.style.display =
            "none";
    }

    if (blocCarteMembre) {
        blocCarteMembre.style.display =
            "none";
    }

    if (blocMembreActif) {
        blocMembreActif.style.display =
            "none";
    }
        /*
        -----------------------------------------
        STATUT
        -----------------------------------------
        */

        statutMembre.textContent =
            "💜 Membre Communauté";


        /*
        -----------------------------------------
        PAS DE NUMÉRO CHRO
        -----------------------------------------
        */

        numeroMembre.textContent =
            "Communauté";

        numeroMembreHeader.textContent =
            "💜 COMMUNAUTÉ";


        /*
        -----------------------------------------
        ADHÉSION
        -----------------------------------------
        */

        statutAdhesion.textContent =
            "💜 Inscription gratuite";

        anneeAdhesion.textContent =
            "-";

        dateDebutAdhesion.textContent =
            "-";

        dateFinAdhesion.textContent =
            "-";

        statutPaiement.textContent =
            "💜 Aucun paiement";

        cotisation.textContent =
            "0,00 €";


        /*
        -----------------------------------------
        CARTE MEMBRE
        -----------------------------------------
        */

        numeroCarte.textContent =
            "COMMUNAUTÉ";

        statutCarte.textContent =
            "💜 Membre Communauté";


        /*
        -----------------------------------------
        BLOC MEMBRE ACTIF
        -----------------------------------------
        */

        if (blocMembreActif) {

            blocMembreActif.style.display =
                "none";

        }


        return;
    }


    /*
    =========================================
    MEMBRE ADHÉRENT
    =========================================
    */

    console.log(
        "Compte membre adhérent chargé :",
        membre
    );


    numeroMembre.textContent =
        membre.numeroMembre || "-";

    numeroMembreHeader.textContent =
        membre.numeroMembre || "-";

    statutMembre.textContent =
        traduireStatutMembre(
            membre.statutMembre
        );

    statutAdhesion.textContent =
        traduireStatutAdhesion(
            membre.statutAdhesion
        );

    anneeAdhesion.textContent =
        membre.annee || "-";

    dateDebutAdhesion.textContent =
        afficherDate(
            membre.dateDebutAdhesion
        );

    dateFinAdhesion.textContent =
        afficherDate(
            membre.dateFinAdhesion
        );

    statutPaiement.textContent =
        traduireStatutPaiement(
            membre.statutPaiement
        );

    cotisation.textContent =
        formatEuro(
            membre.cotisation
        );

    numeroCarte.textContent =
        membre.numeroMembre || "-";


    if (membre.carteEnvoyee === true) {

        statutCarte.textContent =
            "🟢 Carte envoyée";

    } else {

        statutCarte.textContent =
            "🔴 Carte non envoyée";

    }


    /*
    =========================================
    ESPACE MEMBRE ACTIF
    =========================================
    */

    afficherEspaceMembreActif(
        membre
    );
}

function afficherEspaceMembreActif(
    membre
) {

    if (
        !blocMembreActif ||
        !contenuMembreActif
    ) {
        return;
    }

    /*
    =========================================
    DÉJÀ MEMBRE ACTIF
    =========================================
    */

    if (
        membre.statutMembre ===
        "actif"
    ) {

        blocMembreActif.style.display =
            "block";

        contenuMembreActif.innerHTML = `

            <div class="message-membre-actif">

                <div class="icone-membre-actif">
                    ⭐
                </div>

                <h4>
                    Vous êtes membre actif
                </h4>

                <p>
                    Votre statut de membre actif
                    est actuellement actif au sein
                    de Chroma Esport.
                </p>

            </div>

        `;

        return;
    }


    /*
    =========================================
    DEMANDE EN ATTENTE
    =========================================
    */

    if (
        membre.statutDemandeMembreActif ===
        "en_attente"
    ) {

        blocMembreActif.style.display =
            "block";

        contenuMembreActif.innerHTML = `

            <div class="message-membre-actif">

                <div class="icone-membre-actif">
                    ⏳
                </div>

                <h4>
                    Demande en cours d'examen
                </h4>

                <p>
                    Votre demande pour devenir
                    membre actif a bien été enregistrée.
                </p>

                <p>
                    L'administration de Chroma Esport
                    doit maintenant examiner votre demande.
                </p>

                <span class="badge-demande-en-attente">
                    ⏳ En attente
                </span>

            </div>

        `;

        return;
    }


/*
=========================================
DEMANDE REFUSÉE
=========================================
*/

if (
    membre.statutDemandeMembreActif ===
    "refusee"
) {

    blocMembreActif.style.display =
        "block";

    const motif =
        membre.motifRefusMembreActif
        ||
        "Aucun motif communiqué.";

    /*
    =========================================
    VÉRIFICATION AUTORISATION ADMIN
    =========================================
    */

    const nouvelleDemandeAutorisee =
        membre.nouvelleDemandeMembreActifAutorisee ===
        true;

    /*
    =========================================
    SI L'ADMIN N'A PAS AUTORISÉ
    =========================================
    */

    if (
        !nouvelleDemandeAutorisee
    ) {

        contenuMembreActif.innerHTML = `
            <div class="message-membre-actif">

                <div class="icone-membre-actif">
                    ❌
                </div>

                <h4>
                    Demande refusée
                </h4>

                <p>
                    Votre précédente demande
                    de passage en membre actif
                    a été refusée.
                </p>

                <div class="motif-refus">

                    <strong>
                        Motif :
                    </strong>

                    <p>
                        ${motif}
                    </p>

                </div>

                <div class="information-demande-actif">

                    <p>
                        🔒 Une nouvelle demande
                        ne peut pas être déposée
                        pour le moment.
                    </p>

                    <p>
                        Si l'administration vous
                        autorise à déposer une nouvelle
                        demande, cette possibilité
                        apparaîtra automatiquement
                        dans votre espace membre.
                    </p>

                </div>

            </div>
        `;

        return;
    }

    /*
    =========================================
    SI L'ADMIN A AUTORISÉ UNE NOUVELLE DEMANDE
    =========================================
    */

    contenuMembreActif.innerHTML = `
        <div class="message-membre-actif">

            <div class="icone-membre-actif">
                ❌
            </div>

            <h4>
                Demande précédente refusée
            </h4>

            <p>
                Votre précédente demande
                de passage en membre actif
                a été refusée.
            </p>

            <div class="motif-refus">

                <strong>
                    Motif :
                </strong>

                <p>
                    ${motif}
                </p>

            </div>

            <div class="information-demande-actif">

                <p>
                    🟢 L'administration vous
                    autorise maintenant à déposer
                    une nouvelle demande.
                </p>

            </div>

            <button
                id="nouvelleDemandeMembreActif"
                type="button"
            >
                ⭐ Déposer une nouvelle demande
            </button>

        </div>
    `;

    const bouton =
        document.getElementById(
            "nouvelleDemandeMembreActif"
        );

    if (bouton) {

        bouton.addEventListener(
            "click",
            () => {

                demanderPassageMembreActif(
                    membre
                );

            }
        );

    }

    return;
}




    /*
    =========================================
    VÉRIFICATION DE L'ANCIENNETÉ
    =========================================
    */

    if (
        !membre.datePremiereAdhesion
    ) {

        blocMembreActif.style.display =
            "block";

        contenuMembreActif.innerHTML = `

            <div class="message-membre-actif">

                <div class="icone-membre-actif">
                    ℹ️
                </div>

                <h4>
                    Ancienneté indisponible
                </h4>

                <p>
                    Votre date de début d'adhésion
                    n'est pas disponible.
                </p>

            </div>

        `;

        return;
    }


    const datePremiere = convertirDate(membre.datePremiereAdhesion);

    const dateEligibilite =
        new Date(
            datePremiere
        );

    dateEligibilite.setMonth(
        dateEligibilite.getMonth() + 6
    );

    const aujourdHui =
        new Date();

    aujourdHui.setHours(
        0,
        0,
        0,
        0
    );


    /*
    =========================================
    PAS ENCORE ÉLIGIBLE
    =========================================
    */

    if (
        aujourdHui <
        dateEligibilite
    ) {

        const difference =
            dateEligibilite -
            aujourdHui;

        const joursRestants =
            Math.ceil(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );

        blocMembreActif.style.display =
            "block";

        contenuMembreActif.innerHTML = `

            <div class="message-membre-actif">

                <div class="icone-membre-actif">
                    🔒
                </div>

                <h4>
                    Vous n'êtes pas encore éligible
                </h4>

                <p>
                    Pour devenir membre actif,
                    vous devez avoir au minimum
                    6 mois d'ancienneté en tant
                    que membre adhérent.
                </p>

                <div class="date-eligibilite">

                    <strong>
                        Vous serez éligible le :
                    </strong>

                    <span>
                        ${dateEligibilite.toLocaleDateString("fr-FR")}
                    </span>

                </div>

                <p>
                    Il vous reste environ
                    <strong>
                        ${joursRestants} jour(s)
                    </strong>
                    avant de pouvoir déposer
                    votre demande.
                </p>

            </div>

        `;

        return;
    }



   /*
=========================================
ÉLIGIBLE
=========================================
*/

blocMembreActif.style.display =
    "block";

const cotisationAJour =
    membre.statutPaiement ===
    "paye";

const adhesionActive =
    membre.statutAdhesion ===
    "en_cours";

const critereCotisation =
    cotisationAJour &&
    adhesionActive;

contenuMembreActif.innerHTML = `

    <div class="message-membre-actif">

        <div class="icone-membre-actif">
            ⭐
        </div>

        <h4>
            Vous pouvez demander à devenir membre actif
        </h4>

        <p>
            Vous avez atteint les 6 mois d'ancienneté
            requis pour déposer une demande.
        </p>

        <div class="criteres-membre-actif">

            <h5>
                🔎 Conditions examinées
            </h5>

            <div class="critere-membre-actif">

                <span class="icone">
                    ✅
                </span>

                <span class="texte">
                    Ancienneté minimale de 6 mois
                </span>

            </div>

            <div class="critere-membre-actif">

                <span class="icone">
                    ${
                        critereCotisation
                        ? "✅"
                        : "❌"
                    }
                </span>

                <span class="texte">
                    Cotisation à jour
                </span>

            </div>

            <div class="critere-membre-actif">

                <span class="icone">
                    📋
                </span>

                <span class="texte">
                    Participation régulière aux activités
                </span>

            </div>

            <div class="critere-membre-actif">

                <span class="icone">
                    📋
                </span>

                <span class="texte">
                    Implication dans la vie de l'association
                </span>

            </div>

            <div class="critere-membre-actif">

                <span class="icone">
                    📋
                </span>

                <span class="texte">
                    Respect du règlement intérieur
                </span>

            </div>

        </div>

        ${
            critereCotisation
            ?

            `
            <p class="information-demande-actif">

                Votre cotisation est à jour.
                Vous pouvez déposer votre demande.

            </p>

            <button
                id="demanderMembreActif"
                type="button"
            >
                ⭐ Demander à devenir membre actif
            </button>
            `

            :

            `
            <p class="information-demande-actif">

                ⚠️ Votre cotisation n'est pas à jour.
                Vous devez régulariser votre adhésion
                avant de pouvoir déposer une demande.

            </p>
            `
        }

    </div>

`;


const bouton =
    document.getElementById(
        "demanderMembreActif"
    );


if (bouton) {

    bouton.addEventListener(
        "click",
        () => {

            demanderPassageMembreActif(
                membre
            );

        }
    );

}

}

function convertirDate(
    date
) {

    if (
        !date
    ) {
        return null;
    }

    if (
        typeof date.toDate ===
        "function"
    ) {

        return date.toDate();

    }

    const resultat =
        new Date(
            date
        );

    if (
        isNaN(
            resultat.getTime()
        )
    ) {

        return null;

    }

    return resultat;

}

async function demanderPassageMembreActif(
    membre
) {

    const confirmation =
        confirm(
            "Confirmez-vous votre demande pour devenir membre actif de Chroma Esport ?"
        );

    if (
        !confirmation
    ) {
        return;
    }


    const user =
        auth.currentUser;

    if (
    membre.statutMembre !==
    "adherent"
) {

    alert(
        "Seuls les membres adhérents peuvent demander le passage en membre actif."
    );

    return;

}

if (
    membre.statutAdhesion !==
    "en_cours"
) {

    alert(
        "Votre statut d'adhésion doit être en cours pour déposer une demande."
    );

    return;

}

if (
    membre.statutPaiement !==
    "paye"
) {

    alert(
        "Votre cotisation doit être à jour pour déposer une demande."
    );

    return;

}

if (
    membre.statutDemandeMembreActif ===
    "en_attente"
) {

    alert(
        "Une demande est déjà en cours d'examen."
    );

    return;

}

if (
    membre.statutDemandeMembreActif ===
    "refusee" &&
    membre.nouvelleDemandeMembreActifAutorisee !==
    true
) {

    alert(
        "L'administration ne vous a pas encore autorisé à déposer une nouvelle demande."
    );

    return;
}


    
    if (
        !user
    ) {

        alert(
            "Votre session a expiré. Veuillez vous reconnecter."
        );

        window.location.href =
            "index.html";

        return;

    }


    try {

        /*
        =====================================
        VÉRIFICATION DE L'ANCIENNETÉ
        =====================================
        */

        const dateDebut =
            convertirDate(
                membre.datePremiereAdhesion
            );

        if (
    !dateDebut
) {
    alert(
        "Impossible de vérifier votre ancienneté."
    );
    return;
}


        const dateEligibilite =
    new Date(
        dateDebut
    );

        dateEligibilite.setMonth(
            dateEligibilite.getMonth() + 6
        );


        const aujourdHui =
            new Date();

        aujourdHui.setHours(
            0,
            0,
            0,
            0
        );


        if (
            aujourdHui <
            dateEligibilite
        ) {

            alert(
                "Vous n'avez pas encore atteint les 6 mois d'ancienneté requis."
            );

            return;

        }


        /*
        =====================================
        ENVOI DE LA DEMANDE
        =====================================
        */

        const demandeData = {

    statutDemandeMembreActif:
        "en_attente",

    demandeMembreActif:
        true,

    nouvelleDemandeMembreActifAutorisee:
        false,

    dateDemandeMembreActif:
        new Date(),

    firebaseUid:
        user.uid

};


        /*
        =====================================
        MISE À JOUR FIRESTORE
        =====================================
        */


        await updateDoc(

            doc(
                db,
                "membres",
                membre.id
            ),

            demandeData

        );


        alert(
            "Votre demande de passage en membre actif a bien été envoyée."
        );


        window.location.reload();

    }
    catch (
        error
    ) {

        console.error(
            "Erreur lors de la demande de membre actif :",
            error
        );

        alert(
            "Impossible d'envoyer votre demande. Veuillez réessayer."
        );

    }

}

/* =========================================================
DATES
========================================================= */

function afficherDate(
date
) {


if (!date) {

    return "-";

}


if (
    typeof date.toDate ===
    "function"
) {

    return date
        .toDate()
        .toLocaleDateString(
            "fr-FR"
        );

}


const dateConvertie =
    new Date(
        date
    );


if (
    isNaN(
        dateConvertie.getTime()
    )
) {

    return "-";

}


return dateConvertie
    .toLocaleDateString(
        "fr-FR"
    );


}

/* =========================================================
TRADUCTIONS
========================================================= */

function traduireStatutMembre(
statut
) {


switch (
    statut
) {

    case "actif":
        return "⭐ Membre actif";

    case "adherent":
        return "👤 Membre adhérent";

    case "bienfaiteur":
        return "💚 Membre bienfaiteur";

    case "honneur":
        return "🏆 Membre d'honneur";

    default:
        return statut || "-";

}


}

function traduireStatutAdhesion(
statut
) {


switch (
    statut
) {

    case "en_cours":
        return "🟢 En cours";

    case "expiree":
        return "🔴 Expirée";

    case "en_attente":
        return "🟠 En attente";

    default:
        return statut || "-";

}


}

function traduireStatutPaiement(
statut
) {


switch (
    statut
) {

    case "paye":
        return "🟢 Payé";

    case "en_attente":
        return "🟠 En attente";

    default:
        return statut || "-";

}


}

/* =========================================================
FORMAT EURO
========================================================= */

function formatEuro(
montant
) {


return Number(
    montant || 0
).toLocaleString(
    "fr-FR",
    {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }
) + " €";


}

/* =========================================================
ERREUR
========================================================= */

function afficherErreur(
message
) {


document.body.innerHTML = `

    <div style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        background:#010c2c;
        color:white;
        font-family:Arial,Helvetica,sans-serif;
        padding:30px;
        text-align:center;
    ">

        <div>

            <h2 style="
                color:#8fecc9;
            ">
                Espace membre
            </h2>

            <p>
                ${message}
            </p>

            <button
                onclick="window.location.href='index.html'"
                style="
                    margin-top:15px;
                    padding:12px 20px;
                    border:none;
                    border-radius:8px;
                    cursor:pointer;
                    background:#1875c2;
                    color:white;
                "
            >
                Retour à la connexion
            </button>

        </div>

    </div>

`;


}

/* =========================================================
DÉCONNEXION
========================================================= */

logout.addEventListener(
"click",
async () => {


    try {

        await signOut(
            auth
        );

        window.location.href =
            "connexion-membre.html";

    }
    catch (error) {

        console.error(
            "Erreur lors de la déconnexion :",
            error
        );

    }

}


);
