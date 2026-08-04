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
    getDoc
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



const ficheMembre =
    document.getElementById(
        "ficheMembre"
    );


const titreMembre =
    document.getElementById(
        "titreMembre"
    );


const logout =
    document.getElementById(
        "logout"
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


    const parametre =
        new URLSearchParams(
            window.location.search
        );


    const id =
        parametre.get(
            "id"
        );


    if(!id){

        ficheMembre.innerHTML =
        "Aucun membre sélectionné.";

        return;

    }



    const membreRef =
        doc(
            db,
            "membres",
            id
        );



    const resultat =
        await getDoc(
            membreRef
        );



    if(!resultat.exists()){


        ficheMembre.innerHTML =
        "Membre introuvable.";

        return;

    }



    const membre =
        resultat.data();



    titreMembre.innerHTML =

        membre.numeroMembre
        ||
        "Fiche membre";



    ficheMembre.innerHTML = `


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



        <p>
            <strong>
            Numéro membre :
            </strong>

            ${
                membre.numeroMembre
                ||
                "Non défini"
            }

        </p>



        <p>
            <strong>
            Email :
            </strong>

            ${
                membre.email
                ||
                ""
            }

        </p>



        <p>
            <strong>
            Discord :
            </strong>

            ${
                membre.discord
                ||
                ""
            }

        </p>



        <p>
            <strong>
            Statut membre :
            </strong>

            ${
                membre.statutMembre
                ||
                ""
            }

        </p>



        <p>
            <strong>
            Paiement :
            </strong>

            ${
                membre.statutPaiement
                ||
                ""
            }

        </p>



        <p>
            <strong>
            Adhésion :
            </strong>

            ${
                membre.statutAdhesion
                ||
                ""
            }

        </p>



    `;

}



logout.addEventListener(
    "click",
    ()=>{

        signOut(auth);

        window.location.href =
        "index.html";

    }
);
