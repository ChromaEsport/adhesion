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



const fiche =
document.getElementById(
"ficheMembre"
);


const titre =
document.getElementById(
"titreMembre"
);


const logout =
document.getElementById(
"logout"
);

const actionsAdmin =
document.getElementById(
"actionsAdmin"
);


const boutonRenouveler =
document.getElementById(
"renouvelerMembre"
);


const statutCarte =
document.getElementById(
"statutCarte"
);

const boutonModifier =
document.getElementById(
"modifierMembre"
);

const boutonPaiement =
document.getElementById(
"paiementMembre"
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


const params =
new URLSearchParams(
window.location.search
);


const id =
params.get(
"id"
);



if(!id){

fiche.innerHTML =
"Aucun membre sélectionné.";

return;

}





const membreDoc =
await getDoc(

doc(
db,
"membres",
id
)

);




if(!membreDoc.exists()){


fiche.innerHTML =
"Membre introuvable.";


return;


}




const membre =
membreDoc.data();

afficherActionsAdmin(membre);

boutonRenouveler.onclick = () => {

    genererLienRenouvellement(
        id,
        membre
    );

};

boutonModifier.onclick =
()=>{

window.location.href =

"modifier-membre.html?id="
+
id;

};

boutonPaiement.onclick = ()=>{

genererLienPaiement(
id,
membre
);

}; 


  
titre.textContent =

membre.numeroMembre
||
"Fiche membre";





fiche.innerHTML = `



<div class="carte-identite">


<div class="numero-membre">

${membre.numeroMembre || "-"}

</div>



<h2>

${membre.prenom || ""}

${membre.nom || ""}

</h2>



<span class="badge">

${membre.statutMembre || "-"}

</span>


</div>





<div class="bloc-fiche">


<h3>
Informations personnelles
</h3>


<p>
<strong>Email :</strong>

${membre.email || "-"}

</p>



<p>
<strong>Discord :</strong>

${membre.discord || "-"}

</p>



<p>
<strong>Date de naissance :</strong>

${membre.dateNaissance || "-"}

</p>


</div>






<div class="bloc-fiche">


<h3>
Adresse
</h3>


<p>

${membre.adresse || "-"}

</p>


<p>

${membre.complementAdresse || ""}

</p>


<p>

${membre.codePostal || ""}
${membre.ville || ""}

</p>


<p>

${membre.pays || ""}

</p>


</div>






<div class="bloc-fiche">


<h3>
Adhésion
</h3>



<p>

<strong>Année :</strong>

${membre.annee || "-"}

</p>



<p>

<strong>Début :</strong>

${afficherDate(
membre.dateDebutAdhesion
)}

</p>



<p>

<strong>Fin :</strong>

${membre.dateFinAdhesion || "-"}

</p>



<p>

<strong>Statut adhésion :</strong>

${membre.statutAdhesion || "-"}

</p>



<p>

<strong>Paiement :</strong>

${membre.statutPaiement || "-"}

</p>



</div>






<div class="bloc-fiche">


<h3>
Cotisation
</h3>



<p>

Cotisation :

${membre.cotisation || 0} €

</p>



<p>

Don :

${membre.don || 0} €

</p>



<p>

Total :

${membre.total || 0} €

</p>



</div>






<div class="bloc-fiche">


<h3>
Validation
</h3>



<p>

Accepté par :

${membre.accepteParNom || "-"}

</p>



</div>



`;



}





function afficherDate(date){


if(!date)
return "-";


if(date.toDate){

return date
.toDate()
.toLocaleDateString(
"fr-FR"
);

}


return date;


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


function afficherActionsAdmin(membre){


actionsAdmin.style.display =
"block";



/*
Afficher renouvellement uniquement
si adhésion expirée
*/

const aujourdHui =
new Date();


const dateFin =
new Date(
    membre.dateFinAdhesion
);


if(
    dateFin < aujourdHui
){

    boutonRenouveler.style.display =
    "block";

}
else{

    boutonRenouveler.style.display =
    "none";

}


/*
Statut carte membre
*/

if(
membre.carteEnvoyee === true
){

statutCarte.innerHTML =

"🪪 Carte membre : 🟢 Envoyée";

}

else{

statutCarte.innerHTML =

"🪪 Carte membre : 🔴 Non envoyée";

}


}

async function genererLienPaiement(
id,
membre
){

try{

const reponse =
await fetch(

"https://chroma-stripe.max2501.workers.dev",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

montant:
membre.total,

email:
membre.email,

membreId:
id,

type:
"paiement_membre"

})

}

);


const stripe =
await reponse.json();


if(!stripe.url){

alert(
"Impossible de créer le paiement."
);

return;

}


window.open(
stripe.url,
"_blank"
);


}
catch(error){

console.error(error);

alert(
"Erreur Stripe."
);

}

}

async function genererLienRenouvellement(
id,
membre
){

try{

const reponse =
await fetch(
"https://chroma-stripe.max2501.workers.dev",
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

montant:
membre.cotisation || 50,

email:
membre.email,

membreId:
id,

numeroMembre:
membre.numeroMembre,

type:
"renouvellement"

})

}
);


const stripe =
await reponse.json();


if(!stripe.url){

alert(
"Impossible de créer le renouvellement."
);

return;

}


window.open(
stripe.url,
"_blank"
);


}

catch(error){

console.error(error);

alert(
"Erreur Stripe renouvellement."
);

}

}

logout.addEventListener(
"click",
async()=>{


await signOut(auth);


window.location.href =
"index.html";


}
);
