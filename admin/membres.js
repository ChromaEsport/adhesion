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
query,
where,
doc,
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
initializeApp(firebaseConfig);


const auth =
getAuth(app);


const db =
getFirestore(app);



const listeMembres =
document.getElementById(
"listeMembres"
);


const recherche =
document.getElementById(
"rechercheMembre"
);


const logout =
document.getElementById(
"logout"
);


const onglets =
document.querySelectorAll(
".onglet"
);



let filtreActuel =
"en_attente_paiement";


let membres = [];





onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "index.html";

            return;

        }

      

        filtreActuel =
            "en_attente_paiement";

        onglets.forEach(
            onglet => {

                onglet.classList.remove(
                    "actif"
                );

                if (
                    onglet.dataset.filtre ===
                    "en_attente_paiement"
                ) {

                    onglet.classList.add(
                        "actif"
                    );

                }

            }
        );
        
        await chargerStatistiques();
        await chargerMembres();

    }
);





onglets.forEach(
onglet=>{


onglet.addEventListener(
"click",
()=>{


onglets.forEach(
o=>o.classList.remove(
"actif"
)
);


onglet.classList.add(
"actif"
);



filtreActuel =
onglet.dataset.filtre;



chargerMembres();



}
);


}
);


async function chargerStatistiques() {

    try {

        // =====================================================
        // RÉCUPÉRATION DES MEMBRES
        // =====================================================

        const snapshotMembres =
            await getDocs(
                collection(
                    db,
                    "membres"
                )
            );


        const membresFirestore = [];


        snapshotMembres.forEach(
            documentFirestore => {

                membresFirestore.push({

                    id:
                        documentFirestore.id,

                    ...documentFirestore.data()

                });

            }
        );


        // =====================================================
        // RÉCUPÉRATION DES ADHÉSIONS EN ATTENTE DE PAIEMENT
        // =====================================================

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


        // =====================================================
        // DATE ACTUELLE
        // =====================================================

        const aujourdHui =
            new Date();


        aujourdHui.setHours(
            0,
            0,
            0,
            0
        );


        const anneeActuelle =
            new Date().getFullYear();


        // =====================================================
        // COMPTEURS
        // =====================================================

        let membresActifs = 0;

        let membresExpires = 0;

        let membresAttentePaiement =
            snapshotAdhesions.size;

        let cotisationsEncaissees = 0;

        let donsEncaisses = 0;

        let nouvellesAdhesions = 0;

        let renouvellements = 0;


        // =====================================================
        // ANALYSE DES MEMBRES
        // =====================================================

        membresFirestore.forEach(
            membre => {


                // =================================================
                // DATE DE FIN D'ADHÉSION
                // =================================================

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


                // =================================================
                // MEMBRE ACTIF
                // =================================================

                if (
                    !adhesionExpiree &&
                    membre.statutPaiement ===
                    "paye"
                ) {

                    membresActifs++;

                }


                // =================================================
                // MEMBRE EXPIRÉ
                // =================================================

                if (
                    adhesionExpiree
                ) {

                    membresExpires++;

                }


                // =================================================
                // FINANCES
                // =================================================

                if (
                    membre.statutPaiement ===
                    "paye"
                ) {

                    cotisationsEncaissees +=
                        Number(
                            membre.cotisation ||
                            0
                        );


                    donsEncaisses +=
                        Number(
                            membre.don ||
                            0
                        );

                }


                // =================================================
                // NOUVELLE ADHÉSION
                // =================================================

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


                // =================================================
                // RENOUVELLEMENT
                // =================================================

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


        // =====================================================
        // TOTAL DES MEMBRES
        // =====================================================

        const totalMembres =
            membresActifs +
            membresExpires +
        


        // =====================================================
        // TOTAL ENCAISSÉ
        // =====================================================

        const totalEncaisse =
            cotisationsEncaissees +
            donsEncaisses;


        // =====================================================
        // MOYENNE PAR MEMBRE
        // =====================================================

        const moyenneParMembre =
            membresActifs > 0
                ? totalEncaisse /
                  membresActifs
                : 0;


        // =====================================================
        // AFFICHAGE
        // =====================================================

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
            "statMoyenneMembre",
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
            "Statistiques membres :",
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
            "Erreur chargement statistiques :",
            error
        );

    }

}

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


async function chargerMembres() {

    listeMembres.innerHTML = "Chargement...";

    try {

        /* =========================================
           EN ATTENTE DE PAIEMENT
           → COLLECTION adhesions
        ========================================= */

        if (filtreActuel === "en_attente_paiement") {

            const q = query(
                collection(db, "adhesions"),
                where("statut", "==", "acceptee"),
                where("statutPaiement", "==", "en_attente")
            );

            const resultat = await getDocs(q);

            membres = [];

            resultat.forEach(documentFirestore => {

                membres.push({
                    id: documentFirestore.id,
                    ...documentFirestore.data()
                });

            });

            afficherMembres(membres);

            return;
        }


        /* =========================================
           TOUS
           → COLLECTION membres
        ========================================= */

        if (filtreActuel === "tous") {

            const resultat = await getDocs(
                collection(db, "membres")
            );

            membres = [];

            resultat.forEach(documentFirestore => {

                membres.push({
                    id: documentFirestore.id,
                    ...documentFirestore.data()
                });

            });

            afficherMembres(membres);

            return;
        }


        /* =========================================
           MEMBRES ACTIFS
           → COLLECTION membres
        ========================================= */

        if (filtreActuel === "active") {

            const resultat = await getDocs(
                collection(db, "membres")
            );

            membres = [];

            resultat.forEach(documentFirestore => {

                const membre = {
                    id: documentFirestore.id,
                    ...documentFirestore.data()
                };

                if (!adhesionEstExpiree(membre)) {

                    membres.push(membre);

                }

            });

            afficherMembres(membres);

            return;
        }


        /* =========================================
           MEMBRES EXPIRÉS
           → COLLECTION membres
        ========================================= */

        if (filtreActuel === "expiree") {

            const resultat = await getDocs(
                collection(db, "membres")
            );

            membres = [];

            resultat.forEach(documentFirestore => {

                const membre = {
                    id: documentFirestore.id,
                    ...documentFirestore.data()
                };

                if (adhesionEstExpiree(membre)) {

                    membres.push(membre);

                }

            });

            afficherMembres(membres);

            return;
        }


    }
    catch (error) {

        console.error(
            "Erreur chargement membres :",
            error
        );

        listeMembres.innerHTML =
            "<p>Impossible de charger les membres.</p>";

    }

}



function adhesionEstExpiree(membre){

    if(!membre.dateFinAdhesion){
        return false;
    }


    const dateFin = new Date(
        membre.dateFinAdhesion
    );


    const aujourdHui = new Date();


    aujourdHui.setHours(
        0,
        0,
        0,
        0
    );


    return dateFin < aujourdHui;

}


function afficherMembres(liste) {

    listeMembres.innerHTML = "";

    if (liste.length === 0) {

        listeMembres.innerHTML =
            `<tr>
                <td colspan="8">
                    Aucun membre trouvé.
                </td>
            </tr>`;

        return;
    }


    liste.forEach(membre => {

        const estEnAttentePaiement =
            filtreActuel === "en_attente_paiement";


        const statutAdhesionAffiche =
            adhesionEstExpiree(membre)
                ? "expiree"
                : membre.statutAdhesion;


        const statutPaiementAffiche =
            adhesionEstExpiree(membre)
                ? "en_attente"
                : membre.statutPaiement;


        const ligne =
            document.createElement("tr");


        let actions = "";


        /* =========================================
           EN ATTENTE DE PAIEMENT
        ========================================= */

        if (estEnAttentePaiement) {

            actions = `

                <button
                    class="voir-demande"
                    data-id="${membre.id}"
                >
                    Voir demande
                </button>

                <button
                    class="renvoyer-paiement"
                    data-id="${membre.id}"
                >
                    Renvoyer le lien du paiement
                </button>

            `;

        }


        /* =========================================
           MEMBRES
        ========================================= */

        else {

            actions = `

                <button
                    class="voir"
                    data-id="${membre.id}"
                >
                    👤 Voir
                </button>

                <button
                    class="modifier"
                    data-id="${membre.id}"
                >
                    ✏️ Modifier
                </button>

            `;

        }


        ligne.innerHTML = `

            <td>
                ${membre.numeroMembre || "-"}
            </td>

            <td>
                ${membre.prenom || ""}
            </td>

            <td>
                ${membre.nom || ""}
            </td>

            <td>
                ${membre.discord || "-"}
            </td>

            <td>
                ${statutPaiementAffiche || "-"}
            </td>

            <td>
                ${statutAdhesionAffiche || "-"}
            </td>

            <td>
                ${membre.statutMembre || "-"}
            </td>

            <td>
                ${actions}
            </td>

        `;


        listeMembres.appendChild(ligne);


        /* =========================================
           VOIR DEMANDE
        ========================================= */

        const boutonVoirDemande =
            ligne.querySelector(".voir-demande");


        if (boutonVoirDemande) {

            boutonVoirDemande.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "voir-adhesion.html?id="
                        +
                        membre.id;

                }
            );

        }


        /* =========================================
           RENVOYER PAIEMENT
           → sera branché à Stripe ensuite
        ========================================= */

        const boutonRenvoyerPaiement =
    ligne.querySelector(".renvoyer-paiement");


if (boutonRenvoyerPaiement) {

    boutonRenvoyerPaiement.addEventListener(
        "click",
        () => {

            if (!membre.lienPaiement) {

                alert(
                    "Aucun lien de paiement disponible pour cette demande."
                );

                return;

            }


            window.location.href =
                membre.lienPaiement;

        }
    );

}


        /* =========================================
           VOIR MEMBRE
        ========================================= */

        const boutonVoir =
            ligne.querySelector(".voir");


        if (boutonVoir) {

            boutonVoir.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "fiche-membre.html?id="
                        +
                        membre.id;

                }
            );

        }


        /* =========================================
           MODIFIER MEMBRE
        ========================================= */

        const boutonModifier =
            ligne.querySelector(".modifier");


        if (boutonModifier) {

            boutonModifier.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "modifier-membre.html?id="
                        +
                        membre.id;

                }
            );

        }

    });

}





recherche.addEventListener(
"input",
()=>{


const texte =
recherche.value
.toLowerCase();



const resultat =
membres.filter(
m=>{


return (

(m.nom || "")
.toLowerCase()
.includes(texte)

||

(m.prenom || "")
.toLowerCase()
.includes(texte)

||

(m.discord || "")
.toLowerCase()
.includes(texte)

||

(m.numeroMembre || "")
.toLowerCase()
.includes(texte)

);


}
);



afficherMembres(
resultat
);


}
);





logout.addEventListener(
"click",
async()=>{


await signOut(auth);


window.location.href =
"index.html";


}
);
