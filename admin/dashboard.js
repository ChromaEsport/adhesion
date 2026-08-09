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
    getDocs,
    getDoc,
    query,
    where,
    doc,
    updateDoc,
    setDoc,
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
    getAuth(app);

const db =
    getFirestore(app);


const listeDemandes =
    document.getElementById(
        "listeDemandes"
    );

const logout =
    document.getElementById(
        "logout"
    );

const onglets =
    document.querySelectorAll(
        ".onglet"
    );


let statutActuel =
    "en_attente";



/* =====================================================
   VÉRIFICATION CONNEXION
===================================================== */

onAuthStateChanged(
    auth,
    (user) => {

        if (!user) {

            window.location.href =
                "index.html";

            return;

        }

        chargerDemandes();

        calculerFinances();
        
        chargerStatistiques();

    }
);



/* =====================================================
   STATISTIQUES
===================================================== */

async function chargerStatistiques() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "membres"
                )
            );

const requeteAdhesions =
    query(
        collection(
            db,
            "adhesions"
        ),
        where(
            "statut",
            "==",
            "acceptee"
        ),
        where(
            "statutPaiement",
            "==",
            "en_attente"
        )
    );


const snapshotAdhesions =
    await getDocs(
        requeteAdhesions
    );

        
        const membres =
            [];


        snapshot.forEach(
            documentFirestore => {

                membres.push({

                    id:
                        documentFirestore.id,

                    ...documentFirestore.data()

                });

            }
        );


        const aujourdHui =
            new Date();


        aujourdHui.setHours(
            0,
            0,
            0,
            0
        );


        let membresActifs = 0;

        let membresExpires = 0;

        let membresAttentePaiement =
    snapshotAdhesions.size;

        let cotisationsEncaissees = 0;

        let donsEncaisses = 0;

        let nouvellesAdhesions = 0;

        let renouvellements = 0;


        membres.forEach(
            membre => {


                /* =========================================
                   DATE DE FIN
                ========================================= */

                let adhesionExpiree =
                    false;


                if (
                    membre.dateFinAdhesion
                ) {

                    const dateFin =
                        new Date(
                            membre.dateFinAdhesion
                        );


                    dateFin.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    adhesionExpiree =
                        dateFin < aujourdHui;

                }


                /* =========================================
                   MEMBRES ACTIFS
                ========================================= */

                if (
                    !adhesionExpiree &&
                    membre.statutPaiement === "paye"
                ) {

                    membresActifs++;

                }


                /* =========================================
                   MEMBRES EXPIRÉS
                ========================================= */

                if (
                    adhesionExpiree
                ) {

                    membresExpires++;

                }


                /* =========================================
                   FINANCES
                ========================================= */

                if (
                    membre.statutPaiement ===
                    "paye"
                ) {

                    cotisationsEncaissees +=
                        Number(
                            membre.cotisation || 0
                        );

                    donsEncaisses +=
                        Number(
                            membre.don || 0
                        );

                }


                /* =========================================
                   ADHÉSIONS DE L'ANNÉE
                ========================================= */

                const anneeActuelle =
    new Date().getFullYear();


/* =========================================
   NOUVELLE ADHÉSION
========================================= */

if (
    membre.dateCreation
) {

    let dateCreation;


    if (
        typeof membre.dateCreation.toDate ===
        "function"
    ) {

        dateCreation =
            membre.dateCreation.toDate();

    }
    else {

        dateCreation =
            new Date(
                membre.dateCreation
            );

    }


    if (
        dateCreation.getFullYear() ===
        anneeActuelle
    ) {

        nouvellesAdhesions++;

    }

}


/* =========================================
   RENOUVELLEMENT
========================================= */

if (
    membre.dateRenouvellement
) {

    let dateRenouvellement;


    if (
        typeof membre.dateRenouvellement.toDate ===
        "function"
    ) {

        dateRenouvellement =
            membre.dateRenouvellement.toDate();

    }
    else {

        dateRenouvellement =
            new Date(
                membre.dateRenouvellement
            );

    }


    if (
        dateRenouvellement.getFullYear() ===
        anneeActuelle
    ) {

        renouvellements++;

    }

}

            }
        );


        /* =========================================
           TOTAL DES MEMBRES
        ========================================= */

        const totalMembres =
            membresActifs +
            membresExpires;


        /* =========================================
           TOTAL ENCAISSÉ
        ========================================= */

        const totalEncaisse =
            cotisationsEncaissees +
            donsEncaisses;


        /* =========================================
           MOYENNE PAR MEMBRE
        ========================================= */

        const moyenneParMembre =
            membresActifs > 0
                ? totalEncaisse / membresActifs
                : 0;


        /* =========================================
           AFFICHAGE
        ========================================= */

        afficherStatistique(
            "statMembresActifs",
            membresActifs
        );


        afficherStatistique(
            "statMembresExpires",
            membresExpires
        );


        afficherStatistique(
    "statPaiementsAttente",
    membresAttentePaiement
);


        afficherStatistique(
            "statTotalMembres",
            totalMembres
        );


        afficherStatistique(
            "statCotisations",
            formatEuro(
                cotisationsEncaissees
            )
        );


        afficherStatistique(
            "statDons",
            formatEuro(
                donsEncaisses
            )
        );


        afficherStatistique(
            "statTotalEncaisse",
            formatEuro(
                totalEncaisse
            )
        );


        afficherStatistique(
            "statMoyenne",
            formatEuro(
                moyenneParMembre
            )
        );


        afficherStatistique(
            "statNouvellesAdhesions",
            nouvellesAdhesions
        );


        afficherStatistique(
            "statRenouvellements",
            renouvellements
        );


        console.log(
            "Statistiques association :",
            {
                membresActifs,
                membresExpires,
                membresAttentePaiement,
                totalMembres,
                cotisationsEncaissees,
                donsEncaisses,
                totalEncaisse,
                moyenneParMembre,
                nouvellesAdhesions,
                renouvellements
            }
        );

    }
    catch (error) {

        console.error(
            "Erreur statistiques :",
            error
        );

    }

}


