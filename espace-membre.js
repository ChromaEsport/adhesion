/* =========================================================
IMPORT
========================================================= */
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

const dateNaissanceMembre =
document.getElementById(
"dateNaissanceMembre"
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

const boutonDevenirAdherent =
    document.querySelector(
        ".bouton-communaute.adherer"
    );

const blocRenouvellement =
document.getElementById(
"blocRenouvellement"
);

const boutonRenouvellement =
document.getElementById(
"boutonRenouvellement"
);

const boutonDon =
document.getElementById(
"boutonDon"
);

const popupDon =
    document.getElementById(
        "popupDon"
    );

const blocMesDons =
document.getElementById(
"blocMesDons"
);

const totalDons =
document.getElementById(
"totalDons"
);

const nombreDons =
document.getElementById(
"nombreDons"
);

const listeDons =
document.getElementById(
"listeDons"
);

const fermerPopupDon =
    document.getElementById(
        "fermerPopupDon"
    );

const montantDonInput =
    document.getElementById(
        "montantDon"
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

let membreConnecte = null;

/* =========================================================
Bouton Don
========================================================= */
/* =========================================================
POPUP DON
========================================================= */

function ouvrirPopupDon() {

    if (!popupDon) {
        return;
    }

    popupDon.style.display = "flex";

    document.body.classList.add(
        "popup-don-ouvert"
    );

    if (montantDonInput) {
        montantDonInput.value = "";
    }

    if (erreurMontantDon) {
        erreurMontantDon.textContent = "";
    }

    setTimeout(
        () => {

            if (montantDonInput) {
                montantDonInput.focus();
            }

        },
        100
    );
}


function fermerPopupDonFonction() {

    if (!popupDon) {
        return;
    }

    popupDon.style.display = "none";

    document.body.classList.remove(
        "popup-don-ouvert"
    );

}


/*
=========================================
OUVERTURE DU POPUP
=========================================
*/

if (boutonDon) {

    boutonDon.addEventListener(
        "click",
        () => {

            ouvrirPopupDon();

        }
    );

}


/*
=========================================
FERMETURE
=========================================
*/

if (fermerPopupDon) {

    fermerPopupDon.addEventListener(
        "click",
        () => {

            fermerPopupDonFonction();

        }
    );

}


/*
=========================================
CLIQUER EN DEHORS DE LA FENÊTRE
=========================================
*/

if (popupDon) {

    popupDon.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                popupDon
            ) {

                fermerPopupDonFonction();

            }

        }
    );

}


/*
=========================================
TOUCHE ÉCHAP
=========================================
*/

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            popupDon &&
            popupDon.style.display === "flex"
        ) {

            fermerPopupDonFonction();

        }

    }
);


/*
=========================================
MONTANTS RAPIDES
=========================================
*/

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

            }
        );

    }
);


/*
=========================================
MODIFICATION MANUELLE DU MONTANT
=========================================
*/

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


/*
=========================================
CONTINUER VERS STRIPE
=========================================
*/

