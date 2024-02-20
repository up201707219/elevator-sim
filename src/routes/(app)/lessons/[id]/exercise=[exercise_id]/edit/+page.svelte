<script>
    //import {data} from "./data"
    import {page} from "$app/stores";
    import Modal from "$lib/modal.svelte";
    import Tree from "$lib/treeView.svelte";

    let hasEnded = false;
    let modal;
    let previewImageMenu;
    let previewImageExercise;
    export let data;

    let displayedQuestionIndex = data.questions.map(function (e) {return e.id;}).indexOf($page.params.exercise_id);
    let displayedQuestion = data.questions[displayedQuestionIndex];
    
    //--------------TIMER CODE------------------------
    let timer = displayedQuestion?.time?? 0; // TYPE NUMBER OF SECONDS HERE

    $: hours = Math.floor(timer / (60*60))
    $: minutes = Math.floor((timer - hours *(60*60)) / 60);
    $: minname = minutes > 1 ? "mins" : "min";
    $: seconds = Math.floor(timer - hours * (60*60) - minutes * 60)

    // MENU DISPLAY OPTIONS VARS

    let defaultOpt = data.option.filter((opt) => opt.parent === null);
    let displayedOptions = defaultOpt;
    let prevDesc = [];
    let prevOptions = [];
    let defaultDesc = {
        description: "Escolha uma opção",
        image: null
    };
    let displayedDesc = defaultDesc;

    let correctAns = data.option.filter((opt) => opt.points > 0 && opt.response==="answer");
    let maxScore = 0;
    correctAns.forEach((elem)=>{
        maxScore += elem.points;
    });

    function analiseTree(parent_id, level){
        let aux = data.option.filter((opt) => opt.parent === parent_id);
        if(!aux){
            return;
        }
        level += 1;
        aux.forEach(element => {
            analiseTree(element.id, level);
            element.level = level;
            // console.log(element);
        });
    }

    function arrToTree(arr, parent_id){
        let aux = arr.filter((opt) => opt.parent === parent_id);
        if(!aux){
            return null;
        }
        aux.forEach(element => {
            element.children = arrToTree(arr, element.id);
            if(element.children.length === 0){
                element.children = null;
            }
        });
        return aux;
    }

    let tree = {
        title: "tree",
        children: []
    };

    tree.children = arrToTree(data.option, null);
    //console.log(tree);

    analiseTree(null, 0);

    function groupBy(xs, prop) {
        var grouped = {};
        for (var i=0; i<xs.length; i++) {
            var p = xs[i][prop];
            if (!grouped[p]) { grouped[p] = []; }
            grouped[p].push(xs[i]);
        }
        return groupToArrays(grouped);
    }
    function groupToArrays(group){
        let res = [[]];
        for(let i=0; i<Object.keys(group).length; i+=1){
            res[i] = group[Object.keys(group)[i]];
        }

        return res
    }

    let maxLevel = 0;

    function sortByLevelParent(arr){
        let aux = [[[]]];
        let leveledArr = groupBy(arr, 'level');
        maxLevel = leveledArr.length;
        for(let i=0; i<leveledArr.length; i+=1){
            aux[i]=groupBy(leveledArr[i], 'parent');
            if(i === 0){
                continue;
            }
            aux[i].forEach((elem, j) => {
                if(arr.find(opt => opt.id === elem[0].parent)?.response !== "menu"){
                    aux[i].splice(j, 1);
                    if(aux[i].length === 0){
                        aux.splice(i, 1);
                    }
                }
            })
        }
        return aux;
    }
    let sortedTree = sortByLevelParent(data.option);

    // OPTIONS NAVIGATION
    function handleOption(index){
        if(displayedOptions[index]?.response === "menu"){
            prevOptions.push(displayedOptions);
            prevOptions = prevOptions;

            prevDesc.push(displayedDesc);
            prevDesc = prevDesc;

            displayedDesc = displayedOptions[index];
            displayedOptions = data.option.filter((opt) => opt.parent === displayedOptions[index].id);
        }
        else if(displayedOptions[index]?.response === "answer"){
            console.log("score setup")
        }
        previewImageMenu = null;
    }
    
    function optionGoBack(){
        displayedOptions = prevOptions.pop();
        displayedDesc = prevDesc.pop();

        prevOptions = prevOptions;
        prevDesc = prevDesc;
    }


    //ADMIN OPTIONS
    function handleImageUpload(e, section){
        let image = e.target.files[0];
        if(!image) return;
        if(section === "menu"){
            previewImageMenu = URL.createObjectURL(image);
        }
        else{
            previewImageExercise = URL.createObjectURL(image);
            console.log(previewImageExercise);
        }
    }

    let newButtonMenu = false;
    let newButton = {
        description: "Aqui vai a descrição da ação do menu",
        title: "Nome do botão",
        response: "menu"  
    };

    let newScore;
    
    function addNewButton(parent){
        newButtonMenu = true;
        newButton = {
            description: "Aqui vai a descrição quando resposta submetida",
            title: "Nome do botão",
            response: "menu"     
        };
        newButton.parent = parent;
    }

    function editButton(button){
        newButtonMenu = true;
        newButton = button;
        newButton.parent = newButton.parent === ''?null:newButton.parent;
    }

    function buttonType(){
        newButton.description = (newButton.response === "menu" ? "Aqui vai a descrição da ação do menu" : "Aqui vai a descrição quando resposta submetida");
    }

