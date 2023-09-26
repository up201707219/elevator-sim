<script>
    export let data;
</script>

<main>
    <h1>{data.name}</h1>
    {#each data.lessons as lesson, i}
        <div class="lessons">
            <span class="lessons-content">
                Lição {i+1}: {lesson}
            </span>
        </div>    
    {/each}
</main>

<style>
    h1{
        text-align: center;
        margin-bottom: 5rem;
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