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
    updateDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const firebaseConfig = {

    apiKey: "AIzaSyAedIKW_LRWLpa9V_t7PcTTbrDmQOj4HAo",
  authDomain: "chroma-adhesion.firebaseapp.com",
  projectId: "chroma-adhesion",
  storageBucket: "chroma-adhesion.firebasestorage.app",
  messagingSenderId: "892582501197",
  appId: "1:892582501197:web:2483ffc9c98e47a3d17504"

};



const app = initializeApp(firebaseConfig);


const auth = getAuth(app);


const db = getFirestore(app);



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


// Vérification connexion

onAuthStateChanged(
    auth,
    (user)=>{


        if(!user){

            window.location.href =
            "index.html";

            return;

        }


        chargerDemandes();


    }
);

onglets.forEach(
    (onglet) => {

        onglet.addEventListener(
            "click",
            () => {

                onglets.forEach(
                    (autreOnglet) => {

                        autreOnglet.classList.remove(
                            "actif"
                        );

                    }
                );


                onglet.classList.add(
                    "actif"
                );


                statutActuel =
                    onglet.dataset.statut;


                chargerDemandes();

            }
        );

    }
);


// Chargement Firestore

async function chargerDemandes() {


    listeDemandes.innerHTML =
        "Chargement des demandes...";


    let q;


    if (
        statutActuel === "toutes"
    ) {

        q =
            collection(
                db,
                "adhesions"
            );

    }
    else {

        q =
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

    }


    const result =
        await getDocs(q);



    listeDemandes.innerHTML = "";



    if(result.empty){


       listeDemandes.innerHTML =
    "<p>Aucune demande dans cette catégorie.</p>";


        return;

    }



    result.forEach(
        (doc)=>{


            const data =
            doc.data();



            const bloc =
            document.createElement(
                "div"
            );



            bloc.className =
            "demande";



            const dateEnvoi = data.dateDemande
    ? data.dateDemande.toDate().toLocaleString(
        "fr-FR",
        {
            dateStyle: "long",
            timeStyle: "short"
        }
    )
    : "Date en cours d’enregistrement";


const boutonsDecision =
    data.statut === "en_attente"

    ? `

        <div class="actions">

            <button class="accepter">

                ✅ Accepter

            </button>

            <button class="refuser">

                ❌ Refuser

            </button>

        </div>

    `

    : "";
            
bloc.innerHTML = `

    <h3>
        ${data.prenom || ""}
        ${data.nom || ""}
    </h3>


    <div class="information">

        <strong>
            Date de naissance :
        </strong>

        <span>
            ${data.dateNaissance || "Non renseignée"}
        </span>

    </div>


    <div class="information">

        <strong>
            E-mail :
        </strong>

        <span>
            ${data.email || "Non renseigné"}
        </span>

    </div>


    <div class="information">

        <strong>
            Discord :
        </strong>

        <span>
            ${data.discord || "Non renseigné"}
        </span>

    </div>


    <div class="information">

        <strong>
            Année d’adhésion :
        </strong>

        <span>
            ${data.annee || "Non renseignée"}
        </span>

    </div>


    <div class="information">

        <strong>
            Cotisation :
        </strong>

        <span>
            ${Number(
                data.cotisation || 0
            ).toFixed(2)} €
        </span>

    </div>


    <div class="information">

        <strong>
            Don :
        </strong>

        <span>
            ${Number(
                data.don || 0
            ).toFixed(2)} €
        </span>

    </div>


    <div class="information total">

        <strong>
            Total à payer :
        </strong>

        <span>
            ${Number(
                data.total || 0
            ).toFixed(2)} €
        </span>

    </div>


    <div class="information">

        <strong>
            Statut :
        </strong>

        <span>
            ${data.statut || "Non renseigné"}
        </span>

    </div>


    <div class="information">

        <strong>
            Demande envoyée le :
        </strong>

        <span>
            ${dateEnvoi}
        </span>

    </div>
${
    data.dateDecision

    ? `

        <div class="information">

            <strong>
                Décision prise le :
            </strong>

            <span>

                ${
                    data
                    .dateDecision
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
                }

            </span>

        </div>


        <div class="information">

            <strong>
                Décision par :
            </strong>

            <span>

                ${
                    data.decisionParNom
                    ||
                    "Non renseigné"
                }

            </span>

        </div>

    `

    : ""
}

   ${boutonsDecision}

`;



            listeDemandes.appendChild(
                bloc
            );


const boutonAccepter =
    bloc.querySelector(".accepter");

const boutonRefuser =
    bloc.querySelector(".refuser");


// Les boutons existent uniquement
// pour les demandes en attente

if (
    boutonAccepter
    &&
    boutonRefuser
) {

    boutonAccepter.addEventListener(
        "click",
        async () => {

            const confirmation =
                confirm(
                    "Confirmer l’acceptation de cette demande ?"
                );

            if (!confirmation) {

                return;

            }

            await changerStatut(
                doc.id,
                "acceptee",
                auth.currentUser
            );

        }
    );


    boutonRefuser.addEventListener(
        "click",
        async () => {

            const confirmation =
                confirm(
                    "Confirmer le refus de cette demande ?"
                );

            if (!confirmation) {

                return;

            }

            await changerStatut(
                doc.id,
                "refusee",
                auth.currentUser
            );

        }
    );

}


logout.addEventListener(
    "click",
    ()=>{

        signOut(auth);

        window.location.href =
        "index.html";

    }
);

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
