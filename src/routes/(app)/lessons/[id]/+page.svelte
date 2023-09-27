<script>
    export let data;
</script>

<main>
    <div class="course-details">
        <h1>{data.name}</h1>
        <p><b>Descrição:</b> {@html data.description}</p>
        <p><b>Duração:</b> {data.dur_min}-{data.dur_max}</p>
    </div>
    {#each data.lessons as lesson, i}
    <a href="/in_construction">
        <div class="lesson">
            <span class="lesson-content">Módulo {i+1}: {lesson}</span>
        </div>    
    </a>
    {/each}
    {#if data.lessons.length === 0}
        <h2>Não existem lições para este módulo</h2>
    {/if}
</main>

<style>
    .course-details{
        margin-left: auto;
        margin-right: auto;
        width: 80%;
        text-align: start;
        margin-top: 3rem;
        margin-bottom: 4rem;
    }

    h2{
        text-align: center;
        margin-top: 3rem;
    }
    .lesson{
        width: 80%;
        margin:2rem auto auto auto;
        padding: 1rem;
        background-color: rgb(173, 173, 173);
        border-radius: 10px;
    }
    .lesson:hover{
        background-color: rgb(146, 146, 146);
    }
    .lesson-content{
        margin-left: 2rem;
    }
    a{
        text-decoration: none;
        color: black;
    }
</style>