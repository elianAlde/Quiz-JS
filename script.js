/* TODO: inserite il codice JavaScript necessario a completare il MHW! */

let mappa={};

const div= document.querySelectorAll(".choice-grid div");
const button=document.querySelector("#reset").addEventListener('click',resetPagina);
aggiungiEvento();

function aggiungiEvento(){
    for(const i of div){
        i.addEventListener('click',seleziona);
    }
}

function seleziona(event){
    const elemento=event.currentTarget.querySelector(".checkbox");
    const elementopadre=elemento.parentElement.parentElement;
    elemento.parentElement.classList.add("colorato"); //modifico il background del div selezionato 
    elemento.src = "images/checked.png" ; //modifico la foto della classe checkbox

    if(elemento.dataset.lastClicked!=elemento.parentElement.dataset.choiceId){ // controllo se l'immagine cliccata è quella già selezionata, perche se essa stessa non devo incrementare i contatori relativi alle 9 personalita all'interno della mappa
        if(!mappa[elemento.parentElement.dataset.choiceId])mappa[elemento.parentElement.dataset.choiceId]=1; 
        else mappa[elemento.parentElement.dataset.choiceId]+=1; //se all'interno della mappa vi era già un'istanza della personalità, esegue un incremento altrimenti crea l'istanza e assegna 1
    }

    //if che permette una sola selezione per section
    if(elementopadre.dataset.lastClicked && elementopadre.dataset.lastClicked!=elemento.parentElement.dataset.choiceId){ //controlla se l'id dell'immagine cliccata è diversa da quella già selezionata, il tutto se il dataset contiene gia' un id(ovvero se un immagine era già stata selezionata) 
        const elep=elementopadre.querySelector("[data-choice-id="+elementopadre.dataset.lastClicked+"] .checkbox"); //Allora posso deselezionare il div precedente
        elep.src="images/unchecked.png";
        elep.parentElement.classList.remove("colorato"); //tolgo il background 
        mappa[elementopadre.dataset.lastClicked]-=1; //decremento nella mappa il contatore relativo a quella personalità
    }

    elementopadre.dataset.lastClicked=elemento.parentElement.dataset.choiceId; //do al dataset il valore dell'id selezionato così da tener traccia.
    $("div[data-question-id="+elemento.parentElement.dataset.questionId+"] ").removeClass("opaco");
    $("div[data-question-id="+elemento.parentElement.dataset.questionId+"]:not([data-choice-id=" + elementopadre.dataset.lastClicked +"])").addClass("opaco");
    controllaQuestionario(); // controllo se tramite questo evento è stato completato il questionario e quindi tutte le scelte sono state effettuate.
}

function controllaQuestionario(){  // controllo se tramite questo evento è stato completato il questionario e quindi tutte le scelte sono state effettuate.
    const padri=document.querySelectorAll(".choice-grid");
    let response_set=true; 
    for(const i of padri){
        if(!i.dataset.lastClicked)response_set=false; //se entra all'interno dell'if vuol dire che un dataset delle 3 domande non ha la risposta, e quindi impongo il flag a false.
    }
    if(response_set==true)fineQuestionario();
}

function fineQuestionario(){ //tolgo tutti gli event listener così da non poter far effettuare alcuna scelta
    for(const i of div){
        i.removeEventListener('click',seleziona);
    }
    document.querySelector(".response").classList.add("Responsevisibile"); //rendo visibile il div contenente l'informazione da stampare all'utente
    controllaRisultato(); 
}

function controllaRisultato(){ //tramite questa funzione controllo quale personalità si ripete più volte
    let max=0; let Id="";
    for(const i in mappa){
        if(mappa[i]>max){
            max=mappa[i];
            Id=i;
        }
    }
    if(max==1){
        generaRisposta(document.querySelector("[data-first-clicked]").dataset.lastClicked); //funzione per inserire i contenuti
    }else{
        generaRisposta(Id);
    }
}

function generaRisposta(Id){   //funzione per inserire i contenuti
    document.querySelector("#response-title").textContent= RESULTS_MAP[Id]["title"];
    document.querySelector("#response-text").textContent= RESULTS_MAP[Id]["contents"];
}

function resetPagina(){
    $(".choice-grid ").attr("data-last-clicked","");
    $(".choice-grid div").removeClass("opaco");
    $(".choice-grid div").removeClass("colorato");
    $(".choice-grid div img.checkbox").attr("src",'images/unchecked.png');
    document.querySelector(".response").classList.remove("Responsevisibile");
    window.scrollTo({top: 0, behavior: 'smooth'});
    aggiungiEvento();
    mappa={};
}