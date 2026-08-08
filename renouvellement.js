import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// =========================
// CONFIGURATION FIREBASE
// =========================

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


const db =
    getFirestore(app);


// =========================
// RÉCUPÉRATION DE L'ID
// =========================

const params =
    new URLSearchParams(
        window.location.search
    );


const membreId =
    params.get("id");


const message =
    document.getElementById(
        "message"
    );


// =========================
// CHARGEMENT DU MEMBRE
// =========================

async function chargerMembre() {

    if (!membreId) {

        afficherErreur(
            "Aucun membre sélectionné."
        );

        return;

    }


    try {

        const membreRef =
            doc(
                db,
                "membres",
                membreId
            );


        const membreSnap =
            await getDoc(
                membreRef
            );


        if (!membreSnap.exists()) {

            afficherErreur(
                "Membre introuvable."
            );

            return;

        }


        const membre =
            membreSnap.data();


        remplirFormulaire(
            membre
        );


    }
    catch (error) {

        console.error(
            "Erreur chargement membre :",
            error
        );


        afficherErreur(
            "Impossible de charger les informations du membre."
        );

    }

}


// =========================
// REMPLISSAGE DU FORMULAIRE
// =========================

function remplirFormulaire(
    membre
) {

    document.getElementById(
        "prenom"
    ).value =
        membre.prenom || "";


    document.getElementById(
        "nom"
    ).value =
        membre.nom || "";


    document.getElementById(
        "dateNaissance"
    ).value =
        membre.dateNaissance || "";


    document.getElementById(
        "discord"
    ).value =
        membre.discord || "";


    document.getElementById(
        "adresse"
    ).value =
        membre.adresse || "";


    document.getElementById(
        "complementAdresse"
    ).value =
        membre.complementAdresse || "";


    document.getElementById(
        "codePostal"
    ).value =
        membre.codePostal || "";


    document.getElementById(
        "ville"
    ).value =
        membre.ville || "";


    document.getElementById(
        "pays"
    ).value =
        membre.pays || "";


}


// =========================
// GESTION DU DON
// =========================

const boutonsDon =
    document.querySelectorAll(
        ".bouton-don"
    );


const autreDon =
    document.getElementById(
        "autreDon"
    );


const affichageDon =
    document.getElementById(
        "affichageDon"
    );


const affichageTotal =
    document.getElementById(
        "affichageTotal"
    );


const cotisation =
    50;


let don =
    0;


// =========================
// CHOIX RAPIDE DU DON
// =========================

boutonsDon.forEach(
    bouton => {

        bouton.addEventListener(
            "click",
            () => {

                boutonsDon.forEach(
                    autre => {

                        autre.classList.remove(
                            "actif"
                        );

                    }
                );


                bouton.classList.add(
                    "actif"
                );


                don =
                    Number(
                        bouton.dataset.don
                    );


                autreDon.value =
                    "";


                mettreAJourTotal();

            }
        );

    }
);


// =========================
// AUTRE DON
// =========================

autreDon.addEventListener(
    "input",
    () => {

        boutonsDon.forEach(
            bouton => {

                bouton.classList.remove(
                    "actif"
                );

            }
        );


        don =
            Number(
                autreDon.value
            )
            || 0;


        mettreAJourTotal();

    }
);


// =========================
// CALCUL DU TOTAL
// =========================

function mettreAJourTotal() {

    const total =
        cotisation +
        don;


    affichageDon.textContent =
        don.toFixed(2)
        +
        " €";


    affichageTotal.textContent =
        total.toFixed(2)
        +
        " €";

}


// =========================
// BOUTON PAIEMENT
// =========================

const boutonRenouvellement =
    document.getElementById(
        "boutonRenouvellement"
    );


boutonRenouvellement.addEventListener(
    "click",
    () => {

        const total =
            cotisation +
            don;


        console.log(
            "Renouvellement :",
            {
                membreId,
                cotisation,
                don,
                total
            }
        );


        /*
        Pour l'instant nous ne lançons
        pas encore Stripe.

        La prochaine étape sera :

        - enregistrer les informations
          modifiées ;
        - créer la demande de renouvellement ;
        - envoyer cotisation + don + total
          au Worker ;
        - ouvrir Stripe.
        */


        alert(
            "Étape suivante : paiement de "
            +
            total.toFixed(2)
            +
            " €"
        );

    }
);


// =========================
// MESSAGE D'ERREUR
// =========================

function afficherErreur(
    texte
) {

    message.textContent =
        texte;

    message.style.display =
        "block";

}


// =========================
// DÉMARRAGE
// =========================

chargerMembre();
