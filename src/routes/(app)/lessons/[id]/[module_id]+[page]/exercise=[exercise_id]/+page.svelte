<script>
    //import {data} from "./data"
    import { tweened } from 'svelte/motion';

    let hasEnded = false;
    export let data;
    
    //--------------TIMER CODE------------------------
    let original = data.time; // TYPE NUMBER OF SECONDS HERE
    let timer = tweened(original)

    setInterval(() => {
        if ($timer > 0) $timer--;
    }, 1000);

    

    $: hours = Math.floor($timer / (60*60))
    $: minutes = Math.floor(($timer - hours *(60*60)) / 60);
    $: minname = minutes > 1 ? "mins" : "min";
    $: seconds = Math.floor($timer - hours * (60*60) - minutes * 60)

    // MENU DISPLAY OPTIONS VARS

    let defaultOpt = data.option.filter((opt) => opt.parent === null);
    let correctAns = data.option.filter((opt) => opt.points > 0);
    let maxScore = 0;
    correctAns.forEach((elem)=>{
        maxScore += elem.points;
    });
    let sumPenalties = 0;
    let displayedMessage = "";
    let displayedOptions = defaultOpt;
    let prevDesc = [];
    let prevOptions = [];
    let defaultDesc = {
        description: "Escolha uma opção",
        image: null
    };
    let displayedDesc = defaultDesc;


    $: {
        if($timer <= 0){
            console.log("Time is over");
            hasEnded = true;
        }
        if(sumPenalties >= maxScore){
            endExercise();
        }
        if(hasEnded){
            displayedMessage = ""
        }
    }
    
    // ANSWER SUBMISSON VARS
    let messageColor = "black";
    let modalMode = "none";
    let answersSubmited = [];
    //answersSubmited = data.option.filter((opt) => opt.response === "answer");
    let ind = 0;

    // OPTIONS NAVIGATION
    function handleOption(index){
        if(displayedOptions[index].response === "menu"){
            prevOptions.push(displayedOptions);
            prevOptions = prevOptions;
            displayedMessage = "";

            prevDesc.push(displayedDesc);
            prevDesc = prevDesc;

            displayedDesc = displayedOptions[index];
            displayedOptions = data.option.filter((opt) => opt.parent === displayedOptions[index].id);
        }
        else if(displayedOptions[index].response === "answer"){
            ind = index;
            let wasSubmitted = answersSubmited.map(function (e){return e.id}).indexOf(displayedOptions[index].id);
            if(wasSubmitted !== -1){
                console.log("this answer was already submitted");
                displayedMessage = "Esta resposta já foi submetida";
                messageColor = "black";
                goDefault();
                return;
            }
            modalMode = "show";
        }
    }
    
    function optionGoBack(){
        displayedOptions = prevOptions.pop();
        displayedDesc = prevDesc.pop();

        prevOptions = prevOptions;
        prevDesc = prevDesc;
    }

    function goDefault(){
        displayedDesc = defaultDesc;
        displayedOptions = defaultOpt;
        prevOptions = [];
        prevDesc =[];
        ind = 0;
    }


    // ANSWER SUBMISSION
    function handleConfirmation(isAfirmative){
        modalMode = "none";
        if(isAfirmative){
            checkAnswer();
            goDefault();
        }
    }
    

    function checkAnswer(){
        answersSubmited.push(displayedOptions[ind]);
        answersSubmited = answersSubmited;

        let isCorrect = correctAns.map(function (e) {return e.id;}).indexOf(displayedOptions[ind].id);

        if(isCorrect !== -1) {
            console.log("The answer was correct (+" + displayedOptions[ind].points + ")");
            correctAns.splice(isCorrect, 1);
            console.log(correctAns);
            displayedOptions[ind].submission = "correct";
            displayedMessage = "Isto é uma resolução da avaria";
            if(correctAns.length <= 0){
                displayedMessage = "Achaste todas as etapas de resolução";
                endExercise();
            }
            messageColor = "darkgreen";
        }
        else{
            if(displayedOptions[ind].points === 0){
                console.log("The answer was neutral (" + displayedOptions[ind].points+ ")")
                displayedOptions[ind].submission = "neutral";
                displayedMessage = "Isto não resolveu o problema mas este passo não é incorrecto de se fazer";
                messageColor = "blue";
                return;
            }
            console.log("The answer was wrong (" + displayedOptions[ind].points+ ")");
            sumPenalties -= displayedOptions[ind].points;
            displayedOptions[ind].submission = "wrong";
            displayedMessage = "Isto não resolve o problema";
            messageColor = "red";
        }
    }

    function endExercise(){
        $timer = 1;
        hasEnded = true;
    }

    function getScore(){
        let score = 0;
        answersSubmited.forEach((elem) => {
            score += elem.points;
        });
        if(score < 0){
            score = 0;
        }
        return score;
    }

</script>


