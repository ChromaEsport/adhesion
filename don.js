/* =========================================================
   DON CHROMA ESPORT
========================================================= */

const boutonDon = document.getElementById("boutonDon");

const montantDonInput =
    document.getElementById("montantDon");

const affichageDon =
    document.getElementById("affichageDon");

const affichageTotal =
    document.getElementById("affichageTotal");

const erreurMontant =
    document.getElementById("erreurMontant");

const message =
    document.getElementById("message");

const montantsRapides =
    document.querySelectorAll(".montant-rapide");


/* =========================================================
   CONFIGURATION
========================================================= */

const WORKER_URL =
    "https://chroma-stripe.max2501.workers.dev/";


/* =========================================================
   FORMAT EURO
========================================================= */

function formatEuro(montant) {

    return Number(montant || 0).toLocaleString(
        "fr-FR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " €";

}


/* =========================================================
   RÉCUPÉRATION DU MONTANT
========================================================= */

function recupererMontant() {

    if (!montantDonInput) {
        return 0;
    }

    const valeur =
        montantDonInput.value
            .trim()
            .replace(",", ".");

    return Number(valeur);

}


/* =========================================================
   AFFICHAGE DU MONTANT
========================================================= */

function mettreAJourAffichage() {

    const montant =
        recupererMontant();


    if (
        !Number.isFinite(montant) ||
        montant <= 0
    ) {

        affichageDon.textContent =
            "0,00 €";

        affichageTotal.textContent =
            "0,00 €";

        return;

    }


    affichageDon.textContent =
        formatEuro(montant);

    affichageTotal.textContent =
        formatEuro(montant);

}


/* =========================================================
   MONTANTS RAPIDES
========================================================= */

montantsRapides.forEach(
    bouton => {

        bouton.addEventListener(
            "click",
            () => {

                const montant =
                    bouton.dataset.montant;


                if (!montantDonInput) {
                    return;
                }


                montantDonInput.value =
                    montant.replace(
                        ".",
                        ","
                    );


                /* Retire la sélection des autres boutons */

                montantsRapides.forEach(
                    autreBouton => {

                        autreBouton.classList.remove(
                            "selectionne"
                        );

                    }
                );


                /* Sélectionne le bouton actuel */

                bouton.classList.add(
                    "selectionne"
                );


                /* Efface une éventuelle erreur */

                if (erreurMontant) {

                    erreurMontant.textContent =
                        "";

                }


                mettreAJourAffichage();

            }
        );

    }
);


/* =========================================================
   SAISIE MANUELLE
========================================================= */

if (montantDonInput) {

    montantDonInput.addEventListener(
        "input",
        () => {

            /* Retire la sélection des montants rapides */

            montantsRapides.forEach(
                bouton => {

                    bouton.classList.remove(
                        "selectionne"
                    );

                }
            );


            /* Efface l'erreur */

            if (erreurMontant) {

                erreurMontant.textContent =
                    "";

            }


            if (message) {

                message.textContent =
                    "";

            }


            mettreAJourAffichage();

        }
    );

}


/* =========================================================
   VALIDATION DU MONTANT
========================================================= */

function validerMontant() {

    if (!montantDonInput) {
        return false;
    }


    const valeur =
        montantDonInput.value.trim();


    /* Aucun montant */

    if (!valeur) {

        if (erreurMontant) {

            erreurMontant.textContent =
                "Veuillez saisir le montant de votre don.";

        }

        montantDonInput.focus();

        return false;

    }


    /* Vérification du format */

    if (
        !/^\d+([,.]\d{1,2})?$/.test(
            valeur
        )
    ) {

        if (erreurMontant) {

            erreurMontant.textContent =
                "Veuillez saisir un montant valide avec au maximum 2 décimales.";

        }

        montantDonInput.focus();

        return false;

    }


    const montant =
        Number(
            valeur.replace(",", ".")
        );


    /* Vérification numérique */

    if (
        !Number.isFinite(montant) ||
        montant <= 0
    ) {

        if (erreurMontant) {

            erreurMontant.textContent =
                "Le montant du don doit être supérieur à 0 €.";

        }

        montantDonInput.focus();

        return false;

    }


    /* Vérification d'un montant trop important */

    if (montant > 100000) {

        if (erreurMontant) {

            erreurMontant.textContent =
                "Le montant du don ne peut pas dépasser 100 000 €.";

        }

        montantDonInput.focus();

        return false;

    }


    return true;

}


/* =========================================================
   CRÉATION DU PAIEMENT STRIPE
========================================================= */

async function lancerPaiement() {

    if (!validerMontant()) {
        return;
    }


    const montant =
        recupererMontant();


    /* Bouton en chargement */

    boutonDon.disabled =
        true;

    boutonDon.textContent =
        "⏳ Préparation du paiement...";


    if (message) {

        message.textContent =
            "";

    }


    try {

        console.log(
            "Création du don :",
            montant
        );


        const response =
            await fetch(
                WORKER_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            /* Montant total */

                            montant:
                                montant,

                            /* Don */

                            don:
                                montant,

                            /* Pas de cotisation */

                            cotisation:
                                0,

                            /* Type de paiement */

                            type:
                                "don",

                            /*
                            Aucun compte membre
                            n'est nécessaire
                            */

                            email:
                                "",

                            firebaseUid:
                                "",

                            membreId:
                                "",

                            numeroMembre:
                                "",

                            typeCompte:
                                "",

                            adhesionId:
                                ""

                        })
                }
            );


        const data =
            await response.json();


        console.log(
            "Réponse Worker Stripe :",
            data
        );


        if (
            !response.ok ||
            !data.url
        ) {

            throw new Error(
                data.message ||
                "Impossible de créer le paiement Stripe."
            );

        }


        /* =================================================
           REDIRECTION VERS STRIPE
        ================================================= */

        window.location.href =
            data.url;

    }
    catch (error) {

        console.error(
            "Erreur paiement don :",
            error
        );


        if (erreurMontant) {

            erreurMontant.textContent =
                "Impossible de lancer le paiement. Veuillez réessayer.";

        }


        boutonDon.disabled =
            false;

        boutonDon.textContent =
            "❤️ Continuer vers le paiement";

    }

}


/* =========================================================
   BOUTON PAIEMENT
========================================================= */

if (boutonDon) {

    boutonDon.addEventListener(
        "click",
        lancerPaiement
    );

}


/* =========================================================
   INITIALISATION
========================================================= */

mettreAJourAffichage();


console.log(
    "Page de don Chroma Esport chargée."
);
