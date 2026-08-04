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
    where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



/* =========================
   CONFIGURATION FIREBASE
========================= */

const firebaseConfig = {

    apiKey: "AIzaSyAedIKW_LRWLpa9V_t7PcTTbrDmQOj4HAo",
  authDomain: "chroma-adhesion.firebaseapp.com",
  projectId: "chroma-adhesion",
  storageBucket: "chroma-adhesion.firebasestorage.app",
  messagingSenderId: "892582501197",
  appId: "1:892582501197:web:2483ffc9c98e47a3d17504",

};

const rechercheMembre =
    document.getElementById(
        "rechercheMembre"
    );

const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(app);


const db =
    getFirestore(app);



/* =========================
   ÉLÉMENTS HTML
========================= */

const listeMembres =
    document.getElementById(
        "listeMembres"
    );


const logout =
    document.getElementById(
        "logout"
    );


const onglets =
    document.querySelectorAll(
        ".onglet"
    );



/* =========================
   FILTRE ACTUEL
========================= */

let filtreActuel =
    "en_attente_paiement";

let listeCompleteMembres = [];

/* =========================
   VÉRIFICATION CONNEXION
========================= */

onAuthStateChanged(
    auth,
    (user) => {


        if (
            !user
        ) {

            window.location.href =
                "index.html";


            return;

        }


        chargerMembres();


    }
);



/* =========================
   GESTION DES ONGLETS
========================= */

onglets.forEach(
    (onglet) => {


        onglet.addEventListener(
            "click",
            () => {


                /*
                Retire la classe active
                des autres onglets
                */

                onglets.forEach(
                    (autreOnglet) => {


                        autreOnglet
                        .classList
                        .remove(
                            "actif"
                        );


                    }
                );


                /*
                Active l'onglet cliqué
                */

                onglet
                .classList
                .add(
                    "actif"
                );


                /*
                Récupère le filtre
                */

                filtreActuel =
                    onglet.dataset.filtre;


                /*
                Recharge les membres
                */

                chargerMembres();


            }
        );


    }
);



/* =========================
   CHARGEMENT DES MEMBRES
========================= */

