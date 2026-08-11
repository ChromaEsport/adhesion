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
    updateDoc,
    Timestamp
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

const blocDemandeMembreActif =
    document.getElementById(
        "blocDemandeMembreActif"
    );

const contenuDemandeMembreActif =
    document.getElementById(
        "contenuDemandeMembreActif"
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




const membre = { id: id, ...membreDoc.data() };

    


if (
    adhesionEstExpiree(membre) &&
    membre.statutAdhesion !== "expiree"
) {

    await updateDoc(
        doc(db, "membres", id),
        {
            statutAdhesion: "expiree",
            statutPaiement: "en_attente"
        }
    );

    membre.statutAdhesion = "expiree";
    membre.statutPaiement = "en_attente";
}
    
afficherDemandeMembreActif(membre);

    configurerActionsDemandeMembreActif(
membre,
id
);

    configurerAutorisationNouvelleDemande(
    membre,
    id
);
    
afficherActionsAdmin(membre);

boutonRenouveler.onclick = () => {

    window.location.href =
         "../renouvellement.html?id="
        +
        id;

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


const statutAdhesionAffiche =
    adhesionEstExpiree(membre)
        ? "expiree"
        : membre.statutAdhesion;


const statutPaiementAffiche =
    adhesionEstExpiree(membre)
        ? "en_attente"
        : membre.statutPaiement;


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

${statutAdhesionAffiche || "-"}

</p>



<p>

<strong>Paiement :</strong>

${statutPaiementAffiche || "-"}

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



if(
adhesionEstExpiree(membre)
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

function afficherDemandeMembreActif(membre) {

const cotisationAJour =
    membre.statutPaiement ===
    "paye";

const adhesionActive =
    membre.statutAdhesion ===
    "active";

    
// Aucun bloc si aucune demande n'existe
    if 
( membre.statutDemandeMembreActif !== 
 "en_attente"
 &&
 membre.statutDemandeMembreActif !== 
 "refusee" 
) { 
    blocDemandeMembreActif.style.display = 
        "none"; 
     
     return; }

if (
membre.statutDemandeMembreActif ===
"refusee"
) {    

   blocDemandeMembreActif.style.display =
    "block";

const motif =
    membre.motifRefusMembreActif ||
    "Aucun motif communiqué.";

const dateDecision =
    afficherDate(
        membre.dateDecisionMembreActif
    );

contenuDemandeMembreActif.innerHTML = `
    <div class="informations-demande-actif">

        <div class="information-demande-actif">

            <span class="information-demande-actif-label">
                Statut de la demande
            </span>

            <span class="information-demande-actif-valeur">
                ❌ Refusée
            </span>

        </div>

        <div class="information-demande-actif">

            <span class="information-demande-actif-label">
                Date de décision
            </span>

            <span class="information-demande-actif-valeur">
                ${dateDecision}
            </span>

        </div>

        <div class="information-demande-actif">

            <span class="information-demande-actif-label">
                Décision prise par
            </span>

            <span class="information-demande-actif-valeur">
                ${membre.decisionMembreActifParNom || "Administrateur"}
            </span>

        </div>

        <div class="information-demande-actif">

            <span class="information-demande-actif-label">
                Motif du refus
            </span>

            <span class="information-demande-actif-valeur">
                ${motif}
            </span>

        </div>

    </div>

    <div class="actions-demande-membre-actif">

        <button
            id="reactiverDemandeMembreActif"
            type="button"
        >
            🔄 Autoriser une nouvelle demande
        </button>

    </div>
`;

const boutonReactiver =
    document.getElementById(
        "reactiverDemandeMembreActif"
    );

if (boutonReactiver) {

    boutonReactiver.addEventListener(
        "click",
        async () => {

            const confirmation =
                confirm(
                    "Voulez-vous autoriser ce membre à déposer une nouvelle demande de passage en membre actif ?"
                );

            if (!confirmation) {
                return;
            }

            const user =
                auth.currentUser;

            if (!user) {

                alert(
                    "Administrateur non identifié."
                );

                return;
            }

            try {

                await updateDoc(
                    doc(
                        db,
                        "membres",
                        membre.id
                    ),
                    {

                        statutDemandeMembreActif:
                            null,

                        demandeMembreActif:
                            false,

                        nouvelleDemandeMembreActifAutorisee:
                            true,

                        dateDecisionMembreActif:
                            Timestamp.now(),

                        decisionMembreActifParNom:
                            user.displayName ||
                            "Administrateur",

                        decisionMembreActifParEmail:
                            user.email ||
                            "",

                        motifRefusMembreActif:
                            null

                    }
                );

                alert(
                    "Le membre est maintenant autorisé à déposer une nouvelle demande."
                );

                window.location.reload();

            }
            catch (error) {

                console.error(
                    "Erreur lors de la réautorisation :",
                    error
                );

                alert(
                    "Impossible de réautoriser une nouvelle demande."
                );

            }

        }
    );

}

return; 

blocDemandeMembreActif.style.display =
    "block";

const dateDebut =
    afficherDate(
        membre.dateDebutAdhesion
    );

const dateDemande =
    afficherDate(
        membre.dateDemandeMembreActif
    );

const dateEligibiliteObjet =
calculerDateEligibiliteMembreActif(
membre.dateDebutAdhesion
);

let dateEligibilite = "-";

let sixMoisAtteints = false;

if (dateEligibiliteObjet) {


dateEligibilite =
    dateEligibiliteObjet
        .toLocaleDateString(
            "fr-FR"
        );

const aujourdHui =
    new Date();

aujourdHui.setHours(
    0,
    0,
    0,
    0
);

sixMoisAtteints =
    dateEligibiliteObjet <=
    aujourdHui;

const cotisationAJour =
membre.statutPaiement ===
"paye";

}


contenuDemandeMembreActif.innerHTML = `

    <div class="informations-demande-actif">

        <div class="information-demande-actif">
            <span class="information-demande-actif-label">
                Statut actuel
            </span>

            <span class="information-demande-actif-valeur">
                👤 Membre adhérent
            </span>
        </div>

        <div class="information-demande-actif">
            <span class="information-demande-actif-label">
                Adhérent depuis
            </span>

            <span class="information-demande-actif-valeur">
                ${dateDebut}
            </span>
        </div>

        <div class="information-demande-actif">
            <span class="information-demande-actif-label">
                Demande effectuée le
            </span>

            <span class="information-demande-actif-valeur">
                ${dateDemande}
            </span>
        </div>

<div class="information-demande-actif">

    <span class="information-demande-actif-label">
        Compte Firebase
    </span>

    <span class="information-demande-actif-valeur">

        ${
            membre.firebaseUid
            || "-"
        }

    </span>

</div>

        <div class="information-demande-actif">

            <span class="information-demande-actif-label">
                Éligible depuis
            </span>

            <span class="information-demande-actif-valeur">
                ${dateEligibilite}
            </span>

        </div>

        <div class="information-demande-actif">

            <span class="information-demande-actif-label">
                Statut de la demande
            </span>

            <span class="badge-demande-en-attente">
                ⏳ En attente
            </span>

        </div>

    </div>

    <div class="criteres-membre-actif">

        <h4>
            🔎 Vérification des critères
        </h4>

        <div class="critere-membre-actif">
    <span class="icone">
        ${sixMoisAtteints ? "🟢" : "🔴"}
    </span>


<span class="texte">
    Ancienneté minimale de 6 mois
</span>


</div>


        <div class="critere-membre-actif">
    <span class="icone">
    ${
        cotisationAJour &&
        adhesionActive
        ? "✅"
        : "❌"
    }
</span>

<span class="texte">
    Cotisation et adhésion à jour
</span>


</div>


    <div
    class="critere-membre-actif"
    id="blocCritereParticipation"
>
    <input
        type="checkbox"
        id="critereParticipation"
    >


<label for="critereParticipation">
    Participation régulière aux activités
</label>


</div>

<div
    class="critere-membre-actif"
    id="blocCritereImplication"
>
    <input
        type="checkbox"
        id="critereImplication"
    >


<label for="critereImplication">
    Implication dans la vie de l'association
</label>


</div>

<div
    class="critere-membre-actif"
    id="blocCritereReglement"
>
    <input
        type="checkbox"
        id="critereReglement"
    >


<label for="critereReglement">
    Respect du règlement intérieur
</label>


</div>



    </div>

    <div class="actions-demande-membre-actif">

      <button
id="accepterDemandeMembreActif"
type="button"
${sixMoisAtteints ? "" : "disabled"}

>


${sixMoisAtteints



    ? "✅ Accepter la demande"
    : "🔒 Accepter la demande"}


</button>


        <button
            id="refuserDemandeMembreActif"
            type="button"
        >
            ❌ Refuser la demande
        </button>

    </div>
`;


}

function calculerDateEligibiliteMembreActif(
dateDebutAdhesion
) {


if (!dateDebutAdhesion) {
    return null;
}

let date;

if (
    typeof dateDebutAdhesion.toDate ===
    "function"
) {
    date =
        dateDebutAdhesion.toDate();
}
else {
    date =
        new Date(
            dateDebutAdhesion
        );
}

if (
    isNaN(
        date.getTime()
    )
) {
    return null;
}

date.setMonth(
    date.getMonth() + 6
);

return date;


}




function configurerActionsDemandeMembreActif(
membre,
id
) {


if (
    membre.statutDemandeMembreActif !==
    "en_attente"
) {
    return;
}

const boutonAccepter =
    document.getElementById(
        "accepterDemandeMembreActif"
    );

const boutonRefuser =
    document.getElementById(
        "refuserDemandeMembreActif"
    );

const critereParticipation =
document.getElementById(
"critereParticipation"
);

const critereImplication =
document.getElementById(
"critereImplication"
);

const critereReglement =
document.getElementById(
"critereReglement"
);

const blocCritereParticipation =
document.getElementById(
"blocCritereParticipation"
);

const blocCritereImplication =
document.getElementById(
"blocCritereImplication"
);

const blocCritereReglement =
document.getElementById(
"blocCritereReglement"
);

const cotisationAJour =
membre.statutPaiement ===
"paye";

const dateEligibilite =
calculerDateEligibiliteMembreActif(
membre.dateDebutAdhesion
);

let sixMoisAtteints =
false;

if (dateEligibilite) {


const aujourdHui =
    new Date();

aujourdHui.setHours(
    0,
    0,
    0,
    0
);

sixMoisAtteints =
    dateEligibilite <=
    aujourdHui;


}

function verifierCriteres() {


const participationValidee =
    critereParticipation &&
    critereParticipation.checked;

const implicationValidee =
    critereImplication &&
    critereImplication.checked;

const reglementValide =
    critereReglement &&
    critereReglement.checked;

const tousLesCriteres =
    sixMoisAtteints &&
    cotisationAJour &&
    participationValidee &&
    implicationValidee &&
    reglementValide;

if (boutonAccepter) {

    boutonAccepter.disabled =
        !tousLesCriteres;

    if (tousLesCriteres) {

        boutonAccepter.textContent =
            "✅ Accepter la demande";

    }
    else {

        boutonAccepter.textContent =
            "🔒 Accepter la demande";
    }
}

if (blocCritereParticipation) {

    blocCritereParticipation.classList.toggle(
        "critere-manuel-valide",
        participationValidee
    );

    blocCritereParticipation.classList.toggle(
        "critere-manuel-invalide",
        !participationValidee
    );
}

if (blocCritereImplication) {

    blocCritereImplication.classList.toggle(
        "critere-manuel-valide",
        implicationValidee
    );

    blocCritereImplication.classList.toggle(
        "critere-manuel-invalide",
        !implicationValidee
    );
}

if (blocCritereReglement) {

    blocCritereReglement.classList.toggle(
        "critere-manuel-valide",
        reglementValide
    );

    blocCritereReglement.classList.toggle(
        "critere-manuel-invalide",
        !reglementValide
    );
}


}

if (critereParticipation) {


critereParticipation.addEventListener(
    "change",
    verifierCriteres
);


}

if (critereImplication) {


critereImplication.addEventListener(
    "change",
    verifierCriteres
);


}

if (critereReglement) {


critereReglement.addEventListener(
    "change",
    verifierCriteres
);


}

verifierCriteres();


    
if (boutonAccepter) {

    boutonAccepter.addEventListener(
        "click",
        async () => {

            const confirmation =
                confirm(
                    "Confirmer l'acceptation de cette demande de passage en membre actif ?"
                );

            if (!confirmation) {
                return;
            }

            const user =
                auth.currentUser;

            if (!user) {
                alert(
                    "Administrateur non identifié."
                );
                return;
            }

            try {

                await updateDoc(
                    doc(
                        db,
                        "membres",
                        id
                    ),
                    {
                        statutMembre:
                            "actif",

                        statutDemandeMembreActif:
                            "acceptee",

                        demandeMembreActif:
                            false,

                        dateDecisionMembreActif:
                            Timestamp.now(),

                        decisionMembreActifParNom:
                            user.displayName ||
                            "Administrateur",

                        decisionMembreActifParEmail:
                            user.email || ""
                    }
                );

                alert(
                    "La demande a été acceptée. Le membre est maintenant membre actif."
                );

                window.location.reload();

            }
            catch (error) {

                console.error(
                    "Erreur lors de l'acceptation :",
                    error
                );

                alert(
                    "Impossible d'accepter la demande."
                );
            }
        }
    );
}

if (boutonRefuser) {

    boutonRefuser.addEventListener(
        "click",
        async () => {

            const motif =
                prompt(
                    "Pourquoi cette demande est-elle refusée ?"
                );

            if (
                motif === null
            ) {
                return;
            }

            if (
                motif.trim() === ""
            ) {
                alert(
                    "Un motif de refus est obligatoire."
                );
                return;
            }

            const confirmation =
                confirm(
                    "Confirmer le refus de cette demande ?"
                );

            if (!confirmation) {
                return;
            }

            const user =
                auth.currentUser;

            if (!user) {
                alert(
                    "Administrateur non identifié."
                );
                return;
            }

            try {

                await updateDoc(
                    doc(
                        db,
                        "membres",
                        id
                    ),
                    {
                        statutDemandeMembreActif:
                            "refusee",

                        demandeMembreActif:
                            false,


                        nouvelleDemandeMembreActifAutorisee: false,
                        
                        dateDecisionMembreActif:
                            Timestamp.now(),

                        decisionMembreActifParNom:
                            user.displayName ||
                            "Administrateur",

                        decisionMembreActifParEmail:
                            user.email || "",

                        motifRefusMembreActif:
                            motif.trim()
                    }
                );

                alert(
                    "La demande a été refusée."
                );

                window.location.reload();

            }
            catch (error) {

                console.error(
                    "Erreur lors du refus :",
                    error
                );

                alert(
                    "Impossible de refuser la demande."
                );
            }
        }
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
