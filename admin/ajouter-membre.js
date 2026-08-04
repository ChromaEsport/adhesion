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
    addDoc,
    serverTimestamp,
    doc,
    runTransaction
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const firebaseConfig = {

    apiKey: "AIzaSyAedIKW_LRWLpa9V_t7PcTTbrDmQOj4HAo",

    authDomain: "chroma-adhesion.firebaseapp.com",

    projectId: "chroma-adhesion",

    storageBucket: "chroma-adhesion.firebasestorage.app",

    messagingSenderId: "892582501197",

    appId: "1:892582501197:web:2483ffc9c98e47a3d17504"

};



const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(app);


const db =
    getFirestore(app);



const form =
    document.getElementById(
        "formAjoutMembre"
    );


const message =
    document.getElementById(
        "message"
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

    }
);



/*
 Génération numéro membre
*/

async function obtenirProchainNumeroMembre(){


    const compteurRef =

        doc(
            db,
            "compteurs",
            "membres"
        );



    const prochainNumero =

        await runTransaction(

            db,

            async (
                transaction
            ) => {


                const compteur =

                    await transaction.get(
                        compteurRef
                    );



                let nouveauNumero =

                    1;



                if(
                    compteur.exists()
                ){


                    nouveauNumero =

                        Number(

                            compteur
                            .data()
                            .dernierNumero

                            ||

                            0

                        )

                        +

                        1;


                }



                transaction.set(

                    compteurRef,

                    {

                        dernierNumero:

                            nouveauNumero

                    },

                    {

                        merge:

                            true

                    }

                );



                return nouveauNumero;


            }

        );

 return prochainNumero;


}

function genererNumeroMembre(
    annee,
    numero
){

    return (

        "CHRO-"
        +
        annee
        +
        "-"
        +
        numero
        .toString()
        .padStart(
            4,
            "0"
        )

    );

}



/*
 Calcul automatique du total
*/


const cotisation =
    document.getElementById(
        "cotisation"
    );


const don =
    document.getElementById(
        "don"
    );


const total =
    document.getElementById(
        "total"
    );


function calculerTotal(){


    total.value =

        Number(
            cotisation.value
            ||
            0
        )
        +

        Number(
            don.value
            ||
            0
        );


}


cotisation.addEventListener(
    "input",
    calculerTotal
);


don.addEventListener(
    "input",
    calculerTotal
);



/*
 Création du membre
*/


form.addEventListener(
    "submit",
    async(e)=>{


        e.preventDefault();



        try {



            const annee =

                document.getElementById(
                    "annee"
                ).value;



            const numero =

                await obtenirProchainNumeroMembre();



            const numeroMembre =

                genererNumeroMembre(
                    annee,
                    numero
                );



            await addDoc(
                collection(
                    db,
                    "membres"
                ),
                {


                    numeroMembre:


                        numeroMembre,



                    nom:

                        document.getElementById(
                            "nom"
                        ).value,



                    prenom:

                        document.getElementById(
                            "prenom"
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



                    annee:

                        Number(
                            annee
                        ),



                    dateDebutAdhesion:

                        document.getElementById(
                            "dateDebutAdhesion"
                        ).value,



                    dateFinAdhesion:

                        document.getElementById(
                            "dateFinAdhesion"
                        ).value,



                    cotisation:

                        Number(
                            cotisation.value
                        ),



                    don:

                        Number(
                            don.value
                        ),



                    total:

                        Number(
                            total.value
                        ),



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
                        ).value,

accepteParNom:

    auth.currentUser.displayName
    ||
    auth.currentUser.email
    ||
    "Administrateur non identifié",


accepteParEmail:

    auth.currentUser.email
    ||
    "",


accepteParUid:

    auth.currentUser.uid,


dateAcceptation:

    serverTimestamp(),

                    dateCreation:

                        serverTimestamp(),



                    ajoutManuel:

                        true



                }

            );



            message.innerHTML =

                "✅ Membre créé avec succès : "
                +
                numeroMembre;



            form.reset();



        }

        catch(error){


            console.error(
                error
            );


            message.innerHTML =

                "❌ Erreur lors de la création du membre.";


        }


    }
);



logout.addEventListener(
    "click",
    async()=>{


        await signOut(
            auth
        );


        window.location.href =
        "index.html";


    }
);
