<script>
    
    import { lessonModules } from "./data.js"
    //import { pool } from "$lib/db";
    import deleteIcon from "$lib/assets/svg/trash.svg"
    import editIcon from "$lib/assets/svg/pencil.svg"

    function handleAdminButton(){
        if(editable){
            endEdit();
        }
        else{
            startEdit();
        }
    }

    function endEdit(){
        // try{
        //     const query = 'UPDATE frm.Courses '+
        //     "SET Title = " + inputTest[0] + " " +
        //     "WHERE ID = 1";
            
        //     const res = await pool.query(query);
            
        // }catch (error){
        //     console.error(error);
        // }
        editable = false;
    }

    function startEdit(){
        editable = true;
    }

    export let data;
    let inputTest = [];


    let editable = false;

</script>

<div class="container">
    <h1> Cursos </h1>
    <button class="admin-edit" on:click={handleAdminButton}>{editable ? "Concluir" : "Editar"}</button>
    <div class="container-grid">
        {#each data.lessonModules as module, i}
        {#if editable}
        <div class="lessons edit">
            
            <img src={module.image} alt="Not found" class="lesson-image">
            <div class="lessons-edit">
                <button class="delete"><img src={deleteIcon} alt="deleteIcon" class="delete-icon"></button>
                <button class="edit-button"><img src={editIcon} alt="editIcon" class="edit-icon"></button>
            </div>
            <span style="margin-bottom: 2rem; border:1px solid black; padding:2px" bind:innerText={inputTest[i]} contenteditable>
                {module.name}
            </span>
            <div class="completion">
                <span>
                    {module.lessonsDone}/{module.lessonsTotal}
                </span>
                <progress value={module.lessonsDone} max={module.lessonsTotal} class="completion-bar"></progress>
            </div>
        </div>
        {:else}
        <a href="/lessons/{module.id}" class="lessons">
            
            <img src={module.image} alt="Not found" class="lesson-image">
            <div class="lessons-edit">
                <button class="delete"><img src={deleteIcon} alt="deleteIcon" class="delete-icon"></button>
                <button class="edit-button"><img src={editIcon} alt="editIcon" class="edit-icon"></button>
            </div>
            <span style="margin-bottom: 2rem; padding:2px">
                {module.name}
            </span>
            <div class="completion">
                <span>
                    {module.lessonsDone}/{module.lessonsTotal}
                </span>
                <progress value={module.lessonsDone} max={module.lessonsTotal} class="completion-bar"></progress>
            </div>
        </a>
        {/if}

        {/each}
        {#if editable}
            <a href= "/lessons/0" class="lessons add">
                Adicionar
            </a>
        {/if}
    </div>
</div>

<style>
    .container{
        width: 80%;
        margin: 2rem;
        margin-left: 10%;
        margin-right: 10%;
        /* margin-top: 8rem; */
        text-align: center;
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
        width: 82%;
        max-height: 26rem;
        overflow: hidden;
        background-color: white;
        border-radius: 10px;
        box-shadow: 5px 3px 5px 3px rgba(87, 87, 87, 0.219);
        border: 1px solid rgb(117, 116, 116);
        background-color: rgb(255, 255, 255);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: stretch;
        cursor: pointer;
        z-index: 2;
        transition: 0.5s;
    }
    .lessons.edit{
        cursor: default;
        transition: none;
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
    
    .edit-button{
        opacity: 70%;
        cursor: pointer;
    }
    a{
        text-decoration: none;
        color: black;
    }
    .lesson-image{
        min-width: 100%;
        width: auto;
        height: 12rem;
        text-align: center;
        margin-bottom: 3rem;
    }
    .completion{
        width: 100%;
        text-align: center;
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

    .admin-edit{
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