async function chargerMembres() {


    listeMembres.innerHTML =
        "Chargement des membres...";


    try {


        let resultat;



        /*
        ONGLET TOUS

        Aucun filtre :
        tous les membres sont affichés.
        */

        if (
            filtreActuel ===
            "tous"
        ) {


            resultat =
                await getDocs(
                    collection(
                        db,
                        "membres"
                    )
                );


        }



        /*
        EN ATTENTE DE PAIEMENT
        */

        else if (
            filtreActuel ===
            "en_attente_paiement"
        ) {


            const requete =

                query(

                    collection(
                        db,
                        "membres"
                    ),

                    where(

                        "statutPaiement",

                        "==",

                        "en_attente"

                    )

                );


            resultat =
                await getDocs(
                    requete
                );


        }



        /*
        ADHÉSIONS ACTIVES
        */

        else if (
            filtreActuel ===
            "active"
        ) {


            const requete =

                query(

                    collection(
                        db,
                        "membres"
                    ),

                    where(

                        "statutAdhesion",

                        "==",

                        "active"

                    )

                );


            resultat =
                await getDocs(
                    requete
                );


        }



        /*
        ADHÉSIONS EXPIRÉES
        */

        else if (
            filtreActuel ===
            "expiree"
        ) {


            const requete =

                query(

                    collection(
                        db,
                        "membres"
                    ),

                    where(

                        "statutAdhesion",

                        "==",

                        "expiree"

                    )

                );


            resultat =
                await getDocs(
                    requete
                );


        }



        /*
        Vide la liste avant
        le nouvel affichage
        */

        listeMembres.innerHTML =
            "";



        /*
        Aucun résultat
        */

        if (
            resultat.empty
        ) {


            listeMembres.innerHTML =

                "<p>Aucun membre dans cette catégorie.</p>";


            return;


        }



        /*
        Création d'une fiche
        pour chaque membre
        */

        listeCompleteMembres = [];


resultat.forEach(
    (documentMembre)=>{

        listeCompleteMembres.push({

            id:
                documentMembre.id,

            ...documentMembre.data()

        });

        
        resultat.forEach(
            (documentMembre) => {


                const membre =

                    documentMembre.data();



                const fiche =

                    document.createElement(
                        "div"
                    );


                fiche.className =
                    "demande membre";



                /*
                Date de création
                */

                const dateCreation =

                    membre.dateCreation

                    ?

                    membre
                    .dateCreation
                    .toDate()
                    .toLocaleString(

                        "fr-FR",

                        {

                            dateStyle:
                                "long",

                            timeStyle:
                                "short"

                        }

                    )

                    :

                    "Non renseignée";



                /*
                Date d'acceptation
                */

                const dateAcceptation =

                    membre.dateAcceptation

                    ?

                    membre
                    .dateAcceptation
                    .toDate()
                    .toLocaleString(

                        "fr-FR",

                        {

                            dateStyle:
                                "long",

                            timeStyle:
                                "short"

                        }

                    )

                    :

                    "Non renseignée";



                /*
                Contenu de la fiche
                */

                fiche.innerHTML = `


                    <h3>

                        ${
                            membre.prenom
                            ||
                            ""
                        }

                        ${
                            membre.nom
                            ||
                            ""
                        }

                    </h3>



                    <div class="information">

                        <strong>

                            E-mail :

                        </strong>


                        <span>

                            ${
                                membre.email
                                ||
                                "Non renseigné"
                            }

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Discord :

                        </strong>


                        <span>

                            ${
                                membre.discord
                                ||
                                "Non renseigné"
                            }

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Année d’adhésion :

                        </strong>


                        <span>

                            ${
                                membre.annee
                                ||
                                "Non renseignée"
                            }

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Cotisation :

                        </strong>


                        <span>

                            ${
                                Number(

                                    membre.cotisation
                                    ||
                                    0

                                )
                                .toFixed(2)
                            }

                            €

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Don :

                        </strong>


                        <span>

                            ${
                                Number(

                                    membre.don
                                    ||
                                    0

                                )
                                .toFixed(2)
                            }

                            €

                        </span>

                    </div>



                    <div class="information total">

                        <strong>

                            Total :

                        </strong>


                        <span>

                            ${
                                Number(

                                    membre.total
                                    ||
                                    0

                                )
                                .toFixed(2)
                            }

                            €

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Statut du membre :

                        </strong>


                        <span>

                            ${
                                membre.statutMembre
                                ||
                                "Non renseigné"
                            }

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Statut du paiement :

                        </strong>


                        <span>

                            ${
                                membre.statutPaiement
                                ||
                                "Non renseigné"
                            }

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Statut de l’adhésion :

                        </strong>


                        <span>

                            ${
                                membre.statutAdhesion
                                ||
                                "Non renseigné"
                            }

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Accepté par :

                        </strong>


                        <span>

                            ${
                                membre.accepteParNom
                                ||
                                "Non renseigné"
                            }

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Date d’acceptation :

                        </strong>


                        <span>

                            ${dateAcceptation}

                        </span>

                    </div>



                    <div class="information">

                        <strong>

                            Fiche membre créée le :

                        </strong>


                        <span>

                            ${dateCreation}

                        </span>

                    </div>

                    <button
    class="voir-membre"
    data-id="${documentMembre.id}"
>
    👤 Voir la fiche complète
</button>


                `;



                /*
                Ajout de la fiche
                */

                listeMembres
                .appendChild(
                    fiche
                );

                const bouton =
    fiche.querySelector(
        ".voir-membre"
    );


bouton.addEventListener(
    "click",
    ()=>{

        window.location.href =
        "fiche-membre.html?id="
        +
        documentMembre.id;

    }
);
            }
        );


    }
    catch (error) {


        console.error(

            "Erreur lors du chargement des membres :",

            error

        );


        listeMembres.innerHTML =

            "<p>Impossible de charger les membres.</p>";


    }


}



/* =========================
   DÉCONNEXION
========================= */

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


function rechercherMembres(){


    const recherche =

        rechercheMembre.value
        .toLowerCase()
        .trim();



    const fiches =

        document.querySelectorAll(
            ".membre"
        );



    fiches.forEach(
        (fiche)=>{


            const texte =

                fiche.textContent
                .toLowerCase();



            if(
                texte.includes(
                    recherche
                )
            ){

                fiche.style.display =
                    "block";

            }

            else {

                fiche.style.display =
                    "none";

            }


        }
    );


}

rechercheMembre.addEventListener(
    "input",
    rechercherMembres
);
