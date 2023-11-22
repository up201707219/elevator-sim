<script>
    //import {data} from "./data"
    import {page} from "$app/stores";

    let hasEnded = false;
    let previewImageMenu;
    let previewImageExercise;
    export let data;

    let displayedQuestion = data.questions[0];

    //console.log(data.option[0]);
    
    //--------------TIMER CODE------------------------
    let timer = displayedQuestion.time; // TYPE NUMBER OF SECONDS HERE

    

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

    // OPTIONS NAVIGATION
    function handleOption(index){
        if(displayedOptions[index].response === "menu"){
            prevOptions.push(displayedOptions);
            prevOptions = prevOptions;

            prevDesc.push(displayedDesc);
            prevDesc = prevDesc;

            displayedDesc = displayedOptions[index];
            displayedOptions = data.option.filter((opt) => opt.parent === displayedOptions[index].id);
        }
        else if(displayedOptions[index].response === "answer"){
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

    function goDefault(){
        displayedDesc = defaultDesc;
        displayedOptions = defaultOpt;
        prevOptions = [];
        prevDesc =[];
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
        title: "Nome do botão"       
    };
    
    function addNewButton(){
        newButtonMenu = true;
        newButton = {
            description: "Aqui vai a descrição da ação do menu",
            title: "Nome do botão"       
        };
        newButton.parent = displayedDesc.id;
    }

    function editButton(i){
        newButtonMenu = true;
        newButton = displayedOptions[i];
    }

    function buttonType(){
        newButton.description = (newButton.response === "menu" ? "Aqui vai a descrição da ação do menu" : "Aqui vai a descrição quando resposta submetida");
    }

</script>


<!-- svelte-ignore a11y-autofocus -->
<main>
    <div>
        <a href="{$page.url.pathname}/..">Pré-visualizar</a>
        <form method="post" action="?/copyExercise">
            <button type="submit">+ Nova pergunta</button>
        </form>
    </div>
    <h1>AVARIA</h1>
    
    <div class="container">
            <div class="exercise-details">
                <form method="POST" action="?/updateExercise" enctype="multipart/form-data">
                    <input type="hidden" name="id" value={$page.params.exercise_id}>
                    <textarea class="details-input" name="title" value={displayedQuestion.title}></textarea>
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
            <div class="nav-options">
                {#if !newButtonMenu}
                    <div class="timer">
                        {(hours === 0) ? "": hours+":"}{(minutes/10 >= 1) ? "":"0"}{minutes}:{(seconds/10 >= 1) ? "":"0"}{seconds}    
                    </div>
                    <div class="centered">
                        {displayedDesc.description}
                    </div>
                    {#each displayedOptions as opt, i}
                        <div class="option">
                            <form method="post" action="?/deleteButton">
                            <button type="button" class="button-option {(opt.response === "menu") ? "":"single"}" on:click|preventDefault={() => handleOption(i)}> {opt.title} </button>
                            <button type="button" on:click={()=> {editButton(i)}}>editar</button>
                                <input type="hidden" name="id" value={opt.id}>
                                <button type="submit">del</button>
                            </form>
                        </div>
                    {/each}
                    <div class="option">
                        <button class="button-option add" on:click={addNewButton}>Adicionar opção</button>
                    </div>
                    {#if prevOptions.length !== 0}
                        <button class="button-option return" on:click={() => optionGoBack()}>Voltar</button>
                    {/if}
                {:else}
                    <form method="post" action="?/insertNewButton" enctype="multipart/form-data">
                        <input type="hidden" name="id" value={newButton.id ?? "0"}>
                        <input type="hidden" name="parent-id" value={newButton.parent}>
                        <label for="title">Opção</label>
                        <input type="text" name="title" value={newButton.title}>
                        <label for="response">Tipo</label>
                        <select name="response" bind:value={newButton.response} on:change={buttonType}>
                            <option value="menu">menu</option>
                            <option value="answer">resposta</option>
                        </select>
                        <br>
                        <label for="description">Descrição: </label>
                        <input class="input text" type="text" name="description" value={newButton.description}>
                        {#if newButton.response === "menu"}
                            <br>
                            <img class="input image-component" src={previewImageMenu} alt="imagem da opção"> 
                            <br>
                            <input type="file" name="image" accept="image/*" on:change={(e) => {handleImageUpload(e, "menu")}}>
                        {:else}
                            <br>
                            <input type="number" name="points">
                        {/if}
                        <br>
                        <button type="submit">submeter</button>
                        <button on:click={() => {newButtonMenu = false;}}>sair</button>

                    </form>
                {/if}
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
    .button-option.return{
        background-color: black;
    }
    .button-option.add{
        background-color: green;
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

    .input{
        margin: 0.5rem;
    }
    .input.text{
        width:20rem;
    }

</style>