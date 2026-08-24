/* =========================================================
   ÉLÉMENTS HTML
========================================================= */

const boutonDon =
    document.getElementById(
        "boutonDon"
    );

const popupDon =
    document.getElementById(
        "popupDon"
    );

const fermerPopupDon =
    document.getElementById(
        "fermerPopupDon"
    );

const montantDonInput =
    document.getElementById(
        "montantDon"
    );

const emailDonInput =
    document.getElementById(
        "emailDon"
    );

const continuerDon =
    document.getElementById(
        "continuerDon"
    );

const erreurMontantDon =
    document.getElementById(
        "erreurMontantDon"
    );

const montantsRapides =
    document.querySelectorAll(
        ".montant-don-rapide"
    );


/* =========================================================
   OUVRIR LE POPUP
========================================================= */

function ouvrirPopupDon() {

    if (!popupDon) {
        return;
    }

    popupDon.style.display =
        "flex";

    document.body.classList.add(
        "popup-don-ouvert"
    );

    if (montantDonInput) {

        montantDonInput.value =
            "";

    }

    if (emailDonInput) {

        emailDonInput.value =
            "";

    }

    if (erreurMontantDon) {

        erreurMontantDon.textContent =
            "";

    }

    montantsRapides.forEach(
        bouton => {

            bouton.classList.remove(
                "selectionne"
            );

        }
    );

    setTimeout(
        () => {

            if (montantDonInput) {

                montantDonInput.focus();

            }

        },
        100
    );

}


/* =========================================================
   FERMER LE POPUP
========================================================= */

function fermerPopupDonFonction() {

    if (!popupDon) {
        return;
    }

    popupDon.style.display =
        "none";

    document.body.classList.remove(
        "popup-don-ouvert"
    );

}


/* =========================================================
   BOUTON DON
========================================================= */

if (boutonDon) {

    boutonDon.addEventListener(
        "click",
        () => {

            ouvrirPopupDon();

        }
    );

}


/* =========================================================
   BOUTON FERMER
========================================================= */

if (fermerPopupDon) {

    fermerPopupDon.addEventListener(
        "click",
        () => {

            fermerPopupDonFonction();

        }
    );

}


/* =========================================================
   CLIQUER EN DEHORS DU POPUP
========================================================= */

if (popupDon) {

    popupDon.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                popupDon
            ) {

                fermerPopupDonFonction();

            }

        }
    );

}


/* =========================================================
   TOUCHE ÉCHAP
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            popupDon &&
            popupDon.style.display ===
                "flex"
        ) {

            fermerPopupDonFonction();

        }

    }
);


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

                if (montantDonInput) {

                    montantDonInput.value =
                        montant.replace(
                            ".",
                            ","
                        );

                    montantDonInput.focus();

                }

                montantsRapides.forEach(
                    autreBouton => {

                        autreBouton.classList.remove(
                            "selectionne"
                        );

                    }
                );

                bouton.classList.add(
                    "selectionne"
                );

                if (erreurMontantDon) {

                    erreurMontantDon.textContent =
                        "";

                }

            }
        );

    }
);


/* =========================================================
   MODIFICATION DU MONTANT
========================================================= */

if (montantDonInput) {

    montantDonInput.addEventListener(
        "input",
        () => {

            montantsRapides.forEach(
                bouton => {

                    bouton.classList.remove(
                        "selectionne"
                    );

                }
            );

            if (erreurMontantDon) {

                erreurMontantDon.textContent =
                    "";

            }

        }
    );

}


/* =========================================================
   CONTINUER VERS STRIPE
========================================================= */

if (continuerDon) {

    continuerDon.addEventListener(
        "click",
        async () => {

            if (!montantDonInput) {
                return;
            }


            /* =========================================
               RÉCUPÉRATION DU MONTANT
            ========================================= */

            const valeur =
                montantDonInput.value
                    .trim()
                    .replace(
                        ",",
                        "."
                    );

            const montant =
                Number(
                    valeur
                );


            /* =========================================
               VALIDATION DU MONTANT
            ========================================= */

            if (
                !valeur ||
                !Number.isFinite(
                    montant
                ) ||
                montant <= 0
            ) {

                if (erreurMontantDon) {

                    erreurMontantDon.textContent =
                        "Veuillez saisir un montant valide.";

                }

                montantDonInput.focus();

                return;

            }


            /* =========================================
               MAXIMUM 2 DÉCIMALES
            ========================================= */

            if (
                !/^\d+([,.]\d{1,2})?$/.test(
                    montantDonInput.value.trim()
                )
            ) {

                if (erreurMontantDon) {

                    erreurMontantDon.textContent =
                        "Le montant doit comporter au maximum 2 décimales.";

                }

                montantDonInput.focus();

                return;

            }


            /* =========================================
               EMAIL
            ========================================= */

            let email =
                "";

            if (emailDonInput) {

                email =
                    emailDonInput.value
                        .trim();

            }


            /* =========================================
               VALIDATION EMAIL
               
               L'email reste facultatif.
            ========================================= */

            if (
                email &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    email
                )
            ) {

                if (erreurMontantDon) {

                    erreurMontantDon.textContent =
                        "Veuillez saisir une adresse e-mail valide.";

                }

                emailDonInput.focus();

                return;

            }


            /* =========================================
               BOUTON EN CHARGEMENT
            ========================================= */

            continuerDon.disabled =
                true;

            continuerDon.textContent =
                "⏳ Préparation du paiement...";


            try {

                console.log(
                    "Création du don :",
                    {
                        montant:
                            montant,

                        email:
                            email
                    }
                );


                /* =====================================
                   APPEL DU WORKER CLOUDFLARE
                ===================================== */

                const response =
                    await fetch(
                        "https://chroma-stripe.max2501.workers.dev/",
                        {
                            method:
                                "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    /* -----------------
                                       DON
                                    ----------------- */

                                    montant:
                                        montant,

                                    don:
                                        montant,

                                    type:
                                        "don",


                                    /* -----------------
                                       DONATEUR PUBLIC
                                    ----------------- */

                                    email:
                                        email,

                                    firebaseUid:
                                        "",

                                    membreId:
                                        "",

                                    numeroMembre:
                                        "",

                                    typeCompte:
                                        "visiteur",


                                    /* -----------------
                                       PAS D'ADHÉSION
                                    ----------------- */

                                    adhesionId:
                                        "",

                                    cotisation:
                                        0

                                })

                        }
                    );


                /* =====================================
                   RÉCUPÉRATION DE LA RÉPONSE
                ===================================== */

                const data =
                    await response.json();


                console.log(
                    "Réponse Worker Stripe :",
                    data
                );


                /* =====================================
                   VÉRIFICATION
                ===================================== */

                if (
                    !response.ok ||
                    !data.url
                ) {

                    throw new Error(
                        data.message ||
                        "Impossible de créer le paiement Stripe."
                    );

                }


                /* =====================================
                   REDIRECTION VERS STRIPE
                ===================================== */

                window.location.href =
                    data.url;

            }


            /* =========================================
               ERREUR
            ========================================= */

            catch (
                error
            ) {

                console.error(
                    "Erreur paiement don :",
                    error
                );

                if (erreurMontantDon) {

                    erreurMontantDon.textContent =
                        "Impossible de lancer le paiement. Veuillez réessayer.";

                }

                continuerDon.disabled =
                    false;

                continuerDon.textContent =
                    "❤️ Continuer vers le paiement";

            }

        }
    );

}
