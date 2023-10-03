<script>
    import { goto } from "$app/navigation"
    import { lessonModules } from "./data.js"
    import deleteIcon from "$lib/assets/svg/trash.svg"
    import editIcon from "$lib/assets/svg/pencil.svg"

    let inputTest = [];
    lessonModules.forEach((elem,i) => inputTest[i] = elem.name);
    

    function doSomething(){
        console.log(inputTest);
        goto("/lessons");
    }

</script>

<div class="container">
    <h1> Cursos </h1>
    <button class="admin-edit" on:click={doSomething}>Concluir</button>
    <div class="container-grid">
        {#each lessonModules as module, i}
        <div href="/lessons/{module.id}" class="lessons">
            <div class="lessons-edit">
                <button class="delete"><img src={deleteIcon} alt="deleteIcon" class="delete-icon"></button>
                <button class="edit"><img src={editIcon} alt="editIcon" class="edit-icon"></button>
            </div>
            <img src={module.image} alt="Not found" class="lesson-image">
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
        {/each}
        <a href="/in_construction" class="lessons add">
            Adicionar
        </a>
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
        z-index: 2;
    }
    .lessons.add{
        opacity: 80%;
        background-color: gray;
        justify-content: center;
        color: black;
        text-decoration: none;
        font-size: 40pt;
        transition: 0.5s;
    }
    .lessons.add:hover{
        transform: scale(1.08);
        box-shadow: 10px 8px 7px 5px rgba(87, 87, 87, 0.144);
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
        margin: 0;
    }
    .edit{
        opacity: 70%;
        cursor: pointer;
        margin: 0;
    }
    .delete-icon:hover{
        filter: invert(20%) sepia(67%) saturate(6629%) hue-rotate(357deg) brightness(96%) contrast(129%);
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