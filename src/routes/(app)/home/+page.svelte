<script>
    export let data;
</script>

<main>
    <div class="container">
        <div class="introduction">
            <h1>Bem-Vindo à plataforma de formação da Schmitt-Elevadores</h1>
        </div>
        <div class="description">
            <p>
                Esta plataforma destina-se ao desenvolvimento de competências dos técnicos de manutenção da Schmitt-Elevadores,
                 aqui vai poder encontrar vários cursos para desenvolver as suas competências na manutenção de elevadores.
                  Tem acesso também ao simulador de avarias onde pode praticar a resolução de avarias simuladas pelo formador, de modo a replicar situações reais.
            </p>
        </div>

        <hr>

        <h2>Cursos Disponíveis</h2>
        {#if !data.lessonModules.length}
            <br style="margin: 1rem;">
            <h1>Não existem cursos por se inscrever</h1>
        {/if}
        <div class="container-grid">
            {#each data.lessonModules as module, i}
                <a data-sveltekit-reload href="/lessons/{module.id}" class="lessons {module.lessonsDone !== null?"":"unvisited"}">
            
                    <img src={module.image} alt="Not found" class="lesson-image">
                    <span style="margin: 0rem 0rem 2rem 3rem; padding:2px">
                        {module.name}
                    </span>
                    <div class="completion">
                        <span style="margin: 0rem 0rem 0rem 3rem; padding:2px; font-size: 10pt">
                            {#if !module.lessonsDone}
                                1%
                            {:else}
                                {parseInt(module.lessonsDone*100/module.lessonsTotal)}%
                            {/if}
                            Concluido
                        </span>
                        <progress value={module.lessonsDone??0} max={module.lessonsTotal} class="completion-bar"></progress>
                    </div>
                </a>
            {/each}
        </div>
    </div>
</main>

<style>
    main{
        padding: 0;
        margin: 0;
    }
    .container{
        width: 100%;
        margin: -1.5rem auto 0 auto;
        padding: 0;
    }

    
    .introduction{
        background-color: black;
        color: white;
        height: 10rem;
        width: 100%;
    }
    .introduction h1{
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        font-size: 23pt;
    }
    .description{
        width: 80%;
        margin: 2rem auto;
        font-size: 16pt;
        text-align: end;
        /* border-bottom: 1px solid black; */
    }
    .container-grid{
        display: grid;
        width: 80%;
        margin: 0 auto;
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
        min-height: 12rem;
        text-align: center;
        margin-bottom: 3rem;
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
    h1{
        text-align: center;
    }
    h2{
        margin-left: 10%;
        margin-bottom: 0;
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

