<script>
    //import {data} from "./data";
    import { tweened } from 'svelte/motion';
    import {page} from "$app/stores";
    
    let hasEnded = false;
    export let data;
    let displayedQuestion = data.questions[0];
    
    //--------------TIMER CODE------------------------
    let original = displayedQuestion.time; // TYPE NUMBER OF SECONDS HERE
    let timer = tweened(original)

    setInterval(() => {
        if ($timer > 0) $timer--;
    }, 1000);

    function timeToMinSec(time){
        let minutes = Math.floor((time) / 60);
        let minname = minutes > 1 ? "mins" : "min";
        let seconds = Math.floor(time - minutes * 60);

        let res = {
            minutes: minutes,
            minname: minname,
            seconds: seconds
        };

        return res;
    }

    $: hours = Math.floor($timer / (60*60))
    $: minutes = Math.floor(($timer - hours *(60*60)) / 60);
    $: minname = minutes > 1 ? "mins" : "min";
    $: seconds = Math.floor($timer - hours * (60*60) - minutes * 60);

    // MENU DISPLAY OPTIONS VARS

    let defaultOpt = data.option.filter((opt) => opt.parent === null);
    let correctAns = data.option.filter((opt) => opt.points > 0 && opt.response==="answer");
    let totalScoreOpts = data.option.filter((opt) => opt.points > 0);
    let maxScore = 0;
    let totalMaxScore = 0;
    correctAns.forEach((elem)=>{
        maxScore += elem.points;
    });
    totalScoreOpts.forEach((elem)=>{
        totalMaxScore += elem.points;
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
            if(displayedOptions[index].points > 0){
                answersSubmited.push(displayedOptions[index]);
            }
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
                displayedMessage = displayedOptions[ind].description;
                messageColor = "blue";
                return;
            }
            console.log("The answer was wrong (" + displayedOptions[ind].points+ ")");
            sumPenalties -= displayedOptions[ind].points;
            displayedOptions[ind].submission = "wrong";
            displayedMessage = "Isto não resolve o problema";
            messageColor = "red";
        }
        displayedMessage = displayedOptions[ind].description;
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
    <div>
        <a href="{$page.url.pathname}/edit">Editar</a>
    </div>
    <h1>EXERCÍCIO {hasEnded ?": FINALIZADO":""}</h1>

    <div class="container">
            <!--  -->
            <div class="exercise-details">
                <div class="exercise-info">
                    <div class="div-identifier brown">
                        Sintoma da avaria
                    </div>
                    <div class="title">
                        {displayedQuestion.title}
                    </div>
                    <span>Tempo de resolução: {timeToMinSec(displayedQuestion.time).minutes?timeToMinSec(displayedQuestion.time).minutes+timeToMinSec(displayedQuestion.time).minname:""} {timeToMinSec(displayedQuestion.time).seconds?timeToMinSec(displayedQuestion.time).minutes+"s":""}</span>
                    <span>Dificuldade: 1</span>
                </div>
                <br>
                <br>
                {#if displayedQuestion.image}
                    <img class="image-exercise" src="/api/exercise/{$page.params.exercise_id}" alt="não encontrado">
                {/if}
            </div>

            <div class="nav-options">
                
                {#if !hasEnded}
                    <div class="centered">
                        Escolha uma opção
                    </div>
                    {#each displayedOptions as opt, i}
                        <div class="option">
                            <button class="button-option {(opt.response === "menu") ? "":"single"} {opt.submission ?? ""}" on:click={() => handleOption(i)}> {opt.title} </button>
                        </div>
                    {/each}
                    
                    {#if prevOptions.length !== 0}
                    <div class="option">
                        <button class="button-option return" on:click={() => optionGoBack()}>Voltar</button>
                    </div>
                    {/if}

                    <div class="option">
                        <button class="button-option end" on:click={endExercise}> Acabar prova </button>
                    </div>

                    
                {:else}
                    <div class="centered">
                        <p>{sumPenalties >= 100 ? "Fizeste muitos erros não passaste a prova" : correctAns.length <= 0 ? "Achaste todas as tapas de resolução":"Não achaste todas as etapas"}</p>
                        <p>Respostas submetidas:</p>
                    </div>
                    {#each answersSubmited as answer}
                    <div class="submission {answer.points === 0 ? "" : answer.points > 0 ? "correct":"wrong"}">
                        <p>{answer.title} ({answer.points > 0 ? "+":""}{answer.points})</p>
                    </div>
                    {/each}
                    {#if answersSubmited.length <= 0}
                    <div class="submission wrong">
                        <p>Não foi submetida nenhuma resposta</p>
                    </div>
                    {/if}
                    <p>Pontuação: {getScore()} / {totalMaxScore}</p>
                    <button class="button-option return">sair</button>
                    {/if}
            </div>
            <div class="right-container">
                <div class="timer">
                    {#if !hasEnded}
                    {(hours === 0) ? "": hours+":"}{(minutes/10 >= 1) ? "":"0"}{minutes}:{(seconds/10 >= 1) ? "":"0"}{seconds}    
                    {:else}
                    00:00
                    {/if}
                    
                </div>
                <div class="image-component-container {displayedDesc.image?"":"gray"}">
                    {#if !hasEnded}
                        {#if displayedDesc.image}               
                            <img class="image-component" src='/api/exercise/{displayedDesc.id}/image/{displayedDesc.image}' alt="não encontrado">   
                        {/if}
                    {/if}
                </div>
                <div class="finish-exercise">

                </div>
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
        grid-template-columns: max(20%, 300px) auto 50%;
        width: 90%;
        margin: auto;
    }
    
    .exercise-details{
        width: 100%;
        border-right: 1px solid black;
    }

    .div-identifier{
        border-radius: 40px;
        width: fit-content;
        padding: 10px;
        color: white;
        background-color: brown;
    }
    .brown{
        background-color: brown;
    }
    .green{
        background-color: green;
    }

    .title{
        text-align: center;
        margin: 2rem 2rem;
    }

    .exercise-info{
        display: flex;
        width: 80%;
        padding: 4%;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: 20px;
    }

    .nav-options{
        display: flex;
        flex-direction: column;
        width: 25rem;
        align-items: center;
    }


    .right-container{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .image-component-container{
        width: 600px;
        height: 600px;
        overflow: hidden;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 50%;
        transform: translateX(-50%);
        /* background-color: gray; */
    }
    .image-component-container.gray{
        background-color: gray;
    }

    .image-exercise{
        position: relative;
        /* left: 0;
        transform: translateX(-50%); */
        max-width: 80%;
        padding: 4%;
        max-height: 500px;
    }

    .image-component{
        max-width: 500px;
        max-height: 500px;
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
        width: fit-content;
        left: 100%;
        transform: translateX(-100%);
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