async function calculerFinances() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "paiements"
                )
            );


        let cotisations =
            0;

        let dons =
            0;

        let total =
            0;


        const anneeActuelle =
            new Date()
            .getFullYear();


        snapshot.forEach(
            (documentFirestore) => {

                const paiement =
                    documentFirestore.data();


                // =========================
                // ANNÉE DU PAIEMENT
                // =========================

                const annee =
                    Number(
                        paiement.annee
                    );


                // On ne prend que
                // les paiements de l'année
                // en cours

                if (
                    annee !==
                    anneeActuelle
                ) {

                    return;

                }


                // =========================
                // PAIEMENT CONFIRMÉ
                // =========================

                if (
                    paiement.stripePaymentStatus
                    &&
                    paiement.stripePaymentStatus
                    !==
                    "paid"
                ) {

                    return;

                }


                // =========================
                // COTISATION
                // =========================

                cotisations +=
                    Number(
                        paiement.cotisation
                        ||
                        0
                    );


                // =========================
                // DON
                // =========================

                dons +=
                    Number(
                        paiement.don
                        ||
                        0
                    );


                // =========================
                // TOTAL
                // =========================

                total +=
                    Number(
                        paiement.total
                        ||
                        0
                    );

            }
        );


        // =========================
        // AFFICHAGE
        // =========================

        const elementCotisations =
            document.getElementById(
                "statsCotisations"
            );

        const elementDons =
            document.getElementById(
                "statsDons"
            );

        const elementTotal =
            document.getElementById(
                "statsTotal"
            );


        if (
            elementCotisations
        ) {

            elementCotisations.textContent =
                cotisations.toFixed(2)
                +
                " €";

        }


        if (
            elementDons
        ) {

            elementDons.textContent =
                dons.toFixed(2)
                +
                " €";

        }


        if (
            elementTotal
        ) {

            elementTotal.textContent =
                total.toFixed(2)
                +
                " €";

        }


        console.log(
            "Finances "
            +
            anneeActuelle
            +
            ":",
            {
                cotisations,
                dons,
                total
            }
        );


    }
    catch (error) {

        console.error(
            "Erreur calcul finances :",
            error
        );

    }

}


/* =====================================================
   AFFICHAGE D'UNE STATISTIQUE
===================================================== */

function afficherStatistique(
    id,
    valeur
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        console.warn(
            `Élément #${id} introuvable`
        );

        return;

    }


    element.textContent =
        valeur;

}



/* =====================================================
   FORMAT EURO
===================================================== */

