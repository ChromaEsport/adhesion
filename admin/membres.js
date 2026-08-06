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




/* =========================
   ELEMENTS HTML
========================= */


const listeMembres =
    document.getElementById(
        "listeMembres"
    );


const rechercheMembre =
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




/* =========================
   VARIABLES
========================= */


let filtreActuel =
    "active";


let tousLesMembres = [];




/* =========================
   AUTHENTIFICATION
========================= */


onAuthStateChanged(
    auth,
    (user)=>{


        if(!user){

            window.location.href =
            "index.html";

            return;

        }


        chargerMembres();


    }
);




/* =========================
   ONGLET
========================= */


onglets.forEach(
    onglet=>{


        onglet.addEventListener(
            "click",
            ()=>{


                onglets.forEach(
                    autre=>{

                        autre.classList.remove(
                            "actif"
                        );

                    }
                );


                onglet.classList.add(
                    "actif"
                );


                filtreActuel =
                    onglet.dataset.filtre;


                afficherMembres();


            }
        );


    }
);




/* =========================
   CHARGEMENT FIRESTORE
========================= */


async function chargerMembres(){


    listeMembres.innerHTML = `

    <tr>
    <td colspan="9">
    Chargement...
    </td>
    </tr>

    `;


    try {


        const resultat =
            await getDocs(
                collection(
                    db,
                    "membres"
                )
            );



        tousLesMembres = [];



        resultat.forEach(
            doc=>{


                tousLesMembres.push({

                    id:
                    doc.id,

                    ...doc.data()

                });


            }
        );



        /*
        Tri par numéro membre
        */


        tousLesMembres.sort(
            (a,b)=>{


                return (
                    a.numeroMembre || ""
                )
                .localeCompare(
                    b.numeroMembre || ""
                );


            }
        );



        afficherMembres();



    }


    catch(error){


        console.error(
            "Erreur chargement membres :",
            error
        );


        listeMembres.innerHTML = `

        <tr>
        <td colspan="9">
        Impossible de charger les membres.
        </td>
        </tr>

        `;


    }


}






/* =========================
   AFFICHAGE TABLEAU
========================= */


function afficherMembres(){


    listeMembres.innerHTML = "";



    let listeFiltre =

        tousLesMembres.filter(
            membre=>{


                if(
                    filtreActuel === "active"
                ){

                    return (
                        membre.statutAdhesion
                        ===
                        "active"
                    );

                }



                if(
                    filtreActuel === "expiree"
                ){

                    return (
                        membre.statutAdhesion
                        ===
                        "expiree"
                    );

                }



                return true;


            }
        );




    const recherche =

        rechercheMembre.value
        .toLowerCase()
        .trim();




    if(recherche){


        listeFiltre =
            listeFiltre.filter(
                membre=>{


                    const texte =

                    (

                        membre.numeroMembre
                        +

                        membre.nom
                        +

                        membre.prenom
                        +

                        membre.discord
                        +

                        membre.ville

                    )

                    .toLowerCase();



                    return texte.includes(
                        recherche
                    );


                }
            );


    }





    if(
        listeFiltre.length === 0
    ){


        listeMembres.innerHTML = `

        <tr>
        <td colspan="9">
        Aucun membre trouvé.
        </td>
        </tr>

        `;


        return;

    }





    listeFiltre.forEach(
        membre=>{


            const ligne =
                document.createElement(
                    "tr"
                );



            ligne.innerHTML = `



<td>

${membre.numeroMembre || "-"}

</td>



<td>

${membre.nom || "-"}

</td>



<td>

${membre.prenom || "-"}

</td>




<td>

${membre.discord || "-"}

</td>




<td>

${membre.ville || "-"}

</td>




<td>

<span class="badge statut">

${membre.statutMembre || "-"}

</span>

</td>




<td>

<span class="badge paiement">

${
membre.statutPaiement === "paye"

?
"✅ Payé"

:

"❌ Non payé"

}

</span>


</td>




<td>

${
membre.dateFinAdhesion
||
"-"
}

</td>




<td>


<button

class="voir-membre"

data-id="${membre.id}"

>

👤 Voir

</button>


</td>




`;




            listeMembres.appendChild(
                ligne
            );





            ligne
            .querySelector(
                ".voir-membre"
            )
            .addEventListener(
                "click",
                ()=>{


                    window.location.href =

                    "fiche-membre.html?id="
                    +
                    membre.id;


                }
            );



        }
    );


}






/* =========================
   RECHERCHE
========================= */


rechercheMembre.addEventListener(
    "input",
    ()=>{


        afficherMembres();


    }
);





/* =========================
   LOGOUT
========================= */


logout.addEventListener(
    "click",
    async ()=>{


        await signOut(
            auth
        );


        window.location.href =
        "index.html";


    }
);
