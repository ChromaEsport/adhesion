import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    updateDoc
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

            window.membreActuel = membre;
        

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
    async () => {

        const total =
            cotisation +
            don;


        // =========================
        // RÉCUPÉRATION DES DONNÉES
        // =========================

        const nouvellesInformations = {

            prenom:
                document.getElementById(
                    "prenom"
                ).value.trim(),

            nom:
                document.getElementById(
                    "nom"
                ).value.trim(),

            dateNaissance:
                document.getElementById(
                    "dateNaissance"
                ).value,

            discord:
                document.getElementById(
                    "discord"
                ).value.trim(),

            adresse:
                document.getElementById(
                    "adresse"
                ).value.trim(),

            complementAdresse:
                document.getElementById(
                    "complementAdresse"
                ).value.trim(),

            codePostal:
                document.getElementById(
                    "codePostal"
                ).value.trim(),

            ville:
                document.getElementById(
                    "ville"
                ).value.trim(),

            pays:
                document.getElementById(
                    "pays"
                ).value.trim()

        };


        // =========================
        // VÉRIFICATION DES CHAMPS
        // =========================

        if (
            !nouvellesInformations.prenom ||
            !nouvellesInformations.nom ||
            !nouvellesInformations.dateNaissance ||
            !nouvellesInformations.discord ||
            !nouvellesInformations.adresse ||
            !nouvellesInformations.codePostal ||
            !nouvellesInformations.ville ||
            !nouvellesInformations.pays
        ) {

            alert(
                "Merci de remplir tous les champs obligatoires."
            );

            return;

        }


        // =========================
        // DÉSACTIVATION DU BOUTON
        // =========================

        boutonRenouvellement.disabled =
            true;

        boutonRenouvellement.textContent =
            "Enregistrement...";


        try {

            // =========================
            // MISE À JOUR FIRESTORE
            // =========================

            await updateDoc(

                doc(
                    db,
                    "membres",
                    membreId
                ),

                nouvellesInformations

            );


            console.log(
                "Informations du membre mises à jour :",
                membreId
            );


            // =========================
            // POUR L'INSTANT :
            // AFFICHAGE DU TOTAL
            // =========================

            console.log(
                "Renouvellement :",
                {
                    membreId,
                    cotisation,
                    don,
                    total
                }
            );


// =========================
// CRÉATION DU PAIEMENT
// =========================

boutonRenouvellement.textContent =
    "Création du paiement...";


const reponse =
    await fetch(
        "https://chroma-stripe.max2501.workers.dev",
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                // Montants
                cotisation:
                    cotisation,

                don:
                    don,

                montant:
                    total,

                // Membre
                membreId:
                    membreId,

                numeroMembre:
                    window.membreActuel
                    ?.numeroMembre || "",

                email:
                    window.membreActuel?.email || "",

                // Type de paiement
                type:
                    "renouvellement"

            })

        }
    );


const stripe =
    await reponse.json();


if (
    !reponse.ok ||
    !stripe.url
) {

    console.error(
        "Réponse Worker :",
        stripe
    );


    throw new Error(
        "Impossible de créer le paiement Stripe."
    );

}


// =========================
// REDIRECTION STRIPE
// =========================

window.location.href =
    stripe.url;



        }
        catch (error) {

            console.error(
                "Erreur mise à jour membre :",
                error
            );


            alert(
                "Impossible d'enregistrer vos informations."
            );


            boutonRenouvellement.disabled =
                false;

            boutonRenouvellement.textContent =
                "Continuer vers le paiement";

        }

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