<!-- svelte-ignore a11y-autofocus -->
<main>
    {#if modalMode === "show"}
        
    <div class="modal">
        <div class="modal-content">
            <span>Tem a certeza que quer submeter esta resposta?</span>
            <div class="confirm-action">
                <button class="button-confirmation positive" autofocus on:click={() => handleConfirmation(true)}>sim</button>
                <button class="button-confirmation negative" on:click={() => handleConfirmation(false)}>não</button>
            </div>
        </div>
    </div>
    {/if}
    <h1>AVARIA {hasEnded ?": FINALIZADO":""}</h1>
    
    <div class="container">
            <!--  -->
            <div class="exercise-details">
                {data.title}
                <br>
                <br>
                <span style="border: 1px solid black;">Aqui fica a imagem do exercicio</span>
            </div>

            <div class="image-component-container">
            {#if !hasEnded}
                {#if displayedDesc.image}
                    
                <img class="image-component" src={displayedDesc.image} alt="não encontrado">   
                {:else}
                    <span style="border: 1px solid black;">Aqui fica a imagem da componente</span>
                {/if}
            {/if}
            </div>
            <div class="nav-options">
                <div class="timer">
                    {#if !hasEnded}
                        {(hours === 0) ? "": hours+":"}{(minutes/10 >= 1) ? "":"0"}{minutes}:{(seconds/10 >= 1) ? "":"0"}{seconds}    
                    {:else}
                        00:00
                    {/if}
    
                </div>
                {#if !hasEnded}
                <div class="centered">
                        {displayedDesc.description}
                    </div>
                    {#each displayedOptions as opt, i}
                        <div class="option">
                            <button class="button-option {(opt.response === "menu") ? "":"single"} {opt.submission ?? ""}" on:click={() => handleOption(i)}> {opt.title} </button>
                        </div>
                    {/each}
                    
                    {#if prevOptions.length !== 0}
                    <button class="button-option return" on:click={() => optionGoBack()}>Voltar</button>
                    {/if}

                    <button class="button-option end" on:click={endExercise}> Acabar prova </button>

                    
                {:else}
                    <div class="centered">
                        <p>{sumPenalties >= 100 ? "Fizeste muitos erros não passaste a prova" : correctAns.length <= 0 ? "Achaste todas as tapas de resolução":"Não achaste todas as etapas"}</p>
                        <p>Respostas submetidas:</p>
                    </div>
                    {#each answersSubmited as answer}
                        <div class="submission {answer.points === 0 ? "" : answer.points > 0 ? "correct":"wrong"}">
                            <p>{answer.description ?? answer.title} ({answer.points > 0 ? "+":""}{answer.points})</p>
                        </div>
                    {/each}
                    {#if answersSubmited.length <= 0}
                        <div class="submission wrong">
                            <p>Não foi submetida nenhuma resposta</p>
                        </div>
                    {/if}
                    <p>Pontuação: {getScore()} / {maxScore}</p>
                    <button class="button-option return">sair</button>
                {/if}
            </div>
        </div>
    <div class="displayed-message" style="color: {messageColor};">
        {displayedMessage}
    </div>
</main>

<style>
    h1{
        text-align: center;
    }
    
    .container{
        position: relative;
        display: grid;
        grid-template-columns: 65% auto;
        width: 90%;
        margin: auto;
    }

    .nav-options{
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .image-component-container{
        max-width: 600px;
        max-height: 600px;
        overflow: hidden;
        position: absolute;
        top: 2rem;
        left: 50%;
        transform: translateX(-50%);
    }

    .image-component{
        max-width: 300px;
        max-height: 250px;
        transition: 0.5s;
        cursor: pointer;
    }
    .image-component:hover{
        max-width: 500px;
        max-height: 500px;
    }

    .modal{
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-top: 20rem;
        z-index: 200;
        background-color: black;
        background-color: rgba(0,0,0,0.4);
    }
    .modal-content{
        background-color: white;
        width: 80%;
        margin: auto;
        padding: 20px;
        opacity: 100%;
    }

    .button-confirmation:focus{
        border-color: orange;
    }

    .button-option{
        min-width: 20rem;
        margin: 0.5rem;
        padding: 5px;
        border-radius: 10px;
        background-color: blue;
        color: white;
        cursor: pointer;
        font: inherit;
    }

    .button-option.single{
        background-color: darkblue;
    }
    .button-option.return{
        background-color: black;
    }
    .button-option.end{
        margin-top: 2rem;
        background-color: black;
    }
    .button-option.correct{
        background-color: rgb(61, 207, 42);
    }
    .button-option.wrong{
        background-color: red;
    }
    .button-option.neutral{
        background-color: rgb(201, 164, 1);
    }

    .displayed-message{
        text-align: center;
    }

    .timer-container{
        position: relative;
        background-color: aqua;
    }
    .timer{
        position: relative;
        grid-column-start: 2;
        grid-column-end: 3;
        justify-self: center;
        margin-left: 15rem;
        margin-bottom: 1rem;
        font-size: 18pt;
    }

    .submission{
        margin: 0.5rem;
        padding: 0.3rem;
        min-width: 20rem;
        border-radius: 10px;
        background-color: rgb(48, 48, 48);
        color: white;
    }

    .submission.correct{
        background-color: green;
    }
    .submission.wrong{
        background-color: rgb(255, 48, 48);
    }

</style>