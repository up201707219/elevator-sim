<script>
    export let data;
    console.log(data.lessons);
</script>

<main>
    {#each data.lessons as lesson, i}
        <div class="lessons">
            <span class="lessons-content">
                Lesson {i}: {lesson}
            </span>
        </div>    
    {/each}
</main>

<style>
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