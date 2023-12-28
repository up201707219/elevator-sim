<script>
    
    import { lessonModules } from "./data.js"
    import deleteIcon from "$lib/assets/svg/trash.svg"
    import editIcon from "$lib/assets/svg/pencil.svg"
    
    export let data;
    export let form;

    function toggleEdit(){
        editable = !editable;
        if(!editable){
            for(let i = 0; i<message.length; i++){
                message[i] = "";
            }
        }
    }

    let activeCourses=[];
    let nonActiveCourses =[];
    if(data.user.isAdmin !== "false"){
        activeCourses = data.lessonModules;
    }
    else{
        activeCourses = data.lessonModules.filter((lesson) => lesson.lessonsDone !== null);
        nonActiveCourses = data.lessonModules.filter((lesson) => lesson.lessonsDone === null); 
    }
    
    let message = [];
    let inputTest = [];

    for(let i = 0; i<data.lessonModules.length; i++){
        message[i] = "";
        inputTest[i] = data.lessonModules[i].name;
    }



    let editable = data.user.isAdmin === 'true';

</script>

<div class="container">

    <!-- {#if data.user.isAdmin === "true"}
    <button class="admin-edit" on:click={toggleEdit}>{editable ? "Concluir" : "Editar"}</button>
    {/if} -->
    {#if activeCourses.length}
    <h2> Cursos a decorrer</h2>
    {/if}
    <div class="container-grid">
        {#each activeCourses as module, i}
        {#if editable}
            <a data-sveltekit-reload href="/lessons/{module.id}" class="lessons edit">
                
                <div class="image-container">
                    <img src={module.image?"api/lessons/"+module.id:lessonModules[0].image} alt="Not found" class="lesson-image">
                </div>
                <div class="lessons-edit">
                    <form method="POST" action="?/delete">
                        <input type="hidden" name="id" value={module.id}>
                        <button type="submit" class="delete"><img src={deleteIcon} alt="deleteIcon" class="delete-icon"></button>
                    </form>
                    <!-- <button class="edit-button"><img src={editIcon} alt="editIcon" class="edit-icon"></button> -->
                </div>
                <form method="POST" action="?/changeTitle">
                    <input type="hidden" name="id" value={module.id}>
                    <label for="lesson-name">Título: </label>
                    <input type="text" name="lesson-name" value={module.name} autocomplete="off">
                    <button type="submit" class="confirm-title-button">✔️</button>
                </form>
                {message[i]}
            </a>
        {:else}
        <a data-sveltekit-reload href="/lessons/{module.id}" class="lessons {module.lessonsDone !== null?"":"unvisited"}">
            
            <div class="image-container">
                <img src={module.image?"api/lessons/"+module.id:lessonModules[0].image} alt="Not found" class="lesson-image">
            </div>
            <div style="margin: -1rem 0rem 1rem 2rem; padding:0px">
                {module.name}
            </div>
            <div style="margin: 0rem 0rem 1rem 3rem; padding:2px">
                Subtitulo do {module.name}
            </div>
            <div class="completion">
                <span style="margin: 0rem 0rem 0rem 3rem; padding:2px; font-size: 10pt">
                    {#if module.lessonsDone === null}
                        Não Inscrito
                    {:else}
                        {parseInt(module.lessonsTotal) === 0 ? "0" : parseInt(module.lessonsDone*100/module.lessonsTotal)>100?100:parseInt(module.lessonsDone*100/module.lessonsTotal)}% Concluido
                    {/if}
                    
                </span>
                <progress value={module.lessonsDone??0} max={module.lessonsTotal} class="completion-bar"></progress>
            </div>
        </a>
        {/if}
        {/each}
        {#if editable}
        <a data-sveltekit-reload href= "/lessons/0" class="lessons add">
            Adicionar
        </a>
        {/if}
    </div>
    {#if nonActiveCourses.length}
        <h2> Cursos Disponíveis</h2>
    {/if}
    <div class="container-grid">
        {#each nonActiveCourses as module}
        <a data-sveltekit-reload href="/lessons/{module.id}" class="lessons {module.lessonsDone !== null?"":"unvisited"}">
            
            <div class="image-container">
                <img src={module.image?"api/lessons/"+module.id:lessonModules[0].image} alt="Not found" class="lesson-image">
            </div>
            <div style="margin: -1rem 0rem 1rem 2rem; padding:0px">
                {module.name}
            </div>
            <div style="margin: 0rem 0rem 1rem 3rem; padding:2px">
                Subtitulo do {module.name}
            </div>
            <div class="completion">
                <span style="margin: 0rem 0rem 0rem 3rem; padding:2px; font-size: 10pt">
                    {#if module.lessonsDone === null}
                        Não inscrito
                    {:else}
                        {parseInt(module.lessonsTotal) === 0 ? "0" : parseInt(module.lessonsDone*100/module.lessonsTotal)}% Concluido
                    {/if}
                    
                </span>
                <progress value={module.lessonsDone??0} max={module.lessonsTotal} class="completion-bar"></progress>
            </div>
        </a>      
        {/each}
    </div>
    {#if form?.error}
        <p>{form.error}</p>
    {/if}
</div>

<style>
    .container{
        width: 80%;
        margin: 2rem;
        margin-left: 10%;
        margin-right: 10%;
        /* margin-top: 8rem; */
        text-align: start;
    }

    .container-grid{
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: 1fr;
        padding: 1rem;
    }
    .lessons{
        position: relative;
        margin: auto;
        margin-bottom: 2rem;
        margin-top: 2rem;
        width: 86%;
        max-height: 26rem;
        overflow: hidden;
        background-color: white;
        border-radius: 10px;
        box-shadow: 5px 3px 5px 3px rgba(87, 87, 87, 0.219);
        border: 1px solid rgb(117, 116, 116);
        background-color: rgb(255, 255, 255);
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: stretch;
        cursor: pointer;
        z-index: 2;
        transition: 0.5s;
    }

    .lessons.unvisited{
        opacity: 40%;
    }
    .lessons.edit{
        cursor: default;
        transition: none;
        align-items: center;
        padding-bottom: 20px;
    }
    .lessons:hover{
        transform: scale(1.08);
        box-shadow: 10px 8px 7px 5px rgba(87, 87, 87, 0.144);
    }
    .lessons.edit:hover{
        transform: none;
        box-shadow: 5px 3px 5px 3px rgba(87, 87, 87, 0.219);
    }
    .lessons.add{
        opacity: 80%;
        background-color: gray;
        justify-content: center;
        font-size: 40pt;
        align-items: center;
    }
    .lessons-edit{
        position: absolute;
        display: flex;
        flex-direction: column;
        top: 0;
        right: 0;
    }
    .delete{
        opacity: 70%;
        cursor: pointer;
    }
    .delete-icon:hover{
        filter: invert(20%) sepia(67%) saturate(6629%) hue-rotate(357deg) brightness(96%) contrast(129%);
    }
    a{
        text-decoration: none;
        color: black;
    }

    .image-container{
        width: 100%;
        height: 10rem;
        margin-bottom: 2rem;
        display: flex;
        align-items: center;
        overflow: hidden;
    }
    .lesson-image{
        width: 100%;
        height: auto;
        min-height: 10rem;
        text-align: center;

    }
    .completion{
        width: 100%;
        text-align: start;
        margin-bottom: 1.5rem;
        margin-top: auto;
        display: flex;
        flex-direction: column;
    }
    progress.completion-bar{
        width: 80%;
        height: 1rem;
        margin-left: auto;
        margin-right: auto;
        bottom: 10%;
        border-radius: 10px;
        background-color: gray;
        color: greenyellow;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    progress.completion-bar::-moz-progress-bar { 
        border-radius: 10px;
        background: greenyellow;
    }
    progress.completion-bar::-webkit-progress-value{ 
        border-radius: 10px;
        background: greenyellow;
    }
    progress.completion-bar::-webkit-progress-bar{ 
        border-radius: 10px;
    }

    /* .admin-edit{
        background-color: rgb(48, 209, 43);
        color: white;
        border-radius: 10px;
        border-width: 0;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
        padding: 5px 10px;
        cursor: pointer;
    } */
    .confirm-title-button{
        background-color: rgb(48, 209, 43);
        color: white;
        border-radius: 8px;
        padding: 0.3rem;
    }

    @media (max-width: 1100px) {
        .container-grid{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 1fr;
            padding: 1rem;
        }
    }
    @media (max-width: 420px) {
        .container-grid{
            display: block;
            
        }
        .container{
            width: 90%;
            margin: auto;
        }
        .lessons{
            margin-bottom: 3rem;
        }
    }
</style>