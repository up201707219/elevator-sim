<script>
    //import {data} from "./data";
    import { tweened } from 'svelte/motion';
    import {page} from "$app/stores";
    import finishImg from "$lib/assets/img/finish_question.png"
    import Timer from "$lib/timer.svelte"
    import Modal from "$lib/modal.svelte"
    import { enhance, applyAction, deserialize } from '$app/forms';
    import { invalidateAll, goto } from '$app/navigation';

    export let data;
    let answerForm;
    let endForm;
    let showModal = false;
    let modal;
    let hasEnded = data.questionState?.finished_at?true:false;

    

    let displayedQuestionIndex = data.questions.map(function (e) {return e.id;}).indexOf($page.params.exercise_id);
    let displayedQuestion = data.questions[displayedQuestionIndex];
    //console.log(timeToMinSec(displayedQuestion.time));
    
    //--------------TIMER CODE------------------------
    let original = data.questionState?.time_remaining??displayedQuestion.time; // TYPE NUMBER OF SECONDS HERE
    let timer = tweened(original)

    setInterval(() => {
        if ($timer > 0 && !hasEnded) $timer--;
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

    function timeToString(time){
        let aux = timeToMinSec(time);
        let res = {
            minutes: aux.minutes/10 >= 1 ? ""+aux.minutes:"0"+aux.minutes,
            seconds: aux.seconds/10 >= 1 ? ""+aux.seconds:"0"+aux.seconds
        }

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
            endExercise()
        }
        if(sumPenalties >= maxScore){
            endExercise();
        }
        if(correctAns.length === 0){
            hasEnded=true;
        }
        if(hasEnded){
            displayedMessage = ""
        }
    }
    $: showModal=(displayedMessage && modalMode ==="none")
    
    // ANSWER SUBMISSON VARS
    let messageColor = "black";
    let modalMode = "none";
    let answersSubmited = [];

    data.questionState?.answer?.forEach((elem)=>{
        let aux = data.option.find((e) => e.id === elem.id);
        answersSubmited.push(aux);
        let isCorrect = correctAns.map(function (e) {return e.id;}).indexOf(aux.id);
        if(isCorrect !== -1) {
            correctAns.splice(isCorrect, 1);
        }

    });
    
    let ind = 0;

    // OPTIONS NAVIGATION
    function handleOption(index){
        if(displayedOptions[index].response === "menu"){
            let wasSubmitted = answersSubmited.map(function (e){return e.id}).indexOf(displayedOptions[index].id);
            if(displayedOptions[index].points > 0 && wasSubmitted !== -1){
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
    async function handleConfirmation(isAfirmative){
        modalMode = "none";
        if(isAfirmative){
            const data = new FormData(answerForm);

            const response = await fetch(answerForm.action, {
                method: 'POST',
                body: data
            });
            const result = deserialize(await response.text());

            checkAnswer();
            goDefault();
            applyAction(result);
        }
    }
    let res;

    function checkAnswer(){
        answersSubmited.push(displayedOptions[ind]);
        answersSubmited = answersSubmited;
        let isCorrect = correctAns.map(function (e) {return e.id;}).indexOf(displayedOptions[ind].id);

        if(isCorrect !== -1) {
            correctAns.splice(isCorrect, 1);
            if(correctAns.length <= 0){
                endExercise();
            }
            messageColor = "darkgreen";
            res = "Certo";
        }
        else{
            if(displayedOptions[ind].points === 0){
                displayedMessage = displayedOptions[ind].description;
                messageColor = "blue";
                res = "Neutro";
                return ;
            }
            sumPenalties -= displayedOptions[ind].points;
            messageColor = "red";
            res = "Errado"
        }
        displayedMessage = displayedOptions[ind].description;
    }

    function setSubmissions(ans){
        ans.forEach((elem) =>{
            let indexAux = data.option.map(function(e) { return e.id; }).indexOf(elem.id);
            data.option[indexAux].submission = data.option[indexAux].points === 0? "neutral" : data.option[indexAux].points > 0 ? "correct":"wrong"; 
        });
    }

    $:setSubmissions(answersSubmited);

    async function endExercise(){
        hasEnded = true;
        if(!endForm){
            return;
        }
        const data = new FormData(endForm);

        const response = await fetch(endForm.action, {
            method: 'POST',
            body: data
        });
        const result = deserialize(await response.text());

        if (result.type === 'success') {
			// rerun all `load` functions, following the successful update
			await invalidateAll();
		}
        modalMode ="none";
        applyAction(result);
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

    function getTimeUsed(){
        if(!data.questionState?.finished_at || !data.questionState?.started_at || Math.floor((data.questionState?.finished_at-data.questionState?.started_at)/1000) > displayedQuestion.time ){
            return timeToString(displayedQuestion.time - $timer).minutes+":"+timeToString(displayedQuestion.time - $timer).seconds;
        }
        return timeToString(Math.floor((data.questionState?.finished_at-data.questionState?.started_at)/1000)).minutes+":"+timeToString(Math.floor((data.questionState?.finished_at-data.questionState?.started_at)/1000)).seconds;                         
    }

</script>


<!-- svelte-ignore a11y-autofocus -->
<main>
    {#if modalMode === "show"}
        
    <div class="modal">
        <div class="modal-content">
            <span>Tem a certeza que quer submeter esta resposta?</span>
            <div class="confirm-action">
                <form method="post" action="?/insertAnswer" use:enhance bind:this={answerForm}>
                    <input type="hidden" name="answer-id" value={displayedOptions[ind].id}>
                    <input type="hidden" name="answer-score" value={displayedOptions[ind].points}>
                    <button type="submit" class="button-confirmation positive" autofocus on:click={() => handleConfirmation(true)}>sim</button>
                    <button class="button-confirmation negative" on:click={() => handleConfirmation(false)}>não</button>
                </form>
            </div>
        </div>
    </div>
    {/if}
    {#if data.user.isAdmin !== "false"}
        <div>
            <a href="{$page.url.pathname}/edit">Editar</a>
        </div>
    {/if}
    <h1>Exercício da máquina de café</h1>
    {#if !hasEnded}
        <div class="timer">
            <!-- {(hours === 0) ? "": hours+":"}{(minutes/10 >= 1) ? "":"0"}{minutes}:{(seconds/10 >= 1) ? "":"0"}{seconds}      -->
            <Timer countdown={data.questionState?.time_remaining??displayedQuestion.time}/>
        </div>
    {/if}

    <div class="container {hasEnded?"end-grid":""}">
            <!--  -->
            <div class="exercise-details">
                <div class="exercise-info">
                    <div class="div-identifier brown">
                        Sintoma da avaria
                    </div>
                    <div class="title">
                        {displayedQuestion.title}
                    </div>
                    <span>Tempo de resolução: {timeToMinSec(displayedQuestion.time).minutes?timeToMinSec(displayedQuestion.time).minutes+timeToMinSec(displayedQuestion.time).minname:""} {timeToMinSec(displayedQuestion.time).seconds?timeToMinSec(displayedQuestion.time).seconds+"s":""}</span>
                    <span>Dificuldade: 1</span>
                </div>
                <br>
                <br>
                {#if displayedQuestion.image}
                    <img class="image-exercise" src="/api/exercise/{displayedQuestion.id}" alt="não encontrado">
                {/if}
            </div>

            <div class="center-div">
                {#if !hasEnded}
                    <div class="div-identifier green">
                        Resolução da avaria
                    </div>
                {:else}
                    <div class="summary">
                        <div class="pass">
                            PASS
                        </div>
                        <div class="answer-stats">
                            <div class="stats-labels">
                                <p>Pontuação: </p>
                                <p>Pontuação minima: </p>
                                <p>Tempo usado: </p>
                            </div>
                            <div class="stats-values">
                                <p>{getScore()*100/totalMaxScore}%</p>
                                <p>0%</p>
                                <p>
                                    {getTimeUsed()}    
                                </p>
                            </div>
                        </div>
                    </div>
                {/if}
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
                
                {/if}
                </div>
                <div class="options-labels">
                    <p>
                        Legenda:
                    </p>
                    <div style="display: flex;">
                        <div style="width: 15px; height: 15px; background-color: blue; margin:0 0.3rem 0.5rem 0;"></div> - Menu
                    </div>
                    <div style="display: flex;">
                        <div style="width: 15px; height: 15px; background-color: darkblue; margin:0 0.3rem 0.5rem 0;"></div> - Resposta
                    </div>
                </div>
            </div>
            
            <div class="right-container">
                
                {#if !hasEnded}
                    <div class="image-component-container {displayedDesc.image?"":"gray"}">
                        {#if displayedDesc.image}               
                            <img class="image-component" src='/api/exercise/{displayedDesc.id}/image/{displayedDesc.image}' alt="não encontrado">   
                        {/if}
                    </div>
                    <div class="finish-question">
                        <form bind:this={endForm} method="post" action="?/submitAnswers" use:enhance>
                            <button type="submit" title="Terminar prova" class="end-question-button" on:click={endExercise}><img class="end-image" src={finishImg} alt="Acabar prova"></button>
                        </form>
                    </div>
                {:else}
                    <div class="submitted-answers">
                        <div class="centered">
                            <p>{sumPenalties >= 100 ? "Fizeste muitos erros não passaste a prova" : correctAns.length <= 0 ? "Achaste todas as tapas de resolução":"Não achaste todas as etapas"}</p>
                            <p>Respostas submetidas:</p>
                        </div>
                        {#each answersSubmited as answer}
                            <div class="submission {answer.points === 0 ? "" : answer.points > 0 ? "correct":"wrong"}">
                                <p>{answer.title} ({answer.points > 0 ? "+":""}{answer.points*100/totalMaxScore}%)</p>
                            </div>
                        {/each}
                        {#if answersSubmited.length <= 0}
                            <div class="submission wrong">
                                <p>Não foi submetida nenhuma resposta</p>
                            </div>
                        {/if}
                    </div>
                {/if}
                
            </div>
        </div>
        <Modal bind:this={modal} bind:showModal>
            <h2 slot="header">{res}</h2>
            <div class="modal-answer-message">{displayedMessage}</div>
            <div slot="actions" class="confirm-action">
                <button class="button-confirmation ok"  on:click={() => {modal.close()}}>ok</button>
            </div>
        </Modal>
        {#if displayedQuestionIndex+1 < data.questions.length}
            <a data-sveltekit-reload href="/lessons/{$page.params.id}/exercise={data.questions[displayedQuestionIndex+1].id}">next question</a>
        {/if}
        <!-- <div style="background-color: blue; width: 110%;">hello</div> -->
</main>

<style>
    h1{
        text-align: center;
    }
    
    .container{
        /* position: relative; */
        display: grid;
        grid-template-columns: max(20%, 300px) auto 50%;
        width: 94%;
        min-height: 75vh;
        /* overflow: hidden; */
        margin: auto;
    }

    .container.end-grid{
        grid-template-columns: max(20%, 300px) auto max(20%, 300px);
    }
    
    .exercise-details{
        width: 100%;
        border-right: 1px solid black;
        display: flex;
        flex-direction: column;
        align-items: center;
        /* background-color: black; */
    }

    .div-identifier{
        border-radius: 40px;
        width: fit-content;
        padding: 10px;
        color: white;
        background-color: brown;
    }
    .div-identifier.brown{
        background-color: brown;
    }
    .div-identifier.green{
        margin: 1rem 0 2rem 2.2rem;
        font-size: 15pt;
        background-color: green;
    }

    .title{
        text-align: center;
        margin: 2rem 2rem;
    }

    .exercise-info{
        display: flex;
        width: 90%;
        padding: 4%;
        flex-direction: column;
        border: 1px solid gray;
        border-radius: 20px;
    }

    .center-div{
        position: relative;
        display: flex;
        flex-direction: column;
        /* justify-content: space-between; */
        /* background-color: red; */
    }
    .nav-options{
        position: relative;
        display: flex;
        flex-direction: column;
        width: 90%;
        font-size: 15pt;
        margin-left: 1rem;
        align-items: center;
    }
    .options-labels{
        position: absolute;
        top:100%;
        left: 1rem;
        font-size: 10pt;
        transform: translateY(-100%);
    }

    .right-container{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        /* width: 50%; */
    }

    .image-component-container{
        width: min(70%, 400px);
        height: min(70%, 400px);
        overflow: hidden;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        /* background-color: gray; */
    }
    .image-component-container.gray{
        background-color: rgb(185, 183, 183);
    }

    .image-exercise{
        position: relative;
        max-width: 60%;
        padding: 4%;
        max-height: 300px;
    }

    .image-component{
        max-width: 400px;
        max-height: 400px;
        transition: 0.5s;
        cursor: pointer;
    }
    .image-component:hover{
        max-width: 400px;
        max-height: 400px;
    }
    .message-displayed{
        width: 110%;
    }

    .summary{
        position: relative;
        margin-top: 5rem;
        left: 50%;
        height: max(50%,23.5rem);
        width: max(60%, 30rem);
        transform: translateX(-50%);
        background-color: rgb(180, 180, 180);
        font-size: 18pt;
    }
    .pass{
        width: 100%;
        text-align: center;
        color: white;
        font-size: 45pt;
        padding: 1rem 0;
        background-color: green;
    }
    .answer-stats{
        display: flex;
        justify-content: start;
        margin: 1.4rem;
    }
    .stats-labels{
        width: 50%;
        text-align: end;
        margin: 0rem 1.2rem;
    }

    .submitted-answers{
        width: fit-content;
        /* position: relative; */
        margin-left: 90%;
        margin-top: 3rem;
        transform: translateX(-100%);
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
        position: relative;
        background-color: white;
        width: 80%;
        margin: auto;
        padding: 20px;
        opacity: 100%;
    }

    .modal-content.message{
        width: 20%;
        min-height: 20%;
        border-radius: 20px;
    }

    .button-confirmation.ok{
        position: relative;
        left: 90%;
        transform: translateX(-100%);
        min-width: 4rem;
        padding: 7px 10px;
        border-radius: 10px;
        font: inherit;
        background-color: green;
        color: white;
    }
    
    .button-confirmation:focus{
        border-color: orange;
    }

    .button-option{
        min-width: 25rem;
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

    .end-question-button{
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        cursor: pointer;
        outline: inherit;
        }

    .end-image{
        max-width: 100px;
    }

    .displayed-message{
        text-align: center;
    }

    .timer-container{
        position: relative;
        background-color: aqua;
    }
    .timer{
        position: absolute;
        width: 12rem;
        left: 94%;
        top: 6rem;
        transform: translateX(-100%);
        font-size: 23pt;
    }
    .finish-question{
        position: relative;
        width: 8rem;
        left: 94%;
        transform: translateX(-100%);
        font-size: 23pt;
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

    .modal-answer-message{
        font-size: 18pt;
        padding: 1rem;
    }

</style>