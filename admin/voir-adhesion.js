import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    getFirestore,
    doc,
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
    getAuth(app);


const db =
    getFirestore(app);


/* =====================================================
   RÉCUPÉRATION DE L'ID DANS L'URL
===================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );


const adhesionId =
    params.get("id");


/* =====================================================
   ÉLÉMENTS HTML
===================================================== */

const chargement =
    document.getElementById(
        "chargement"
    );


const contenuDemande =
    document.getElementById(
        "contenuDemande"
    );


const erreur =
    document.getElementById(
        "erreur"
    );


/* =====================================================
   VÉRIFICATION CONNEXION
===================================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "index.html";

            return;

        }


        if (!adhesionId) {

            afficherErreur(
                "Identifiant de demande manquant."
            );

            return;

        }


        await chargerDemande();

    }
);


/* =====================================================
   CHARGER LA DEMANDE
===================================================== */

async function chargerDemande() {

    try {

        const adhesionRef =
            doc(
                db,
                "adhesions",
                adhesionId
            );


        const adhesionSnap =
            await getDoc(
                adhesionRef
            );


        if (
            !adhesionSnap.exists()
        ) {

            afficherErreur(
                "Cette demande n'existe pas."
            );

            return;

        }


        const data =
            adhesionSnap.data();


        afficherDonnees(
            data
        );


        chargement.style.display =
            "none";


        contenuDemande.style.display =
            "block";


    }
    catch (error) {

        console.error(
            "Erreur chargement demande :",
            error
        );


        afficherErreur(
            "Une erreur est survenue lors du chargement."
        );

    }

}


/* =====================================================
   AFFICHER LES DONNÉES
===================================================== */

function afficherDonnees(
    data
) {

    afficher(
        "prenom",
        data.prenom
    );


    afficher(
        "nom",
        data.nom
    );


    afficher(
        "dateNaissance",
        formaterDate(
            data.dateNaissance
        )
    );


    afficher(
        "email",
        data.email
    );


    afficher(
        "discord",
        data.discord
    );


    afficher(
        "adresse",
        data.adresse
    );


    afficher(
        "complementAdresse",
        data.complementAdresse
    );


    afficher(
        "codePostal",
        data.codePostal
    );


    afficher(
        "ville",
        data.ville
    );


    afficher(
        "pays",
        data.pays
    );


    afficher(
        "annee",
        data.annee
    );


    afficherEuro(
        "cotisation",
        data.cotisation
    );


    afficherEuro(
        "don",
        data.don
    );


    afficherEuro(
        "total",
        data.total
    );


    afficher(
        "dateDemande",
        formaterDate(
            data.dateDemande
        )
    );


    afficher(
        "statut",
        data.statut
    );


    afficher(
        "statutPaiement",
        data.statutPaiement
    );

}


/* =====================================================
   AFFICHAGE TEXTE
===================================================== */

function afficher(
    id,
    valeur
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.textContent =
        valeur ||
        "-";

}


/* =====================================================
   AFFICHAGE EURO
===================================================== */

function afficherEuro(
    id,
    valeur
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    const montant =
        Number(
            valeur || 0
        );


    element.textContent =
        montant.toFixed(2) +
        " €";

}


/* =====================================================
   FORMAT DATE
===================================================== */

function formaterDate(
    valeur
) {

    if (!valeur) {

        return "-";

    }


    try {

        if (
            typeof valeur.toDate ===
            "function"
        ) {

            return valeur
                .toDate()
                .toLocaleDateString(
                    "fr-FR"
                );

        }


        const date =
            new Date(
                valeur
            );


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return valeur;

        }


        return date.toLocaleDateString(
            "fr-FR"
        );

    }
    catch {

        return "-";

    }

}


/* =====================================================
   ERREUR
===================================================== */

function afficherErreur(
    message
) {

    chargement.style.display =
        "none";


    contenuDemande.style.display =
        "none";


    erreur.textContent =
        message;


    erreur.style.display =
        "block";

}


/* =====================================================
   RETOUR
===================================================== */

document
    .getElementById(
        "retour"
    )
    .addEventListener(
        "click",
        () => {

            window.location.href =
                "dashboard.html";

        }
    );