if (continuerDon) {

    continuerDon.addEventListener(
        "click",
        async () => {

            if (!montantDonInput) {
                return;
            }

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


            /*
            =====================================
            VALIDATION
            =====================================
            */

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


            /*
            =====================================
            MAXIMUM DE DÉCIMALES
            =====================================
            */

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


            /*
            =====================================
            UTILISATEUR CONNECTÉ
            =====================================
            */

            const user =
                auth.currentUser;

            if (!user) {

                alert(
                    "Votre session a expiré. Veuillez vous reconnecter."
                );

                fermerPopupDonFonction();

                return;

            }


            /*
            =====================================
            BOUTON EN CHARGEMENT
            =====================================
            */

            continuerDon.disabled =
                true;

            continuerDon.textContent =
                "⏳ Préparation du paiement...";


            try {

                console.log(
                    "Création du don :",
                    montant
                );


                const response =
                    await fetch(
                        "https://chroma-stripe.max2501.workers.dev/",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    montant:
                                        montant,

                                    email:
                                        user.email || "",

                                    type:
                                        "don",

                                    firebaseUid:
                                        user.uid,

                                    membreId:
                                        membreConnecte?.id || "",

                                    numeroMembre:
                                        membreConnecte?.numeroMembre || "",

                                    typeCompte:
                                        membreConnecte?.typeCompte || "",

                                    adhesionId:
                                        "",

                                    cotisation:
                                        0,

                                    don:
                                        montant

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


                /*
                =====================================
                REDIRECTION STRIPE
                =====================================
                */

                window.location.href =
                    data.url;

            }
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


    /*
    =====================================
    CHARGEMENT DES DONS
    =====================================
    */

    await chargerMesDons(
        user.uid
    );

});

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

const communauteDoc = await getDoc(
    communauteRef
);

if (communauteDoc.exists()) {

    const membre = {
        id: communauteDoc.id,
        typeCompte: "communaute",
        ...communauteDoc.data()
    };

    /*
    =========================================
    RECHERCHE D'UNE DEMANDE D'ADHÉSION
    =========================================
    */

    const requeteAdhesion = query(
        collection(db, "adhesions"),
        where(
            "firebaseUid",
            "==",
            firebaseUid
        )
    );

    const resultatAdhesion =
        await getDocs(
            requeteAdhesion
        );

    /*
    =========================================
    SI UNE DEMANDE EXISTE
    =========================================
    */

    if (!resultatAdhesion.empty) {

        /*
        On prend la demande la plus récente.
        */

        let demandeLaPlusRecente = null;

        resultatAdhesion.forEach(
            documentFirestore => {

                const data =
                    documentFirestore.data();

                if (
                    !demandeLaPlusRecente ||
                    (
                        data.dateDemande &&
                        data.dateDemande.toMillis() >
                        demandeLaPlusRecente.dateDemande.toMillis()
                    )
                ) {
                    demandeLaPlusRecente = {
                        id:
                            documentFirestore.id,
                        ...data
                    };
                }

            }
        );

        if (demandeLaPlusRecente) {

            membre.demandeAdhesion =
                demandeLaPlusRecente;

            membre.statutDemandeAdhesion =
                demandeLaPlusRecente.statut;

            membre.dateDemandeAdhesion =
                demandeLaPlusRecente.dateDemande;

 /*
        =========================================
        UNE DEMANDE EXISTE
        =========================================
        */

        if (boutonDevenirAdherent) {
            boutonDevenirAdherent.style.display =
                "none";
        }
            
        }
    }

    console.log(
        "Compte communauté chargé avec demande :",
        membre
    );

    afficherMembre(
        membre
    );

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


async function chargerMesDons(
firebaseUid
) {

if (
    !firebaseUid
) {

    console.error(
        "Firebase UID introuvable pour charger les dons."
    );

    return;

}


if (
    !listeDons ||
    !totalDons ||
    !nombreDons
) {

    return;

}


try {

    const requeteDons =
        query(
            collection(
                db,
                "dons"
            ),
            where(
                "firebaseUid",
                "==",
                firebaseUid
            ),
            where(
                "statut",
                "==",
                "paye"
            )
        );


    const resultatDons =
        await getDocs(
            requeteDons
        );


    const dons = [];


    resultatDons.forEach(
        documentFirestore => {

            const data =
                documentFirestore.data();

            dons.push({

                id:
                    documentFirestore.id,

                ...data

            });

        }
    );


    /*
    =====================================
    TRI DU PLUS RÉCENT AU PLUS ANCIEN
    =====================================
    */

    dons.sort(
        (
            a,
            b
        ) => {

            return convertirDate(
                b.date
            ) -
            convertirDate(
                a.date
            );

        }
    );


    /*
    =====================================
    CALCUL DU TOTAL
    =====================================
    */

    let total =
        0;


    dons.forEach(
        don => {

            total +=
                Number(
                    don.montant
                )
                ||
                0;

        }
    );


    /*
    =====================================
    AFFICHAGE STATISTIQUES
    =====================================
    */

    totalDons.textContent =
        formatEuro(
            total
        );


    nombreDons.textContent =
        dons.length;


    /*
    =====================================
    AFFICHAGE HISTORIQUE
    =====================================
    */

    if (
        dons.length === 0
    ) {

        listeDons.innerHTML = `

            <div class="aucun-don">

                <div class="icone-aucun-don">
                    ❤️
                </div>

                <p>
                    Vous n'avez encore effectué
                    aucun don.
                </p>

                <p>
                    Votre soutien apparaîtra ici
                    après votre premier don.
                </p>

            </div>

        `;

        return;

    }


    listeDons.innerHTML =
        dons
            .map(
                don => {

                    const date =
                        convertirDate(
                            don.date
                        );


                    const dateFormatee =
                        date
                        ?
                        date.toLocaleDateString(
                            "fr-FR",
                            {
                                day:
                                    "2-digit",
                                month:
                                    "2-digit",
                                year:
                                    "numeric"
                            }
                        )
                        :
                        "-";


                    return `

                        <div class="ligne-don">

                            <div
                                class="information-don"
                            >

                                <div
                                    class="icone-historique-don"
                                >
                                    ❤️
                                </div>

                                <div>

                                    <span
                                        class="date-don"
                                    >
                                        ${dateFormatee}
                                    </span>

                                    <span
                                        class="statut-don"
                                    >
                                        🟢 Don payé
                                    </span>

                                </div>

                            </div>


                            <strong
                                class="montant-don"
                            >
                                ${formatEuro(don.montant)}
                            </strong>

                        </div>

                    `;

                }
            )
            .join("");

}
catch (
    error
) {

    console.error(
        "Erreur lors du chargement des dons :",
        error
    );


    totalDons.textContent =
        "—";


    nombreDons.textContent =
        "—";


    listeDons.innerHTML = `

        <div class="aucun-don">

            <div class="icone-aucun-don">
                ⚠️
            </div>

            <p>
                Impossible de charger
                votre historique de dons.
            </p>

        </div>

    `;

}

}

/* =========================================================
AFFICHER LE MEMBRE
========================================================= */
function afficherMembre(membre) {

membreConnecte = membre;
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

dateNaissanceMembre.textContent =
    membre.dateNaissance || membre.naissance || "-";
 
emailMembre.textContent =
    membre.email || "-";

discordMembre.textContent =
    membre.discord || "-";
    


console.log(
    "Compte chargé dans afficherMembre :",
    membre
);


/*
=========================================
DÉTECTION DU TYPE DE COMPTE
=========================================
*/

if (
    membre.typeCompte === "communaute"
) {

    /*
    =========================================
    AFFICHAGE COMMUNAUTÉ
    =========================================
    */

    console.log(
        "Affichage du compte COMMUNAUTÉ"
    );


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


    const demandeAdhesionCommunaute =
        document.getElementById(
            "demandeAdhesionCommunaute"
        );


    if (
        demandeAdhesionCommunaute
    ) {

        if (
            membre.statutDemandeAdhesion ===
            "en_attente"
        ) {

            demandeAdhesionCommunaute.style.display =
                "block";

            demandeAdhesionCommunaute.innerHTML = `
                <div class="message-demande-adhesion en-attente">

                    <h4>
                        ⏳ Votre demande d'adhésion est en cours
                    </h4>

                    <p>
                        Votre demande pour devenir
                        membre adhérent de Chroma Esport
                        a bien été enregistrée.
                    </p>

                    <p>
                        L'administration doit maintenant
                        examiner votre demande.
                    </p>

                    <div class="statut-demande-adhesion">
                        🟠 Demande en attente
                    </div>

                    <div class="paiement-demande-adhesion">
                        💳 Cotisation :
                        <strong>50,00 €</strong>
                    </div>

                    <p class="information-paiement">
                        Aucun paiement n'est demandé tant
                        que votre demande n'a pas été acceptée.
                    </p>

                </div>
            `;

        }

        else if (
            membre.statutDemandeAdhesion ===
            "refusee"
        ) {

            demandeAdhesionCommunaute.style.display =
                "block";

            demandeAdhesionCommunaute.innerHTML = `
                <div class="message-demande-adhesion refusee">

                    <div class="icone-demande-adhesion">
                        ❌
                    </div>

                    <h4>
                        Votre demande d'adhésion a été refusée
                    </h4>

                    <p>
                        Votre demande pour devenir
                        membre adhérent de Chroma Esport
                        n'a pas été acceptée.
                    </p>

                    <div class="statut-demande-adhesion">
                        🔴 Demande refusée
                    </div>

                </div>
            `;

        }

        else {

            demandeAdhesionCommunaute.style.display =
                "none";

            demandeAdhesionCommunaute.innerHTML =
                "";

            if (boutonDevenirAdherent) {

                boutonDevenirAdherent.style.display =
                    "inline-flex";

            }

        }

    }


    /*
    =========================================
    STATUT COMMUNAUTÉ
    =========================================
    */

    statutMembre.textContent =
        "💜 Membre Communauté";

    numeroMembre.textContent =
        "Communauté";

    statutAdhesion.textContent =
        "💜 Inscription gratuite";

    statutPaiement.textContent =
        "💜 Aucun paiement";

    cotisation.textContent =
        "0,00 €";

    anneeAdhesion.textContent =
        "-";

    dateDebutAdhesion.textContent =
        "-";

    dateFinAdhesion.textContent =
        "-";


    numeroCarte.textContent =
        "COMMUNAUTÉ";

    statutCarte.textContent =
        "💜 Membre Communauté";


    return;

}


/*
=========================================
MEMBRE ADHÉRENT
=========================================
*/

if (
    membre.typeCompte === "adherent"
) {

    console.log(
        "Affichage du compte ADHÉRENT :",
        membre
    );


    /*
    =========================================
    AFFICHAGE DES BLOCS
    =========================================
    */

    if (blocCommunaute) {

        blocCommunaute.style.display =
            "none";

    }

    if (blocAdhesion) {

        blocAdhesion.style.display =
            "block";

    }

    if (blocCarteMembre) {

        blocCarteMembre.style.display =
            "block";

    }


    /*
    =========================================
    INFORMATIONS ADHÉRENT
    =========================================
    */
    console.log(
        "Compte membre adhérent chargé :",
        membre
    );
    
    numeroMembre.textContent =
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


    /*
    =========================================
    CARTE MEMBRE
    =========================================
    */

    numeroCarte.textContent =
        membre.numeroMembre || "-";


    if (
        membre.carteEnvoyee === true
    ) {

        statutCarte.textContent =
            "🟢 Carte envoyée";

    }
    else {

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

    afficherRenouvellement(
membre
);

    return;

}


/*
=========================================
TYPE DE COMPTE INCONNU
=========================================
*/

console.error(
    "Type de compte inconnu :",
    membre
);

afficherErreur(
    "Impossible de déterminer le type de votre compte."
);
}

    /*
    =========================================
    ESPACE MEMBRE ACTIF
    =========================================
    */


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

                <h4>
                  🔒 Vous n'êtes pas encore éligible
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

function afficherRenouvellement(membre) {

if (!blocRenouvellement) {
    return;
}

// Par défaut : bloc caché
blocRenouvellement.style.display = "none";

// Le renouvellement concerne uniquement
// les adhésions expirées
if (
    membre.statutAdhesion !== "expiree"
) {
    return;
}

// Afficher le bloc
blocRenouvellement.style.display = "block";

// Si un bouton existe
if (boutonRenouvellement) {

    boutonRenouvellement.style.display =
        "inline-flex";

    boutonRenouvellement.onclick = () => {

        lancerRenouvellementStripe(
            membre
        );

    };

}
}

function lancerRenouvellementStripe(membre) {


if (!membre) {
    alert(
        "Impossible de récupérer les informations du membre."
    );
    return;
}

if (
    membre.statutAdhesion !== "expiree"
) {
    alert(
        "Votre adhésion est déjà en cours."
    );
    return;
}

if (!membre.id) {
    alert(
        "Identifiant du membre introuvable."
    );
    return;
}

window.location.href =
    "https://chromaesport.github.io/adhesion/renouvellement?id="
    + encodeURIComponent(membre.id);


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
                onclick="window.location.href='connexion-membre.html'"
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
