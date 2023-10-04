<script>
    
    import { lessonModules } from "./data.js"

    export let data;
    let inputTest;

</script>

<div class="container">
    <h1> Cursos </h1>
    <a class="admin-edit" href="/lessons/edit">Editar</a>
    <div class="container-grid">
        {#each data.lessonModules as module}
        <a href="/lessons/{module.id}" class="lessons">
            <img src={module.image} alt="Not found" class="lesson-image">
            <span style="margin-bottom: 2rem;">
                {module.name}
            </span>
            <div class="completion">
                <span>
                    {module.lessonsDone}/{module.lessonsTotal}
                </span>
                <progress value={module.lessonsDone} max={module.lessonsTotal} class="completion-bar"></progress>
            </div>
        </a>
        {/each}
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
    .lessons:hover{
        transform: scale(1.08);
        box-shadow: 10px 8px 7px 5px rgba(87, 87, 87, 0.144);
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
        padding: 5px 10px;
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