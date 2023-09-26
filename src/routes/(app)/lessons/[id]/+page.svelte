<script>
    export let data;
</script>

<main>
    <h1>{data.name}</h1>
    {#each data.lessons as lesson, i}
        <div class="lessons">
            <span class="lessons-content">Módulo {i+1}: {lesson}</span>
        </div>    
    {/each}
    {#if data.lessons.length === 0}
        <h2>Não existem lições para este módulo</h2>
    {/if}
</main>

<style>
    h1{
        text-align: center;
        margin-top: 3rem;
        margin-bottom: 4rem;
    }
    h2{
        text-align: center;
        margin-top: 3rem;
    }
    .lessons{
        width: 80%;
        margin:2rem auto auto auto;
        padding: 1rem;
        background-color: rgb(173, 173, 173);
        border-radius: 10px;
    }
    .lessons:hover{
        background-color: rgb(146, 146, 146);
    }
    .lessons-content{
        margin-left: 2rem
    }
</style>