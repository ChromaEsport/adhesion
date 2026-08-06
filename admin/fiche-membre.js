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
doc,
setDoc
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






async function prochainNumero(){


const membres =
await getDocs(
collection(
db,
"membres"
)
);



return membres.size + 1;


}






form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



try{


const numero =
await prochainNumero();



const annee =
new Date()
.getFullYear();



const numeroMembre =

"CHRO-"
+
annee
+
"-"
+
String(numero)
.padStart(
4,
"0"
);




const id =
crypto.randomUUID();




await setDoc(

doc(
db,
"membres",
id
),

{


numeroMembre,


prenom:
prenom.value,


nom:
nom.value,


dateNaissance:
dateNaissance.value,


email:
email.value,


discord:
discord.value,


adresse:
adresse.value,


complementAdresse:
complementAdresse.value,


codePostal:
codePostal.value,


ville:
ville.value,


pays:
pays.value,



annee,



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
cotisation.value
)
+
Number(
don.value
),



statutMembre:
"adherent",


statutPaiement:
"paye",


statutAdhesion:
"active",


ajoutManuel:
true,


dateCreation:
new Date()

}


);



message.textContent =
"Le membre a été créé avec succès.";


form.reset();



}

catch(error){


console.error(error);


message.textContent =
"Erreur lors de la création.";


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
