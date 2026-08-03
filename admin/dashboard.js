
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




// Chargement Firestore

async function chargerDemandes(){


    const q =
        query(
            collection(
                db,
                "adhesions"
            ),
            where(
                "statut",
                "==",
                "en_attente"
            )
        );



    const result =
        await getDocs(q);



    listeDemandes.innerHTML = "";



    if(result.empty){


        listeDemandes.innerHTML =
        "<p>Aucune demande en attente.</p>";


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



            bloc.innerHTML = `

                <h3>
                ${data.prenom} ${data.nom}
                </h3>

                <p>
                Discord :
                ${data.discord}
                </p>

                <p>
                Email :
                ${data.email}
                </p>

                <p>
                Cotisation :
                ${data.cotisation} €
                </p>

                <p>
                Don :
                ${data.don} €
                </p>

                <p>
                Total :
                ${data.total} €
                </p>

            `;



            listeDemandes.appendChild(
                bloc
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

