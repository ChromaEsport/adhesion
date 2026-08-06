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
    doc,
    getDoc,
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

const form =
    document.getElementById(
        "formModifier"
    );

const message =
    document.getElementById(
        "message"
    );

const logout =
    document.getElementById(
        "logout"
    );

const titre =
    document.getElementById(
        "titrePage"
    );

const params =
    new URLSearchParams(
        window.location.search
    );

const id =
    params.get(
        "id"
    );

onAuthStateChanged(
    auth,
    (user)=>{

        if(!user){

            window.location.href =
                "index.html";

            return;

        }

        chargerMembre();

    }
);

async function chargerMembre(){


    if(!id){

        message.textContent =
            "Aucun membre sélectionné.";

        return;

    }


    const membreRef =
        doc(
            db,
            "membres",
            id
        );


    const membreDoc =
        await getDoc(
            membreRef
        );


    if(!membreDoc.exists()){

        message.textContent =
            "Membre introuvable.";

        return;

    }


    const membre =
        membreDoc.data();


    titre.textContent =

        "Modification - "
        +
        (
            membre.numeroMembre
            ||
            ""
        );


    document.getElementById(
        "prenom"
    ).value =
        membre.prenom
        ||
        "";


    document.getElementById(
        "nom"
    ).value =
        membre.nom
        ||
        "";


    document.getElementById(
        "dateNaissance"
    ).value =
        membre.dateNaissance
        ||
        "";


    document.getElementById(
        "email"
    ).value =
        membre.email
        ||
        "";


    document.getElementById(
        "discord"
    ).value =
        membre.discord
        ||
        "";


    document.getElementById(
        "adresse"
    ).value =
        membre.adresse
        ||
        "";


    document.getElementById(
        "complementAdresse"
    ).value =
        membre.complementAdresse
        ||
        "";


    document.getElementById(
        "codePostal"
    ).value =
        membre.codePostal
        ||
        "";


    document.getElementById(
        "ville"
    ).value =
        membre.ville
        ||
        "";


    document.getElementById(
        "pays"
    ).value =
        membre.pays
        ||
        "";


    document.getElementById(
        "cotisation"
    ).value =
        membre.cotisation
        ||
        0;


    document.getElementById(
        "don"
    ).value =
        membre.don
        ||
        0;


    document.getElementById(
        "statutMembre"
    ).value =
        membre.statutMembre
        ||
        "adherent";


    document.getElementById(
        "statutPaiement"
    ).value =
        membre.statutPaiement
        ||
        "en_attente";


    document.getElementById(
        "statutAdhesion"
    ).value =
        membre.statutAdhesion
        ||
        "non_active";

}

form.addEventListener(
"submit",
async(e)=>{

    e.preventDefault();


    try{


        const cotisation =
            Number(
                document.getElementById(
                    "cotisation"
                ).value
            );


        const don =
            Number(
                document.getElementById(
                    "don"
                ).value
            );


        await updateDoc(

            doc(
                db,
                "membres",
                id
            ),

            {

                prenom:

                    document.getElementById(
                        "prenom"
                    ).value,

                nom:

                    document.getElementById(
                        "nom"
                    ).value,

                dateNaissance:

                    document.getElementById(
                        "dateNaissance"
                    ).value,

                email:

                    document.getElementById(
                        "email"
                    ).value,

                discord:

                    document.getElementById(
                        "discord"
                    ).value,

                adresse:

                    document.getElementById(
                        "adresse"
                    ).value,

                complementAdresse:

                    document.getElementById(
                        "complementAdresse"
                    ).value,

                codePostal:

                    document.getElementById(
                        "codePostal"
                    ).value,

                ville:

                    document.getElementById(
                        "ville"
                    ).value,

                pays:

                    document.getElementById(
                        "pays"
                    ).value,

                cotisation:
                    cotisation,

                don:
                    don,

                total:
                    cotisation
                    +
                    don,

                statutMembre:

                    document.getElementById(
                        "statutMembre"
                    ).value,

                statutPaiement:

                    document.getElementById(
                        "statutPaiement"
                    ).value,

                statutAdhesion:

                    document.getElementById(
                        "statutAdhesion"
                    ).value

            }

        );


        message.style.color =
            "#8fecc9";


        message.textContent =
            "Membre modifié avec succès.";


        setTimeout(
            ()=>{

                window.location.href =
                    "fiche-membre.html?id="
                    +
                    id;

            },
            1200
        );


    }

    catch(error){

        console.error(error);

        message.style.color =
            "#ff5b6e";

        message.textContent =
            "Erreur lors de la modification.";

    }

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