function formatEuro(
    montant
) {

    return Number(
        montant
    ).toLocaleString(
        "fr-FR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " €";

}


/* =====================================================
   GESTION DES ONGLETS
===================================================== */

onglets.forEach(
    onglet => {

        onglet.addEventListener(
            "click",
            () => {

                onglets.forEach(
                    autreOnglet => {

                        autreOnglet
                            .classList
                            .remove(
                                "actif"
                            );

                    }
                );


                onglet
                    .classList
                    .add(
                        "actif"
                    );


                statutActuel =
                    onglet.dataset.statut;


                chargerDemandes();

            }
        );

    }
);


function mettreAJourEnteteDemandes() {

    const entete =
        document.getElementById(
            "enteteDemandes"
        );

    if (!entete) {
        return;
    }

    entete.innerHTML = `

        <tr>

            <th>Nom</th>

            <th>Email</th>

            <th>Discord</th>

            <th>Total</th>

            <th>Statut</th>

            <th>Date de demande</th>

            <th>Action</th>

        </tr>

    `;
}



/* =====================================================
   CHARGEMENT DES DEMANDES
===================================================== */

async function chargerDemandes() {

    mettreAJourEnteteDemandes();

    listeDemandes.innerHTML =
        "Chargement des demandes...";

    try {

        let result;

       if (
    statutActuel === "toutes"
) {

    const q =
        query(
            collection(
                db,
                "adhesions"
            ),
            where(
                "statut",
                "!=",
                "acceptee"
            )
        );

    result =
        await getDocs(q);

}
        else {

            const q =
                query(
                    collection(
                        db,
                        "adhesions"
                    ),
                    where(
                        "statut",
                        "==",
                        statutActuel
                    )
                );

            result =
                await getDocs(q);

        }


        listeDemandes.innerHTML = "";


        if (
            result.empty
        ) {

            listeDemandes.innerHTML =
                "<p>Aucune demande dans cette catégorie.</p>";

            return;

        }


        result.forEach(
            documentFirestore => {

                const data =
                    documentFirestore.data();


                const dateEnvoi =
                    data.dateDemande
                        ? data.dateDemande
                            .toDate()
                            .toLocaleDateString(
                                "fr-FR"
                            )
                        : "-";


                const ligne =
                    document.createElement(
                        "tr"
                    );


                /* =========================================
                   ONGLET ACCEPTÉES
                ========================================= */

                if (
                    statutActuel === "acceptee"
                ) {

                    const dateAcceptation =
                        data.dateDecision
                            ? data.dateDecision
                                .toDate()
                                .toLocaleDateString(
                                    "fr-FR"
                                )
                            : "-";


                    ligne.innerHTML = `

                        <td>
                            ${data.prenom || ""}
                            ${data.nom || ""}
                        </td>

                        <td>
                            ${data.email || "-"}
                        </td>

                        <td>
                            ${data.discord || "-"}
                        </td>

                        <td>
                            ${dateEnvoi}
                        </td>

                        <td>
                            ${dateAcceptation}
                        </td>

                        <td>

                            <button
                                class="bouton-action voir-demande"
                                data-id="${documentFirestore.id}"
                            >
                                👁 Voir
                            </button>

                        </td>

                    `;

                }


                /* =========================================
                   AUTRES ONGLET
                ========================================= */

                else {

                    ligne.innerHTML = `

                        <td>
                            ${data.prenom || ""}
                            ${data.nom || ""}
                        </td>

                        <td>
                            ${data.email || "-"}
                        </td>

                        <td>
                            ${data.discord || "-"}
                        </td>

                        <td>
                            ${Number(
                                data.total || 0
                            ).toFixed(2)} €
                        </td>

                        <td>
                            ${data.statut || "-"}
                        </td>

                        <td>
                            ${dateEnvoi}
                        </td>

                        <td>

                            ${
                                data.statut === "en_attente"

                                ?

                                `
                                <button
                                    class="bouton-action accepter"
                                >
                                    ✅
                                </button>

                                <button
                                    class="bouton-refus refuser"
                                >
                                    ❌
                                </button>

                                <button
                                    class="bouton-action voir-demande"
                                    data-id="${documentFirestore.id}"
                                >
                                    👁 Voir
                                </button>
                                `

                                :

                                `
                                <button
                                    class="bouton-action voir-demande"
                                    data-id="${documentFirestore.id}"
                                >
                                    👁 Voir
                                </button>
                                `
                            }

                        </td>

                    `;

                }


                /* =========================================
                   AJOUT DE LA LIGNE
                ========================================= */

                listeDemandes.appendChild(
                    ligne
                );


                /* =========================================
                   BOUTON ACCEPTER
                ========================================= */

                const boutonAccepter =
                    ligne.querySelector(
                        ".accepter"
                    );


                if (
                    boutonAccepter
                ) {

                    boutonAccepter.addEventListener(
                        "click",
                        async () => {

                            if (
                                confirm(
                                    "Accepter cette demande ?"
                                )
                            ) {

                                await accepterAdhesion(
                                    documentFirestore.id,
                                    auth.currentUser
                                );

                            }

                        }
                    );

                }


                /* =========================================
                   BOUTON REFUSER
                ========================================= */

                const boutonRefuser =
                    ligne.querySelector(
                        ".refuser"
                    );


                if (
                    boutonRefuser
                ) {

                    boutonRefuser.addEventListener(
                        "click",
                        async () => {

                            if (
                                confirm(
                                    "Refuser cette demande ?"
                                )
                            ) {

                                await changerStatut(
                                    documentFirestore.id,
                                    "refusee",
                                    auth.currentUser
                                );

                            }

                        }
                    );

                }


                /* =========================================
                   BOUTON VOIR LA DEMANDE
                ========================================= */

                const boutonVoir =
                    ligne.querySelector(
                        ".voir-demande"
                    );


                if (
                    boutonVoir
                ) {

                    boutonVoir.addEventListener(
                        "click",
                        () => {

                            window.location.href =
                                `voir-adhesion.html?id=${documentFirestore.id}`;

                        }
                    );

                }

            }
        );

    }
    catch (error) {

        console.error(
            "Erreur lors du chargement des demandes :",
            error
        );


        listeDemandes.innerHTML =
            "<p>Impossible de charger les demandes.</p>";

    }

}



/* =====================================================
   DÉCONNEXION
===================================================== */

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





/* =====================================================
   ACCEPTER UNE ADHÉSION
===================================================== */

async function accepterAdhesion(
    id,
    utilisateur
) {

    try {

        const adhesionRef =
            doc(
                db,
                "adhesions",
                id
            );


        const adhesionSnap =
            await getDoc(
                adhesionRef
            );


        if (
            !adhesionSnap.exists()
        ) {

            alert(
                "Demande introuvable."
            );

            return;

        }


        const data =
            adhesionSnap.data();


        const reponse =
            await fetch(
                "https://chroma-stripe.max2501.workers.dev",
                {

                    method:
                        "POST",

                    headers:
                    {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            montant:
                                data.total,

                            email:
                                data.email,

                            adhesionId:
                                id

                        })

                }
            );


        const stripe =
            await reponse.json();


        if (
            !stripe.url
        ) {

            console.error(
                "Réponse Stripe :",
                stripe
            );


            alert(
                "Impossible de créer le paiement Stripe."
            );

            return;

        }


        await updateDoc(
            adhesionRef,
            {

                statut:
                    "acceptee",

                statutPaiement:
                    "en_attente",

                stripeSessionId:
                    stripe.sessionId,

                lienPaiement:
                    stripe.url,

                dateDecision:
                    serverTimestamp(),

                decisionParNom:
                    utilisateur.displayName
                    ||
                    utilisateur.email
                    ||
                    "Administrateur",

                decisionParEmail:
                    utilisateur.email
                    ||
                    ""

            }
        );


        window.location.href =
            stripe.url;

    }
    catch (error) {

        console.error(
            "Erreur acceptation :",
            error
        );


        alert(
            "Erreur lors de l'acceptation."
        );

    }

}



/* =====================================================
   CHANGER STATUT
===================================================== */

async function changerStatut(
    id,
    nouveauStatut,
    utilisateur
) {

    try {

        const demande =
            doc(
                db,
                "adhesions",
                id
            );


        const nomDecisionnaire =
            utilisateur.displayName
            ||
            utilisateur.email
            ||
            "Administrateur non identifié";


        await updateDoc(
            demande,
            {

                statut:
                    nouveauStatut,

                statutPaiement:
                    nouveauStatut === "acceptee"
                        ? "en_attente"
                        : "non_concerne",

                dateDecision:
                    serverTimestamp(),

                decisionParNom:
                    nomDecisionnaire,

                decisionParEmail:
                    utilisateur.email
                    || "",

                decisionParUid:
                    utilisateur.uid

            }
        );




        await chargerDemandes();

    }
    catch (error) {

        console.error(
            "Erreur lors de la décision :",
            error
        );


        alert(
            "La décision n’a pas pu être enregistrée."
        );

    }

}
