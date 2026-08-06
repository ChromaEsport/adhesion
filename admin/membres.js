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
(user)=>{


if(!user){

window.location.href =
"index.html";

return;

}


chargerMembres();


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





async function chargerMembres(){


listeMembres.innerHTML =

`
<tr>
<td colspan="7">
Chargement...
</td>
</tr>
`;



let resultat;



if(filtreActuel==="tous"){


resultat =
await getDocs(
collection(
db,
"membres"
)
);


}

else {


let champ;
let valeur;



if(
filtreActuel==="en_attente_paiement"
){

champ="statutPaiement";
valeur="en_attente";


}

else if(
filtreActuel==="active"
){

champ="statutAdhesion";
valeur="active";


}

else if(
filtreActuel==="expiree"
){

champ="statutAdhesion";
valeur="expiree";


}



const q =
query(

collection(
db,
"membres"
),

where(
champ,
"==",
valeur
)

);



resultat =
await getDocs(q);


}




membres=[];


resultat.forEach(
doc=>{


membres.push({

id:
doc.id,

...doc.data()

});


});


afficherMembres(
membres
);



}







function afficherMembres(
liste
){


listeMembres.innerHTML="";



if(
liste.length===0
){

listeMembres.innerHTML=

`
<tr>
<td colspan="7">
Aucun membre trouvé.
</td>
</tr>
`;

return;

}




liste.forEach(
membre=>{


const ligne =
document.createElement(
"tr"
);



ligne.innerHTML=

`

<td>

${membre.numeroMembre || "-"}

</td>


<td>

${membre.prenom || ""}
${membre.nom || ""}

</td>


<td>

${membre.discord || "-"}

</td>


<td>

${membre.statutPaiement || "-"}

</td>


<td>

${membre.statutAdhesion || "-"}

</td>


<td>

${membre.statutMembre || "-"}

</td>



<td>

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

</td>


`;



listeMembres.appendChild(
ligne
);



ligne
.querySelector(
".voir"
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

ligne
.querySelector(
".modifier"
)
.addEventListener(
"click",
()=>{

window.location.href =
"modifier-membre.html?id="
+
membre.id;

}
);



}



);

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