</script>


<!-- svelte-ignore a11y-autofocus -->
<main>
    <div style="text-align: center;">
        <a href="{$page.url.pathname}/..">Pré-visualizar</a>
    </div>
    <h1>Pergunta {displayedQuestionIndex+1}</h1>
    
    <div class="container">
        <div class="exercise-details">
            <form method="POST" action="?/updateExercise" enctype="multipart/form-data">
                <input type="hidden" name="id" value={$page.params.exercise_id}>
                <label for="title">Enunciado: </label>
                <textarea class="details-input" name="title" value={displayedQuestion?.title??""}></textarea>
                <br>
                <label for="time">Tempo: </label>
                <input class="time-input" type="number" name="time-hours" value={hours}>h
                <input class="time-input" type="number" name="time-minutes" value={minutes}>min
                <input class="time-input" type="number" name="time-seconds" value={seconds}>s
                <br>
                <label for="cot">Cotação minima</label>
                <input class="time-input" type="number" name="cot" value=70>%
                <br>
                <img class="input image-exercise" src={previewImageExercise} alt="imagem da opção"> 
                <br>
                <input type="file" name="image" accept="image/*" on:change={(e) => {handleImageUpload(e, "exercise")}}>
                <div>
                    <button type="submit">submeter</button>
                </div>
            </form>
        </div>

        <div class="image-component-container">
            {#if prevOptions.length > 0}
                {#if displayedDesc.image}                  
                <img class="image-component" src='/api/exercise/{displayedDesc.id}/image/{displayedDesc.image}' alt="não encontrado"> 
                {:else}
                <span style="border: 1px solid black;">Aqui fica a imagem da componente</span>
                {/if}
            {/if}
        </div>
        <!-- <div class="nav-options">
            {#if !newButtonMenu}
                <div class="timer">
                    {maxScore}/100
                </div>
                <div class="centered">
                    Escolha uma opção
                </div>
                {#each displayedOptions as opt, i}
                    <div class="option">
                        <form method="post" action="?/deleteButton">
                            <button type="button" class="button-option {(opt?.response === "menu") ? "":"single"}" on:click|preventDefault={() => handleOption(i)}> {opt.title??""} </button>
                            <button type="button" on:click={()=> {editButton(opt)}}>editar</button>
                            <input type="hidden" name="id" value={opt.id}>
                            <button type="submit">del</button>
                        </form>
                    </div>
                {/each}
                <div class="option">
                    <button class="button-option add" on:click={()=>{addNewButton(displayedDesc.id)}}>Adicionar opção</button>
                </div>
                {#if prevOptions.length !== 0}
                    <button class="button-option return" on:click={() => optionGoBack()}>Voltar</button>
                {/if}
            {/if}
        </div> -->
        <div>
           
            <form method="post" action="?/copyExercise">
                <button class="question-opt" type="submit">Copiar problema</button>
            </form>
            <br>
            <a class="question-opt" data-sveltekit-reload href="/lessons/{$page.params.id}/exercise=0/edit">Novo problema</a>
            <br>
            <br>
            {#each data.questions as question, i}
                <form style="margin-bottom: 1rem;" method="post" action="?/deleteExercise">
                    <a class="question-nav" data-sveltekit-reload href="/lessons/{$page.params.id}/exercise={question.id}/edit">Pergunta {i+1}</a>
                    <input type="hidden" name="question-redirect" value={data.questions.length <= 1? "0":i === 0 ? data.questions[i+1].id:data.questions[i-1].id}>
                    <input type="hidden" name="question-id" value={question.id}>
                    <button class="exercise-del" type="submit">del</button>
                </form>
            {/each}
        </div>
    </div>
    <div class="tree-display">
        {#if sortedTree[0][0].length > 0}
            {#each sortedTree as level}
                <div class="tree-level">
                    <h1>N{level[0][0].level}</h1>
                    {#each level as parentGroup}
                        <div class="tree-parent-group">
                            <h2>{parentGroup[0].parent? data.option.find((x)=> x.id ===parentGroup[0].parent)?.title :"Nó pai"}</h2>
                            {#each parentGroup as button}
                                <div class="tree-button">
                                    <button type="button" class="button-option {(button.response === "menu") ? "":"single"}" on:click={()=> {editButton(button)}}> {button.title??""} </button>
                                    <div class="add-child-container">    
                                        {#if button.response === "menu"}
                                            <button type="button" class="add-child" on:click={()=> {addNewButton(button.id)}}> + </button>
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                            <div class="tree-button">
                                <button type="button" class="button-option add" on:click={()=>{addNewButton(parentGroup[0].parent)}}> Adicionar opção</button>
                                <div class="add-child-container">
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/each}
        {:else}
            <div class="tree-level">
                <h1>N1</h1>
                <div class="tree-parent-group">
                    <h2>Nó pai</h2>
                    <div class="tree-button">
                        <button type="button" class="button-option add" on:click={()=>{addNewButton(null)}}> Adicionar opção</button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
    <form method="post" action="?/insertNewButton" enctype="multipart/form-data">
        <Modal bind:this={modal} bind:showModal={newButtonMenu}>
            <div class="edit-header" slot="header">
                <h2>{data.option.find((elem) => elem.id === newButton.parent)?.title?? "Nó pai"}</h2>
                <form method="post" action="?/deleteButton" class="delete-button">
                    <input type="hidden" name="id" value={newButton.id}>
                    {#if newButton.id}   
                        <button type="submit">del</button>
                    {/if}
                </form>
            </div>
            <input type="hidden" name="id" value={newButton.id ?? "0"}>
            <input type="hidden" name="parent-id" value={newButton.parent}>
            <label for="title">Opção</label>
            <input type="text" name="title" value={newButton.title}>
            <label for="response">Tipo</label>
            <select name="response" bind:value={newButton.response}>
                <option value="menu">menu</option>
                <option value="answer">resposta</option>
            </select>
            {#if newButton.response === "menu"}
                <br>
                <img class="input image-component" src={previewImageMenu} alt="imagem da opção"> 
                <br>
                <input type="file" name="image" accept="image/*" on:change={(e) => {handleImageUpload(e, "menu")}}>
                <br>
            {:else}
                <br>
                <label for="description">Descrição: </label>
                <textarea class="details-input" type="text" name="description" value={newButton.description}></textarea>
                <br>
                <label for="points">Cotação</label>
                <input type="number" name="points" bind:value={newButton.points}>
                <!-- {#if !newButton.points}
                    <br>
                    Campo obrigatório
                {:else if newButton.points+maxScore > 100}
                    <br>
                    Isto ultrupassa a cotação de 100%
                {/if} -->
            {/if}
            <br>

            <div class="edit-actions" slot="actions">
                <button type="submit">submeter</button>
                <!-- <button disabled={newButton.response === "answer" && (!newButton?.points || newButton.points + maxScore > 100)} type="submit">submeter</button> -->
                <button on:click|preventDefault={() => {newButtonMenu = false; modal.close()}}>sair</button>
            </div>
        
        </Modal>
    </form> 
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

    .exercise-details{
        width: 55%;
    }

    .details-input{
        font-size: inherit;
        font-family: inherit;
        width: 100%;
        height: 4rem;
        resize: none;
    }

    .time-input{
        width:3rem;
        text-align: end;
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

    .image-exercise{
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        max-width: 500px;
        max-height: 500px;
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

    .button-option{
        width: 20rem;
        /* max-width: 100%; */
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

    .button-option.add{
        background-color: green;
    }

    .add-child-container{
        width: 40px;
    }
    .add-child{
        font: inherit;
        color: white;
        padding: 5px;
        min-width: 35px;
        border-radius: 8px;
        position: relative;
        left: 50%;
        margin-top: 8px;
        transform: translateX(-50%);
        background-color: green;
    }

    .input{
        margin: 0.5rem;
    }

    .tree-display{
        display: flex;
    }

    .tree-level{
        /* border: 1px solid black; */
        margin: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .tree-parent-group{
        position: relative;
        border: 1px solid black;
        margin: 1rem;
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items: center;
        padding: 1rem;
    }

    .tree-button{
        width: fit-content;
        display: flex;
    }

    .edit-header{
        position: relative;
    }
    .edit-actions{
        display: flex;
        justify-content: space-around;
    }
    .delete-button{
        position: absolute;
        top: -45px;
        left: 100%;
        transform: translateX(-100%);
    }
    .question-opt{
        width: 17.6rem;
        height: 2rem;
        background-color: greenyellow;
        border: 1px solid black;
        border-radius: 10px;
        font: inherit;
    }
    a.question-opt{
        text-decoration: none;
        color: inherit;
        padding: 0.2rem 5rem;
    }
    .question-nav{
        text-decoration: none;
        color: inherit;
        padding: 0.2rem 6rem;
        background-color: rgb(47, 206, 255);
        border: 1px solid black;
        border-radius: 10px;
        margin-bottom: 4rem;
    }
    .exercise-del{
        background-color: red;
        color: white;
    }
</style>